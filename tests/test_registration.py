from http import HTTPStatus

from server.models import VerificationEmail


def test_faculty_registration_email(client, requests_mock):
    email = 'test@hms.harvard.edu'

    requests_mock.post(
        'https://api.sparkpost.com/api/v1/transmissions', {}, reason='OK'
    )

    response = client.post(
        '/api/send-faculty-verification-email', json={'email': email}
    )

    assert response.json['email'] == email

    verification_email_id = response.json['id']

    verification_email = VerificationEmail.query.get(verification_email_id)

    assert verification_email.email == email


def test_faculty_registration_invalid_email(client, requests_mock):
    requests_mock.post(
        'https://api.sparkpost.com/api/v1/transmissions', {}, reason='OK'
    )

    response = client.post(
        '/api/send-faculty-verification-email', json={'email': 'test@test.com'}
    )

    assert response.status_code == HTTPStatus.UNPROCESSABLE_ENTITY.value
