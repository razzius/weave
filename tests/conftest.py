import os
from urllib.parse import urlparse

import pytest
from pytest_postgresql.factories import DatabaseJanitor
from server.app import create_app
from server.models import db


TEST_DATABASE_URL = os.environ.get('TEST_DATABASE_URL', 'postgresql:///weave_test')


@pytest.fixture(scope='session')
def database():
    """
    Create a Postgres database for the tests, and drop it when the tests are done.
    """
    parsed_url = urlparse(TEST_DATABASE_URL)

    pg_host = parsed_url.hostname
    pg_port = parsed_url.port
    pg_user = parsed_url.username
    pg_db = 'weave_test'
    pg_version = 10.11

    janitor = DatabaseJanitor(pg_user, pg_host, pg_port, pg_db, pg_version)
    janitor.init()

    yield

    janitor.drop()


@pytest.fixture
def app():
    app = create_app()
    app.config['TESTING'] = True
    app.config['ENV'] = 'development'
    return app


@pytest.fixture
def client(app):
    test_client = app.test_client()

    with app.app_context():
        db.create_all()

        yield test_client

        db.session.remove()
        db.drop_all()


@pytest.fixture(scope='function')
def _db(database, app):
    """
    Provide the transactional fixtures with access to the database via a Flask-SQLAlchemy
    database connection.
    """
    app.config['SQLALCHEMY_DATABASE_URI'] = TEST_DATABASE_URL

    with app.app_context():
        db.create_all()

        yield db

        db.session.remove()
        db.drop_all()
