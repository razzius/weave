import datetime
import uuid
from http import HTTPStatus

import flask_login
from cloudinary import uploader
from flask import jsonify, make_response, request
from marshmallow import ValidationError
from sentry_sdk import capture_exception
from sqlalchemy import and_, asc, desc, exists, func, text
from structlog import get_logger

from server.emails import (
    send_faculty_login_email,
    send_faculty_registration_email,
    send_student_login_email,
    send_student_registration_email,
)
from server.models import (
    ActivityOption,
    ClinicalSpecialtyOption,
    DegreeOption,
    FacultyClinicalSpecialty,
    FacultyHospitalAffiliation,
    FacultyPartsOfMe,
    FacultyProfessionalInterest,
    FacultyProfile,
    FacultyProfileActivity,
    FacultyProfileDegree,
    HospitalAffiliationOption,
    PartsOfMeOption,
    ProfessionalInterestOption,
    ProfileStar,
    StudentProfile,
    VerificationEmail,
    VerificationToken,
    db,
    save,
)
from server.queries import (
    add_stars_to_profiles,
    get_profile_by_token,
    get_verification_email_by_email,
    matching_faculty_profiles,
    matching_student_profiles,
    query_faculty_profiles_and_stars,
    query_profile_tags,
    query_searchable_tags,
)
from server.schemas import (
    faculty_profile_schema,
    faculty_profiles_schema,
    valid_email_schema,
)
from server.session import token_expired
from server.views.pagination import paginate

from . import student_profile
from .blueprint import api
from .exceptions import (
    ForbiddenError,
    InvalidPayloadError,
    LoginTimeoutError,
    UnauthorizedError,
    UserError,
)
from .utils import get_base_fields, save_tags


__all__ = ["student_profile"]


log = get_logger()


def render_matching_profiles(profiles_queryset, verification_email_id, profile_class):
    page = int(request.args.get("page", 1))

    sorting = request.args.get("sorting", "starred")

    start, end = paginate(page)

    def get_ordering(sorting):
        last_name_sorting = func.split_part(
            profile_class.name,
            " ",
            func.array_length(
                func.string_to_array(profile_class.name, " "),
                1,  # Length in the 1st dimension
            ),
        )

        sort_options = {
            "starred": [
                desc(text("profile_star_count")),
                desc(profile_class.date_updated),
            ],
            "last_name_alphabetical": [asc(last_name_sorting)],
            "last_name_reverse_alphabetical": [desc(last_name_sorting)],
            "date_updated": [desc(profile_class.date_updated)],
        }

        if sorting not in sort_options:
            raise InvalidPayloadError({"sorting": ["invalid"]})

        return sort_options[sorting]

    ordering = [
        # Is this the logged-in user's profile? If so, return it first (false)
        profile_class.verification_email_id != verification_email_id,
        *get_ordering(sorting),
    ]

    sorted_queryset = profiles_queryset.order_by(*ordering)

    sliced_queryset = sorted_queryset[start:end]

    profiles_with_stars = add_stars_to_profiles(sliced_queryset)

    return jsonify(
        {
            "profile_count": profiles_queryset.count(),
            "profiles": faculty_profiles_schema.dump(profiles_with_stars),
        }
    )


@api.route("/profiles")
@flask_login.login_required
def get_profiles():
    verification_token = flask_login.current_user

    query = request.args.get("query", "")
    tags = request.args.get("tags", "")
    degrees = request.args.get("degrees", "")
    affiliations = request.args.get("affiliations", "")

    verification_email_id = verification_token.email_id

    profiles_queryset = (
        matching_faculty_profiles(
            query,
            tags,
            degrees,
            affiliations,
            verification_email_id=verification_email_id,
        )
        .join(
            VerificationEmail,
            FacultyProfile.verification_email_id == VerificationEmail.id,
        )
        .filter(VerificationEmail.is_mentor.is_(True))
    )

    return render_matching_profiles(
        profiles_queryset, verification_email_id, profile_class=FacultyProfile
    )


@api.route("/peer-profiles")
@flask_login.login_required
def peer_profiles():
    verification_token = flask_login.current_user

    if verification_token.email.is_mentor:
        raise ForbiddenError(
            {"error": ["Peer to peer mentorship is only available for students"]}
        )

    query = request.args.get("query", "")
    tags = request.args.get("tags", "")
    affiliations = request.args.get("affiliations", "")

    verification_email_id = verification_token.email_id

    profiles_queryset = (
        matching_student_profiles(
            query, tags, affiliations, verification_email_id=verification_email_id,
        )
        .join(
            VerificationEmail,
            StudentProfile.verification_email_id == VerificationEmail.id,
        )
        .filter(VerificationEmail.is_mentor.is_(False))
    )
    return render_matching_profiles(
        profiles_queryset, verification_email_id, profile_class=StudentProfile
    )


