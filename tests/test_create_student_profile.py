import http
import datetime

import time_machine

from server.models import (
    StudentPCESiteOption,
    StudentProgramOption,
    StudentYearOption,
    save,
)

from .utils import create_test_verification_token


MOCK_DATE = datetime.datetime(2020, 6, 27, tzinfo=datetime.timezone.utc)


@time_machine.travel(MOCK_DATE)
def test_create_student_profile(client, auth, db_session):
    token = create_test_verification_token(is_faculty=False)

    auth.login(token.token)

    name = "Student"
    email = "student@student.com"

    program = save(StudentProgramOption(value="Program"))
    current_year = save(StudentYearOption(value="1st Year"))
    pce_site = save(StudentPCESiteOption(value="PCE Site"))

    affiliations = ["Brigham and Women's Hospital"]
    clinical_specialties = ["Endocrinology, Diabetes & Metabolism"]
    professional_interests = ["Advocacy"]
    parts_of_me = ["Part"]
    activities = ["Recycling"]

    cadence = "other"
    other_cadence = "Once in a while"

    profile_image_url = "http://placehold.it/200"

    profile = {
        "name": name,
        "contact_email": email,
        "program": program.value,
        "current_year": current_year.value,
        "pce_site": pce_site.value,
        "clinical_specialties": clinical_specialties,
        "affiliations": affiliations,
        "professional_interests": professional_interests,
        "profile_image_url": profile_image_url,
        "parts_of_me": parts_of_me,
        "activities": activities,
        "cadence": cadence,
        "other_cadence": other_cadence,
        "willing_discuss_personal": True,
        "willing_student_group": True,
        "willing_dual_degrees": True,
        "willing_advice_clinical_rotations": True,
        "willing_research": True,
        "willing_residency": True,
    }

    response = client.post("/api/student-profile", json=profile)

    assert response.status_code == http.HTTPStatus.CREATED.value, response.json

    assert response.json["program"] == program.value
    assert response.json["current_year"] == current_year.value
    assert response.json["pce_site"] == pce_site.value

    assert response.json["affiliations"] == affiliations

    assert response.json["affiliations"] == ["Brigham and Women's Hospital"]
    assert response.json["clinical_specialties"] == [
        "Endocrinology, Diabetes & Metabolism"
    ]
    assert response.json["professional_interests"] == ["Advocacy"]
    assert response.json["parts_of_me"] == ["Part"]
    assert response.json["activities"] == ["Recycling"]

    assert response.json["cadence"] == cadence

    assert response.json["other_cadence"] == other_cadence
    assert response.json["profile_image_url"] == profile_image_url

    assert response.json["willing_discuss_personal"]
    assert response.json["willing_student_group"]
    assert response.json["willing_dual_degrees"]
    assert response.json["willing_advice_clinical_rotations"]
    assert response.json["willing_research"]
    assert response.json["willing_residency"]
