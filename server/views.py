import uuid

from flask import Blueprint, jsonify, request
from sqlalchemy import func, or_, and_
from sqlalchemy.sql import exists

from cloudinary import uploader
from marshmallow import Schema, ValidationError, fields
from requests_toolbelt.utils import dump

from .models import Profile, VerificationEmail, VerificationToken, db
from .emails import send_student_registration_email, send_faculty_registration_email


api = Blueprint('api', __name__)


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
    contact_email = fields.String()
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


class SendVerificationEmailSchema(Schema):
    email = fields.String()


profile_schema = ProfileSchema()
profiles_schema = ProfileSchema(many=True)
send_verification_email_schema = SendVerificationEmailSchema()


@api.errorhandler(ValidationError)
def handle_invalid_schema(error):
    return {'hi': 'there'}


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
        # cadence
    ]

    filters = and_(
        *[
            or_(*[func.lower(field).contains(word) for field in searchable_fields])
            for word in words
        ]
    )

    return Profile.query.filter(*filters)


@api.route('/api/profiles')
def get_profiles():
    query = request.args.get('query')

    return jsonify(profiles_schema.dump(matching_profiles(query)).data)


@api.route('/api/profiles/<profile_id>')
def get_profile(profile_id=None):
    return jsonify(
        profile_schema.dump(
            Profile.query.filter(Profile.id == profile_id).one_or_none()
        ).data
    )


def error(reason):
    return jsonify(reason), 400


def api_post(route):
    return api.route(f'/api/{route}', methods=['POST'])


@api_post('profile')
def create_profile(profile_id=None):
    schema = profile_schema.load(request.json)
    try:
        schema = profile_schema.load(request.json)
    except ValidationError as err:
        return jsonify(err.messages), 422

    if schema.errors:
        return jsonify(schema.errors), 422

    if db.session.query(
        exists().where(Profile.contact_email == schema.data['contact_email'])
    ).scalar():
        return error({'email': ['This email already exists in the database']})

    profile = Profile(**schema.data)

    db.session.add(profile)
    db.session.commit()

    return jsonify(profile_schema.dump(profile).data)


# @app.route('/api/profile/<profile_id>', methods=['PUT'])
# def update_profile(profile_id=None):
#     profile = Profile({})
#     db.session.add(profile)
#     db.session.commit()

#     return jsonify(ProfileSchema().dump(profile).data)


def generate_token():
    return str(uuid.uuid4())


@api_post('upload-image')
def upload_image():
    data = request.data

    if not data:
        return error({'file': 'No image sent'})

    response = uploader.upload(
        data, eager=[{'width': 200, 'height': 200, 'crop': 'crop'}]
    )

    return jsonify({'image_url': response['eager'][0]['secure_url']})


def get_verification_email(email: str) -> VerificationEmail:
    email = request.json['email']

    existing_email = VerificationEmail.query.filter(
        VerificationEmail.email == email
    ).one_or_none()

    if existing_email:
        return existing_email

    email_row = VerificationEmail(email=email)
    db.session.add(email_row)
    db.session.commit()

    return email_row


def save_verification_token(email_id, token, email_response):
    email_log = dump.dump_all(email_response).decode('utf-8')

    verification_token = VerificationToken(
        email_id=email_id, token=token, email_log=email_log
    )

    db.session.add(verification_token)
    db.session.commit()


@api_post('send-faculty-verification-email')
def send_faculty_verification_email():
    email = send_verification_email_schema.load(request.json).data['email']

    verification_email = get_verification_email(email)

    token = generate_token()

    email_response = send_faculty_registration_email(email, token)

    save_verification_token(verification_email.id, token, email_response)

    return jsonify({'id': verification_email.id, 'email': email})


@api_post('send-student-verification-email')
def send_student_verification_email():
    email = send_verification_email_schema.load(request.json)['email']

    verification_email = get_verification_email(email)

    token = generate_token()

    email_response = send_student_registration_email(email, token)

    save_verification_token(verification_email.id, token, email_response)

    return jsonify({'id': verification_email.id, 'email': email})


# @api_post('login')
# def login():
#     email = request.json['email']

#     matches = VerificationEmail.query.filter(VerificationEmail.email == email).one_or_none()

#     if matches is None:
#         return error({'email': 'unregistered'})

#     send_login_email(email)

#     return jsonify({
#         'email': email
#     })


@api_post('verify-token')
def verify_token():
    token = request.json['token']

    query = VerificationToken.query.filter(VerificationToken.token == token)
    match = query.one_or_none()

    if match is None:
        return error(
            {'token': 'Verification token not recognized.'}
        )  # TODO please contact us

    match.verified = True
    db.session.add(match)
    db.session.commit()

    verification_email = VerificationEmail.query.get(match.email_id)

    return jsonify({'email': verification_email.email})


def get_profile_by_token(token):
    verification_token = VerificationToken.query.get(token)

    verification_email = VerificationEmail.query.get(verification_token.email_id)

    return Profile.query.filter(
        Profile.verification_email == verification_email.id
    ).one()


@api_post('availability')
def availability():
    token = request.json['token']

    available = request.json['available']

    profile = get_profile_by_token(token)

    profile.available_for_mentoring = available

    db.session.add(profile)
    db.session.commit()

    return jsonify({'available': available})