@api.route("/profile-tags")
@flask_login.login_required
def get_profile_tags():
    tags = query_profile_tags()

    return {"tags": tags}


@api.route("/search-tags")
@flask_login.login_required
def get_search_tags():
    tags = query_searchable_tags()

    return {"tags": tags}


@api.route("/profiles/<profile_id>")
@flask_login.login_required
def get_profile(profile_id=None):
    verification_token = flask_login.current_user

    profile_and_star_list = query_faculty_profiles_and_stars(
        verification_email_id=verification_token.email_id
    ).filter(FacultyProfile.id == profile_id)

    if not profile_and_star_list.first():
        raise UserError({"profile_id": ["Not found"]}, HTTPStatus.NOT_FOUND.value)

    profile, star_count = profile_and_star_list[0]

    # TODO do these without mutating profile
    profile.starred = star_count > 0
    profile.is_faculty = profile.verification_email.is_mentor

    response = make_response(jsonify(faculty_profile_schema.dump(profile)))

    response.headers["Cache-Control"] = "public, max-age=0"
    response.headers["Pragma"] = "no-cache"
    response.headers["Expires"] = "0"

    return response


def save_all_tags(profile, schema):
    save_tags(
        profile,
        schema["affiliations"],
        HospitalAffiliationOption,
        FacultyHospitalAffiliation,
    )
    save_tags(
        profile,
        schema["clinical_specialties"],
        ClinicalSpecialtyOption,
        FacultyClinicalSpecialty,
    )
    save_tags(
        profile,
        schema["professional_interests"],
        ProfessionalInterestOption,
        FacultyProfessionalInterest,
    )
    save_tags(profile, schema["parts_of_me"], PartsOfMeOption, FacultyPartsOfMe)
    save_tags(profile, schema["activities"], ActivityOption, FacultyProfileActivity)
    save_tags(profile, schema["degrees"], DegreeOption, FacultyProfileDegree)


def basic_faculty_profile_data(schema):
    """
Gets fields on the schema that are directly stored on the profile, as
    opposed to many-to-many fields that are stored in other tables.
    """
    base_fields = get_base_fields(schema)

    return {
        **base_fields,
        "willing_shadowing": schema.get("willing_shadowing"),
        "willing_networking": schema.get("willing_networking"),
        "willing_goal_setting": schema.get("willing_goal_setting"),
        "willing_career_guidance": schema.get("willing_career_guidance"),
    }


@api.route("/profile", methods=["POST"])
@flask_login.login_required
def create_faculty_profile():
    verification_token = flask_login.current_user

    try:
        schema = faculty_profile_schema.load(request.json)
    except ValidationError as err:
        capture_exception(err)
        raise InvalidPayloadError(err.messages)

    if db.session.query(
        exists().where(FacultyProfile.contact_email == schema["contact_email"])
    ).scalar():
        raise UserError({"email": ["This email already exists in the database"]})

    profile_data = {
        "verification_email_id": verification_token.email_id,
        **basic_faculty_profile_data(schema),
    }

    profile = save(FacultyProfile(**profile_data))

    save_all_tags(profile, schema)

    return jsonify(faculty_profile_schema.dump(profile)), HTTPStatus.CREATED.value


@api.route("/profiles/<profile_id>", methods=["PUT"])
@flask_login.login_required
def update_faculty_profile(profile_id=None):
    try:
        schema = faculty_profile_schema.load(request.json)
    except ValidationError as err:
        capture_exception(err)
        raise InvalidPayloadError(err.messages)

    verification_token = flask_login.current_user

    profile = FacultyProfile.query.get(profile_id)

    is_admin = VerificationEmail.query.filter(
        VerificationEmail.id == verification_token.email_id
    ).value(VerificationEmail.is_admin)

    log.info(
        "Edit faculty profile",
        profile_id=profile_id,
        is_admin=is_admin,
        token_id=verification_token.id,
        email=verification_token.email.email,
    )

    assert is_admin or profile.verification_email_id == verification_token.email_id

    profile_data = basic_faculty_profile_data(schema)

    for key, value in profile_data.items():
        setattr(profile, key, value)

    editing_as_admin = (
        is_admin and profile.verification_email_id != verification_token.email_id
    )

    if not editing_as_admin:
        profile.date_updated = datetime.datetime.utcnow()

    save(profile)

    # TODO rather than deleting all, delete only ones that haven't changed
    profile_relation_classes = {
        FacultyProfessionalInterest,
        FacultyProfileActivity,
        FacultyHospitalAffiliation,
        FacultyPartsOfMe,
        FacultyClinicalSpecialty,
        FacultyProfileDegree,
    }
    for profile_relation_class in profile_relation_classes:
        profile_relation_class.query.filter(
            profile_relation_class.profile_id == profile.id
        ).delete()

    save_all_tags(profile, schema)

    return jsonify(faculty_profile_schema.dump(profile))


