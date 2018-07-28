from http import HTTPStatus

from server import app
from server.models import db, VerificationEmail, VerificationToken, Profile


def test_verify_invalid_token(client):
    response = client.post('/api/verify-token', json={'token': '123'})
    assert response.status_code == HTTPStatus.BAD_REQUEST.value
    assert response.json == {'token': ['not recognized']}


def test_verify_valid_token(client):
    token = '123'
    email = 'test@test.com'

    verification_email = VerificationEmail(email=email)

    with app.app_context():
        db.session.add(verification_email)
        db.session.commit()

        db.session.add(VerificationToken(token=token, email_id=verification_email.id))
        db.session.commit()

    response = client.post('/api/verify-token', json={'token': token})

    assert response.status_code == HTTPStatus.OK.value
    assert response.json == {
        'email': 'test@test.com',
        'profile_id': None
    }


def test_set_unavailable_to_mentor(client):
    token = '123'
    email = 'test@test.com'

    verification_email = VerificationEmail(email=email)

    with app.app_context():
        db.session.add(verification_email)
        db.session.commit()

        db.session.add(VerificationToken(token=token, email_id=verification_email.id))

        profile = Profile(
            name='Test', contact_email=email, verification_email=verification_email.id
        )
        db.session.add(profile)
        db.session.commit()

    data = {'token': token, 'available': False}

    response = client.post('/api/availability', json=data)

    assert response.status_code == HTTPStatus.OK.value
    assert response.json['available'] is False

    with app.app_context():
        assert Profile.query.all()[0].available_for_mentoring is False
