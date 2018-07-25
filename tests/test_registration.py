from server import app
from server.models import VerificationEmail
from server.emails import MAILGUN_DOMAIN


def test_faculty_registration(client, requests_mock):
    requests_mock.post(
        f'https://api.mailgun.net/v3/{MAILGUN_DOMAIN}/messages',
        {},
        reason='OK'
    )

    response = client.post('/api/send-faculty-verification-email', json={'email': 'test@test.com'})

    assert response.json['email'] == 'test@test.com'

    verification_email_id = response.json['id']

    with app.app_context():
        verification_email = VerificationEmail.query.get(verification_email_id)

    assert verification_email.email == 'test@test.com'
