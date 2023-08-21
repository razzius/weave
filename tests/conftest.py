import os
from urllib.parse import urlparse

import psycopg
import pytest
from sqlalchemy.orm import scoped_session, sessionmaker
from pytest_postgresql.janitor import DatabaseJanitor

from server.models import db
from app import create_app


PG_VERSION = 15.3

TEST_DATABASE_URL = os.environ.get(
    "TEST_DATABASE_URL",
    "postgresql+psycopg:///weave_test"
)

os.environ["FLASK_ENV"] = "development"


@pytest.fixture(scope="session")
def database():
    """
    Create a Postgres database for the tests,
    and drop it when the tests are done.
    """
    parsed_url = urlparse(TEST_DATABASE_URL)

    pg_host = parsed_url.hostname
    pg_port = parsed_url.port
    pg_user = parsed_url.username
    pg_password = parsed_url.password
    pg_db = parsed_url.path[1:]

    janitor = DatabaseJanitor(
        pg_user,
        pg_host,
        pg_port,
        pg_db,
        PG_VERSION,
        password=pg_password
    )

    try:
        janitor.init()
    except psycopg.errors.DuplicateDatabase:
        print("`database` fixture: Database already created")

    yield psycopg.connect(
        dbname=pg_db,
        user=pg_user,
        password=pg_password,
        host=pg_host,
        port=pg_port,
    )

    janitor.drop()


@pytest.fixture
def app():
    app = create_app()
    app.config["TESTING"] = True
    app.config["ENV"] = "development"
    return app


@pytest.fixture(scope="function")
def _db(database, app):
    """
    Provide the transactional fixtures with access
    to the database via a Flask-SQLAlchemy
    database connection.
    """
    app.config["SQLALCHEMY_DATABASE_URI"] = TEST_DATABASE_URL

    with app.app_context():
        db.create_all()

        yield db

        db.session.remove()
        db.drop_all()


@pytest.fixture
def client(app, _db):
    return app.test_client()


class AuthActions:
    def __init__(self, client):
        self.client = client

    def login(self, token: str):
        response = self.client.post("/api/verify-token", json={"token": token})

        assert (
            response.status_code == 200
        )


@pytest.fixture
def auth(client):
    return AuthActions(client)


@pytest.fixture(scope="function")
def db_session(_db, request):
    """Creates a new database session for a test."""
    connection = _db.engine.connect()
    transaction = connection.begin()

    _db.session = scoped_session(session_factory=sessionmaker(bind=connection))

    def teardown():
        transaction.rollback()
        connection.close()
        _db.session.remove()

    request.addfinalizer(teardown)
    return _db.session
