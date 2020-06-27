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
from .utils import save_tags


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
    return {
        "name": schema["name"],
        "contact_email": schema["contact_email"],
        "cadence": schema["cadence"],
        "other_cadence": schema["other_cadence"],
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
