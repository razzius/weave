from http import HTTPStatus

from server.models import ActivityOption, VerificationEmail, VerificationToken, save


def test_get_public_tags_needs_authorization(client):
    response = client.get('/api/tags')

    assert response.status_code == HTTPStatus.UNAUTHORIZED.value


def test_get_empty_public_tags(client):
    token = '1234'
    verification_email = VerificationEmail(email='test@test.com')
    save(verification_email)

    verification_token = VerificationToken(token=token, email_id=verification_email.id)
    save(verification_token)

    response = client.get('/api/tags', headers={'Authorization': f'Token {token}'})

    assert response.status_code == HTTPStatus.OK.value

    assert response.json == {
        'tags': {
            'activities': [],
            'clinical_specialties': [],
            'degrees': [],
            'hospital_affiliations': [],
            'parts_of_me': [],
            'professional_interests': [],
        }
    }


def test_get_public_tags(client):
    token = '1234'
    verification_email = save(VerificationEmail(email='test@test.com'))

    save(VerificationToken(token=token, email_id=verification_email.id))

    save(ActivityOption(value='activity', public=True))

    response = client.get('/api/tags', headers={'Authorization': f'Token {token}'})

    assert response.status_code == HTTPStatus.OK.value

    assert response.json == {
        'tags': {
            'activities': ['activity'],
            'clinical_specialties': [],
            'degrees': [],
            'hospital_affiliations': [],
            'parts_of_me': [],
            'professional_interests': [],
        }
    }
