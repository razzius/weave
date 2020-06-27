import http
import datetime

from freezegun import freeze_time

from server.models import (
    StudentPCESiteOption,
    StudentProgramOption,
    StudentYearOption,
    save,
)

from .utils import create_test_verification_token


MOCK_DATE = datetime.datetime(2020, 6, 27, tzinfo=datetime.timezone.utc)


@freeze_time(MOCK_DATE)
def test_create_student_profile(client, auth):
    token = create_test_verification_token(is_mentor=False)

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

    cadence = "monthly"

    profile = {
        "name": name,
        "contact_email": email,
        "program": program.value,
        "current_year": current_year.value,
        "pce_site": pce_site.value,
        "clinical_specialties": clinical_specialties,
        "affiliations": affiliations,
        "professional_interests": professional_interests,
        "parts_of_me": parts_of_me,
        "activities": activities,
        "cadence": cadence,
        "other_cadence": None,
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

    assert response.json["other_cadence"] is None
    assert response.json["profile_image_url"] is None

    assert not response.json["willing_discuss_personal"]
    assert not response.json["willing_student_group"]
    assert not response.json["willing_advice_classes"]
    assert not response.json["willing_advice_clinical_rotations"]
    assert not response.json["willing_research"]
    assert not response.json["willing_residency"]
