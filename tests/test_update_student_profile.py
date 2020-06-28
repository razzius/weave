import http

from server.models import StudentProfile

from .utils import create_test_student_profile, create_test_verification_token


def test_update_student_profile(client, auth):
    profile = create_test_student_profile()

    token = create_test_verification_token(
        is_mentor=False, verification_email=profile.verification_email
    )

    auth.login(token.token)

    new_name = "New Name"
    new_email = "new@email.com"
    specialties = ["specialty"]
    activities = ["activities"]
    affiliations = ["affiliations"]
    parts_of_me = ["part"]
    professional_interests = ["interest"]

    data = {
        "name": new_name,
        "contact_email": new_email,
        "clinical_specialties": specialties,
        "activities": activities,
        "affiliations": affiliations,
        "parts_of_me": parts_of_me,
        "professional_interests": professional_interests,
    }

    response = client.put(f"/api/student-profiles/{profile.id}", json=data)

    assert response.status_code == http.HTTPStatus.OK.value, response.json

    updated_profile = StudentProfile.query.get(profile.id)

    assert updated_profile.name == new_name
    assert updated_profile.contact_email == new_email
