import http

from server.models import VerificationEmail, VerificationToken, Activity

from .utils import save


def test_create_profile_with_custom_tag(client):
    token = '1234'

    name = 'New User'
    email = 'test@test.com'

    verification_email = save(VerificationEmail(email=email))

    save(VerificationToken(token=token, email_id=verification_email.id))

    # activities = []
    activities = ['Surfing the web']

    profile = {
        'name': name,
        'contact_email': email,
        'activities': activities
    }

    response = client.post(
        f'/api/profile',
        json=profile,
        headers={'Authorization': f'Token {token}'}
    )

    assert response.status_code == http.HTTPStatus.CREATED.value

    checked_fields = {
        key: value
        for key, value in response.json.items()
        if key != 'id'
    }

    assert checked_fields == {
        'activities': activities,
        'additional_information': '',
        'professional_interests': [],
        'affiliations': [],
        'cadence': None,
        'clinical_specialties': [],
        'contact_email': email,
        'name': name,
        'other_cadence': None,
        'parts_of_me': [],
        'profile_image_url': None,
        'willing_discuss_personal': False,
        'willing_goal_setting': False,
        'willing_networking': False,
        'willing_career_guidance': False,
        'willing_student_group': False,
        'willing_shadowing': False
    }

    assert Activity.query.filter(Activity.value == activities[0]).one()
