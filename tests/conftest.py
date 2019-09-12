import os

import pytest

from server import app
from server.models import db


@pytest.fixture
def client():
    postgres_port = os.environ['POSTGRES_PORT']
    app.config['TESTING'] = True
    app.config['SQLALCHEMY_DATABASE_URI'] = 'postgresql://localhost:' + postgres_port + '/postgres'

    test_client = app.test_client()

    with app.app_context():
        db.drop_all()
        db.create_all()

        yield test_client
