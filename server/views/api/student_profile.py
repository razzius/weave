import datetime
import http

import flask_login
from flask import jsonify, make_response, request
from marshmallow import ValidationError
from sentry_sdk import capture_exception
from sqlalchemy import exists
from structlog import get_logger

from server.models import (
    ActivityOption,
    ClinicalSpecialtyOption,
    HospitalAffiliationOption,
    PartsOfMeOption,
    ProfessionalInterestOption,
    StudentClinicalSpecialty,
    StudentHospitalAffiliation,
    StudentPartsOfMe,
    StudentProfessionalInterest,
    StudentProfile,
    StudentProfileActivity,
    VerificationEmail,
    db,
    save,
)
from server.schemas import student_profile_schema
from server.queries import query_student_profiles_and_stars

from .blueprint import api
from .exceptions import InvalidPayloadError, UserError
from .utils import get_base_fields, save_tags


log = get_logger()


def save_student_tags(profile, schema):
    save_tags(
        profile,
        schema["affiliations"],
        HospitalAffiliationOption,
        StudentHospitalAffiliation,
    )
    save_tags(
        profile,
        schema["clinical_specialties"],
        ClinicalSpecialtyOption,
        StudentClinicalSpecialty,
    )
    save_tags(
        profile,
        schema["professional_interests"],
        ProfessionalInterestOption,
        StudentProfessionalInterest,
    )
    save_tags(profile, schema["parts_of_me"], PartsOfMeOption, StudentPartsOfMe)
    save_tags(profile, schema["activities"], ActivityOption, StudentProfileActivity)


def basic_student_profile_data(schema):
    base_fields = get_base_fields(schema)

    return {
        **base_fields,
        "program_id": schema.get("program_id"),
        "program": schema.get("program"),
        "current_year": schema.get("current_year"),
        "pce_site": schema.get("pce_site"),
        "willing_advice_classes": schema.get("willing_advice_classes"),
        "willing_advice_clinical_rotations": schema.get(
            "willing_advice_clinical_rotations"
        ),
        "willing_research": schema.get("willing_research"),
        "willing_residency": schema.get("willing_residency"),
    }


@api.route("/student-profile", methods=["POST"])
@flask_login.login_required
def create_student_profile():
    verification_token = flask_login.current_user

    try:
        schema = student_profile_schema.load(request.json)
    except ValidationError as err:
        capture_exception(err)
        raise InvalidPayloadError(err.messages)

    if db.session.query(
        exists().where(StudentProfile.contact_email == schema["contact_email"])
    ).scalar():
        raise UserError({"email": ["This email already exists in the database"]})

    program_id = schema["program"].id if schema["program"] else None
    current_year_id = schema["current_year"].id if schema["current_year"] else None
    pce_site_id = schema["pce_site"].id if schema["pce_site"] else None

    profile_data = {
        "verification_email_id": verification_token.email_id,
        "program_id": program_id,
        "current_year_id": current_year_id,
        "pce_site_id": pce_site_id,
        **basic_student_profile_data(schema),
    }

    profile = save(StudentProfile(**profile_data))

    save_student_tags(profile, schema)

    return jsonify(student_profile_schema.dump(profile)), http.HTTPStatus.CREATED.value


@api.route("/student-profiles/<profile_id>")
@flask_login.login_required
def get_student_profile(profile_id=None):
    verification_token = flask_login.current_user

    profile_and_star_list = query_student_profiles_and_stars(
        verification_email_id=verification_token.email_id
    ).filter(StudentProfile.id == profile_id)

    if not profile_and_star_list.first():
        raise UserError({"profile_id": ["Not found"]}, http.HTTPStatus.NOT_FOUND.value)

    profile, star_count = profile_and_star_list[0]

    # TODO do these without mutating profile
    profile.starred = star_count > 0
    profile.is_faculty = profile.verification_email.is_mentor

    response = make_response(jsonify(student_profile_schema.dump(profile)))

    response.headers["Cache-Control"] = "public, max-age=0"
    response.headers["Pragma"] = "no-cache"
    response.headers["Expires"] = "0"

    return response


@api.route("/student-profiles/<profile_id>", methods=["PUT"])
@flask_login.login_required
def update_student_profile(profile_id=None):
    try:
        schema = student_profile_schema.load(request.json)
    except ValidationError as err:
        capture_exception(err)
        raise InvalidPayloadError(err.messages)

    verification_token = flask_login.current_user

    profile = StudentProfile.query.get_or_404(profile_id)

    is_admin = VerificationEmail.query.filter(
        VerificationEmail.id == verification_token.email_id
    ).value(VerificationEmail.is_admin)

    log.info(
        "Edit student profile",
        profile_id=profile_id,
        is_admin=is_admin,
        token_id=verification_token.id,
        email=verification_token.email.email,
    )

    assert is_admin or profile.verification_email_id == verification_token.email_id

    profile_data = basic_student_profile_data(schema)

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
        StudentProfessionalInterest,
        StudentProfileActivity,
        StudentHospitalAffiliation,
        StudentPartsOfMe,
        StudentClinicalSpecialty,
    }
    for profile_relation_class in profile_relation_classes:
        profile_relation_class.query.filter(
            profile_relation_class.profile_id == profile.id
        ).delete()

    save_student_tags(profile, schema)

    return student_profile_schema.dump(profile)
