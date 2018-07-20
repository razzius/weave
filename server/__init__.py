import os
import uuid

from flask import Flask, jsonify, request, send_from_directory
from sqlalchemy import func, or_, and_
from sqlalchemy.sql import exists

from cloudinary import uploader
from flask_cors import CORS
from marshmallow import Schema, ValidationError, fields
from requests_toolbelt.utils import dump

from .models import Profile, Email, VerificationToken, db
from .emails import send_confirmation_token, send_login_email


app = Flask(__name__, static_url_path='/static', static_folder='../build/static')

app.config['SQLALCHEMY_DATABASE_URI'] = os.environ['DATABASE_URL']
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['SQLALCHEMY_ECHO'] = app.debug
<<<<<<< HEAD:server/__init__.py
=======
db = SQLAlchemy(app)
CORS(app)



db.init_app(app)
CORS(app)


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
    return send_from_directory('../build', 'index.html')


def matching_profiles(query):
    if query is None:
        return Profile.query.all()

    words = query.lower().split()

    searchable_fields = [
        Profile.name,
        Profile.additional_information,
        Profile.clinical_specialties,
        Profile.additional_interests,
        Profile.affiliations,
    ]

    filters = and_(*[
        or_(*[
            func.lower(field).contains(word)
            for field in searchable_fields
        ])
        for word in words
    ])

    return Profile.query.filter(*filters)


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
    return jsonify(reason), 400


@app.route('/api/profile', methods=['POST'])
def create_profile(profile_id=None):
    json_data = request.get_json()

    try:
        schema = profile_schema.load(json_data)
    except ValidationError as err:
        return jsonify(err.messages), 422

    if schema.errors:
        return jsonify(schema.errors), 422

    if db.session.query(exists().where(Email.email == schema.data['email'])).scalar():
        return error({'email': ['This email already exists in the database']})

    profile_data = {
        key: value
        for key, value in schema.data.items()
        if key != 'email'
    }
    profile = Profile(**profile_data)

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
    email = request.json['email']

    token = str(uuid.uuid4())

    email_row = VerificationEmail(email=email)
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


def api_post(route):
    return app.route(f'/api/{route}', methods=['POST'])


@api_post('login')
def login():
    email = request.json['email']

    matches = Email.query.filter(Email.email == email).one_or_none()

    if matches is None:
        return error({'email': 'unregistered'})

    send_login_email(email)

    return jsonify({
        'email': email
    })
