import pytest

from server import app
from server.models import db


@pytest.fixture
def client():
    app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///:memory:'
    app.config['TESTING'] = True

    test_client = app.test_client()

    with app.app_context():
        db.drop_all()
        db.create_all()

    yield test_client
