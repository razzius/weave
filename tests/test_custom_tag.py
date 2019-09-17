import http

from server.models import VerificationEmail, VerificationToken, ActivityOption, Profile

from .utils import save


def test_create_profile_with_custom_tag(client):
    token = '1234'

    name = 'New User'
    email = 'test@test.com'

    verification_email = save(VerificationEmail(email=email))

    save(VerificationToken(token=token, email_id=verification_email.id))

    clinical_specialties = ['Endocrinology, Diabetes & Metabolism']
    affiliations = ["Brigham and Women's Hospital"]

    professional_interests = ['Advocacy']
    parts_of_me = ['African American']
    activities = ['Surfing the web']
    degrees = ['MBA']

    profile = {
        'name': name,
        'contact_email': email,
        'clinical_specialties': clinical_specialties,
        'affiliations': affiliations,
        'professional_interests': professional_interests,
        'parts_of_me': parts_of_me,
        'activities': activities,
        'degrees': degrees,
        'cadence': 'monthly',
    }

    response = client.post(
        f'/api/profile', json=profile, headers={'Authorization': f'Token {token}'}
    )

    assert response.status_code == http.HTTPStatus.CREATED.value

    profile_id = Profile.query.all()[0].id

    assert response.json == {
        'id': profile_id,
        'activities': activities,
        'additional_information': '',
        'professional_interests': professional_interests,
        'affiliations': affiliations,
        'cadence': 'monthly',
        'clinical_specialties': clinical_specialties,
        'contact_email': email,
        'degrees': degrees,
        'name': name,
        'other_cadence': None,
        'parts_of_me': parts_of_me,
        'profile_image_url': None,
        'willing_discuss_personal': False,
        'willing_goal_setting': False,
        'willing_networking': False,
        'willing_career_guidance': False,
        'willing_student_group': False,
        'willing_shadowing': False,
    }

    assert ActivityOption.query.filter(ActivityOption.value == activities[0]).one()
