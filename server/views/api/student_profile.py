import http

import flask_login
from flask import jsonify, request
from marshmallow import ValidationError
from sentry_sdk import capture_exception
from sqlalchemy import exists

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
    db,
    save,
)
from server.schemas import student_profile_schema

from .blueprint import api
from .exceptions import InvalidPayloadError, UserError
from .utils import get_base_fields, save_tags


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


def basic_student_profile_data(verification_token, schema):
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

    profile_data = {
        "verification_email_id": verification_token.email_id,
        "program_id": schema["program"].id,
        "current_year_id": schema["current_year"].id,
        "pce_site_id": schema["pce_site"].id,
        **basic_student_profile_data(verification_token, schema),
    }

    profile = save(StudentProfile(**profile_data))

    save_student_tags(profile, schema)

    return jsonify(student_profile_schema.dump(profile)), http.HTTPStatus.CREATED.value
