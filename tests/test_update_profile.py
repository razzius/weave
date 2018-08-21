import http

from server.models import Profile, VerificationEmail, VerificationToken

from .utils import save


def test_update_profile(client):
    token = '1234'

    verification_email = save(VerificationEmail(email='test@test.com'))

    save(VerificationToken(token=token, email_id=verification_email.id))

    profile = save(Profile(
        name='Test User',
        verification_email_id=verification_email.id,
        contact_email='test@test.com',
    ))

    new_profile = {
        'name': 'New User',
        'contact_email': 'new@test.com'
    }

    response = client.put(
        f'/api/profiles/{profile.id}',
        json=new_profile,
        headers={'Authorization': f'Token {token}'}
    )

    assert response.status_code == http.HTTPStatus.OK.value

    assert response.json == {
        'activities': [],
        'professional_information': '',
        'professional_interests': [],
        'affiliations': [],
        'cadence': None,
        'clinical_specialties': [],
        'contact_email': 'new@test.com',
        'id': 1,
        'name': 'New User',
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
