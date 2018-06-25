import json
import os
import uuid
from datetime import datetime

from flask import Flask, Response, jsonify, request, send_from_directory

from cloudinary import uploader
from emails import send_confirmation_token
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy
from marshmallow import Schema, ValidationError, fields
from requests_toolbelt.utils import dump
from sqlalchemy import func, or_
from sqlalchemy.sql import exists
from sqlalchemy.types import VARCHAR, TypeDecorator


app = Flask(__name__, static_url_path='/static', static_folder='build/static')
app.config['SQLALCHEMY_DATABASE_URI'] = os.environ['DATABASE_URL']
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['SQLALCHEMY_ECHO'] = app.debug
db = SQLAlchemy(app)
CORS(app)


class StringEncodedList(TypeDecorator):

    impl = VARCHAR

    def process_bind_param(self, value, dialect):
        if isinstance(value, str):
            return value

        return ','.join(value)

    def process_result_value(self, value, dialect):
        if value == '':
            return []
        else:
            return value.split(',')


class Email(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String(120), unique=True, nullable=False)


class Profile(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(255), nullable=False)

    profile_image_url = db.Column(db.String(255))

    clinical_specialties = db.Column(StringEncodedList(1024))
    affiliations = db.Column(StringEncodedList(1024))
    additional_interests = db.Column(StringEncodedList(1024))

    date_created = db.Column(db.DateTime, nullable=False, default=datetime.utcnow)
    date_updated = db.Column(db.DateTime, nullable=False, default=datetime.utcnow)

    additional_information = db.Column(db.String(500), nullable=False)

    willing_shadowing = db.Column(db.Boolean, default=False)
    willing_networking = db.Column(db.Boolean, default=False)
    willing_goal_setting = db.Column(db.Boolean, default=False)
    willing_discuss_personal = db.Column(db.Boolean, default=False)
    willing_residency_application = db.Column(db.Boolean, default=False)

    cadence = db.Column(db.String(255))
    other_cadence = db.Column(db.String(255), nullable=True)

    def __repr__(self):
        return f'<Profile id={self.id} name={self.name}>'


class VerificationToken(db.Model):
    token = db.Column(db.String(36), primary_key=True)
    email_id = db.Column(db.Integer, db.ForeignKey(Profile.id), nullable=False)
    date_created = db.Column(db.DateTime, nullable=False, default=datetime.utcnow)
    verified = db.Column(db.Boolean, default=False)

    email_log = db.Column(db.Text)


class RenderedList(fields.List):
    def _serialize(self, value, attr, obj):
        if value is None:
            return []
        return super()._serialize(value, attr, obj)

    def _deserialize(self, value, attr, data):
        if value is None:
            return ''
        return super()._deserialize(value, attr, data)


class ProfileSchema(Schema):
    id = fields.Int(dump_only=True)
    name = fields.String()
    email = fields.String()
    profile_image_url = fields.String(allow_none=True)

    clinical_specialties = RenderedList(fields.String, required=True)
    additional_interests = RenderedList(fields.String, required=True)
    affiliations = RenderedList(fields.String, required=True)

    additional_information = fields.String()

    willing_shadowing = fields.Boolean()
    willing_networking = fields.Boolean()
    willing_goal_setting = fields.Boolean()
    willing_discuss_personal = fields.Boolean()
    willing_residency_application = fields.Boolean()

    cadence = fields.String()
    other_cadence = fields.String(allow_none=True)


profile_schema = ProfileSchema()
profiles_schema = ProfileSchema(many=True)


@app.route('/')
@app.route('/<path:path>')  # Enable any url redirecting to home for SPA
def index(path=None):
    return send_from_directory('build', 'index.html')


def matching_profiles(query):
    if query is None:
        return Profile.query.all()

    searchable_fields = [
        Profile.name,
        Profile.additional_information,
        Profile.clinical_specialties,
        Profile.additional_interests,
        Profile.affiliations,
    ]

    filters = [func.lower(field).contains(query) for field in searchable_fields]

    return Profile.query.filter(or_(*filters))


@app.route('/api/profiles')
def get_profiles():
    query = request.args.get('query')

    return jsonify(profiles_schema.dump(matching_profiles(query)).data)


@app.route('/api/profiles/<profile_id>')
def get_profile(profile_id=None):
    return jsonify(
        profile_schema.dump(
            Profile.query.filter(Profile.id == profile_id).one_or_none()
        ).data
    )


def error(reason):
    return Response(json.dumps(reason), status=400, content_type='application/json')


@app.route('/api/profile', methods=['POST'])
def create_profile(profile_id=None):
    json_data = request.get_json()

    try:
        schema = profile_schema.load(json_data)
    except ValidationError as err:
        return jsonify(err.messages), 422

    if schema.errors:
        return jsonify(schema.errors), 422

    if db.session.query(exists().where(Profile.email == schema.data['email'])).scalar():
        return error({'email': ['This email already exists in the database']})

    profile = Profile(**schema.data)
    db.session.add(profile)
    db.session.commit()

    return jsonify(profile_schema.dump(profile).data)


@app.route('/api/profile/<profile_id>', methods=['PUT'])
def update_profile(profile_id=None):
    profile = Profile({})
    db.session.add(profile)
    db.session.commit()

    return jsonify(ProfileSchema().dump(profile).data)


@app.route('/api/upload-image', methods=['POST'])
def upload_image():
    data = request.data

    if not data:
        return error({'file': 'No image sent'})

    response = uploader.upload(
        data, eager=[{'width': 200, 'height': 200, 'crop': 'crop'}]
    )

    return jsonify({'image_url': response['eager'][0]['secure_url']})


@app.route('/api/send-verification-email', methods=['POST'])
def send_verification_email():
    data = request.json

    email = data['email']

    token = str(uuid.uuid4())

    email_row = Email(email=email)
    db.session.add(email_row)
    db.session.commit()  # Could we avoid this commit?

    email_response = send_confirmation_token(email, token)
    email_log = dump.dump_all(email_response).decode('utf-8')

    verification_token = VerificationToken(
        email_id=email_row.id,
        token=token,
        email_log=email_log
    )

    db.session.add(verification_token)
    db.session.commit()

    return jsonify({
        'id': email_row.id,
        'email': email
    })