def generate_token():
    return str(uuid.uuid4())


@api.route("/upload-image", methods=["POST"])
@flask_login.login_required
def upload_image():
    data = request.data

    if not data:
        raise UserError({"file": ["No image sent"]})

    response = uploader.upload(
        data, eager=[{"width": 200, "height": 200, "crop": "crop"}]
    )

    return jsonify({"image_url": response["eager"][0]["secure_url"]})


def get_or_create_verification_email(email: str, is_mentor: bool) -> VerificationEmail:
    existing_email = get_verification_email_by_email(email)

    if existing_email:
        return existing_email

    verification_email = VerificationEmail(email=email, is_mentor=is_mentor)

    save(verification_email)

    return verification_email


def save_verification_token(email_id, token, is_personal_device):
    verification_token = VerificationToken(
        email_id=email_id, token=token, is_personal_device=is_personal_device
    )

    save(verification_token)

    return verification_token


def send_token(verification_email, email_function, is_personal_device):
    token = generate_token()

    verification_token = save_verification_token(
        verification_email.id, token, is_personal_device
    )

    email_log = email_function(verification_email.email, verification_token)

    verification_token.email_log = email_log

    return save(verification_token)


def process_send_verification_email(is_mentor):
    email_function = (
        send_faculty_registration_email
        if is_mentor
        else send_student_registration_email
    )

    try:
        schema = valid_email_schema.load(request.json)
    except ValidationError as err:
        capture_exception(err)
        raise InvalidPayloadError(err.messages)

    email = schema["email"].lower()

    is_personal_device = schema["is_personal_device"]

    existing_email = get_verification_email_by_email(email)

    if existing_email:
        raise UserError({"email": ["claimed"]})

    verification_email = get_or_create_verification_email(email, is_mentor=is_mentor)

    send_token(
        verification_email,
        email_function=email_function,
        is_personal_device=is_personal_device,
    )

    return jsonify({"id": verification_email.id, "email": email})


@api.route("/send-faculty-verification-email", methods=["POST"])
def send_faculty_verification_email():
    return process_send_verification_email(is_mentor=True)


@api.route("/send-student-verification-email", methods=["POST"])
def send_student_verification_email():
    return process_send_verification_email(is_mentor=False)


@api.route("/login", methods=["POST"])
def login():
    schema = valid_email_schema.load(request.json)

    if "errors" in schema:
        raise InvalidPayloadError(schema.errors)

    email = schema["email"].lower()

    is_personal_device = schema["is_personal_device"]

    verification_email = VerificationEmail.query.filter(
        VerificationEmail.email == email
    ).one_or_none()

    if verification_email is None:
        raise UserError({"email": ["unregistered"]})

    email_function = (
        send_faculty_login_email
        if verification_email.is_mentor
        else send_student_login_email
    )

    send_token(
        verification_email,
        email_function=email_function,
        is_personal_device=is_personal_device,
    )

    return jsonify({"email": email})


def validate_verification_token(verification_token):
    if not verification_token.is_authenticated:
        if verification_token.logged_out:
            log.info("Token logged_out", token_id=verification_token.id)

            flask_login.logout_user()

            raise UnauthorizedError({"token": ["logged out"]})

        if token_expired(verification_token):
            flask_login.logout_user()

            raise LoginTimeoutError({"token": ["expired"]})

        raise UnauthorizedError({"token": ["unknown error"]})


def get_token_from_parameters() -> VerificationToken:
    """
    Once a user is logged in, they will be stored in the session cookie.

    On the first login, they will pass the token as a json parameter.
    """
    token = request.json.get("token")

    if token is None:
        log.info("POST token not set")

        raise UnauthorizedError({"token": ["not set"]})

    query = VerificationToken.query.filter(VerificationToken.token == token)

    verification_token = query.one_or_none()

    if verification_token is None:
        log.info("POST token not recognized")

        raise UnauthorizedError({"token": ["not recognized"]})

    if verification_token.verified:
        log.warning("Token already verified", token_id=verification_token.id)

        raise UnauthorizedError({"token": ["already verified"]})

    validate_verification_token(verification_token)

    verification_token.verified = True
    save(verification_token)

    if flask_login.current_user.is_anonymous:
        flask_login.login_user(verification_token)

    return verification_token


