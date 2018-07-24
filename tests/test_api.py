import pytest

from server import app
from server.models import db, VerificationEmail, VerificationToken, Profile


@pytest.fixture
def client():
    app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///:memory:'
    app.config['TESTING'] = True
    client = app.test_client()

    with app.app_context():
        db.drop_all()
        db.create_all()

    yield client


def test_verify_invalid_token(client):
    response = client.post('/api/verify-token', json={'token': '123'})
    assert response.status_code == 400
    assert response.json == {'token': 'Verification token not recognized.'}


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
    assert response.status_code == 200
    assert response.json == {'email': 'test@test.com'}


def test_set_unavailable_to_mentor(client):
    token = '123'
    email = 'test@test.com'

    verification_email = VerificationEmail(email=email)

    with app.app_context():
        db.session.add(verification_email)
        db.session.commit()

        db.session.add(VerificationToken(token=token, email_id=verification_email.id))

        profile = Profile(
            name='Test',
            contact_email=email,
            verification_email=verification_email.id
        )
        db.session.add(profile)
        db.session.commit()

    data = {
        'token': token,
        'available': False
    }

    response = client.post('/api/availability', json=data)

    assert response.status_code == 200
    assert response.json['available'] is False

    with app.app_context():
        assert Profile.query.all()[0].available_for_mentoring is False