def logout_other_tokens(verification_email, verification_token):
    VerificationToken.query.filter(
        VerificationToken.email_id == verification_email.id,
        VerificationToken.token != verification_token.token,
    ).update({VerificationToken.logged_out: True})


def render_verification_token_account(verification_token):
    verification_email = verification_token.email

    profile = get_profile_by_token(verification_token)

    profile_id = profile.id if profile is not None else None

    available_for_mentoring = (
        profile.available_for_mentoring if profile is not None else None
    )

    return jsonify(
        {
            "email": verification_email.email,
            "is_mentor": verification_email.is_mentor,
            "is_admin": verification_email.is_admin,
            "profile_id": profile_id,
            "available_for_mentoring": available_for_mentoring,
        }
    )


@api.route("/verify-token", methods=["POST"])
def verify_token():
    verification_token = get_token_from_parameters()

    verification_email = verification_token.email

    logout_other_tokens(verification_email, verification_token)

    log.info(
        "Logged in", email=verification_email.email, token_id=verification_token.id
    )

    return render_verification_token_account(verification_token)


@api.route("/account")
@flask_login.login_required
def account():
    verification_token = flask_login.current_user

    validate_verification_token(verification_token)

    return render_verification_token_account(verification_token)


@api.route("/logout", methods=["POST"])
@flask_login.login_required
def logout():
    verification_token = flask_login.current_user
    verification_token.logged_out = True
    save(verification_token)

    flask_login.logout_user()

    return {}


@api.route("/availability", methods=["POST"])
@flask_login.login_required
def availability():
    verification_token = flask_login.current_user

    profile = get_profile_by_token(verification_token)

    available = request.json["available"]

    profile.available_for_mentoring = available
    profile.date_updated = datetime.datetime.utcnow()

    save(profile)

    return jsonify({"available": available})


@api.route("/star_profile", methods=["POST"])
@flask_login.login_required
def star_profile():
    verification_token = flask_login.current_user

    from_email_id = verification_token.email_id

    if "profile_id" not in request.json:
        return (
            jsonify({"profile_id": ["`profile_id` missing from request"]}),
            HTTPStatus.UNPROCESSABLE_ENTITY.value,
        )

    to_profile_id = request.json["profile_id"]
    to_profile = FacultyProfile.query.get(to_profile_id)

    if to_profile is None:
        return (
            jsonify({"profile_id": ["`profile_id` invalid"]}),
            HTTPStatus.UNPROCESSABLE_ENTITY.value,
        )

    to_verification_email_id = to_profile.verification_email.id
    if to_verification_email_id == from_email_id:
        return (
            jsonify({"profile_id": ["Cannot star own profile"]}),
            HTTPStatus.UNPROCESSABLE_ENTITY.value,
        )

    profile_star = ProfileStar(
        from_verification_email_id=from_email_id,
        to_verification_email_id=to_verification_email_id,
    )

    preexisting_star = db.session.query(
        exists().where(
            and_(
                ProfileStar.from_verification_email_id
                == profile_star.from_verification_email_id,
                ProfileStar.to_verification_email_id
                == profile_star.to_verification_email_id,
            )
        )
    ).scalar()

    if preexisting_star:
        return (
            jsonify({"profile_id": ["Already starred"]}),
            HTTPStatus.UNPROCESSABLE_ENTITY.value,
        )

    save(profile_star)

    return jsonify({"profile_id": to_profile_id})


@api.route("unstar_profile", methods=["POST"])
@flask_login.login_required
def unstar_profile():
    verification_token = flask_login.current_user

    from_email_id = verification_token.email_id

    if "profile_id" not in request.json:
        return (
            jsonify({"profile_id": ["`profile_id` missing from request"]}),
            HTTPStatus.UNPROCESSABLE_ENTITY.value,
        )

    to_profile_id = request.json["profile_id"]
    to_profile = FacultyProfile.query.get(to_profile_id)

    if to_profile is None:
        return (
            jsonify({"profile_id": ["`profile_id` invalid"]}),
            HTTPStatus.UNPROCESSABLE_ENTITY.value,
        )

    # TODO inconsistenly idempotent; allows repeating whereas starring does not
    ProfileStar.query.filter(
        ProfileStar.from_verification_email_id == from_email_id,
        ProfileStar.to_profile_id == to_profile.id,
    ).delete()

    db.session.commit()

    return {}
