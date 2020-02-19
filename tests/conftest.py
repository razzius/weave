import pytest
from pytest_postgresql.factories import DatabaseJanitor
from server.app import app
from server.models import db


@pytest.fixture
def client():
    app.config['TESTING'] = True

    test_client = app.test_client()

    with app.app_context():
        db.create_all()

        yield test_client

        db.session.remove()
        db.drop_all()


@pytest.fixture(scope='session')
def database():
    """
    Create a Postgres database for the tests, and drop it when the tests are done.
    """
    pg_host = None
    pg_port = None
    pg_user = None
    pg_db = 'test_weave'
    pg_version = 11.1

    janitor = DatabaseJanitor(pg_user, pg_host, pg_port, pg_db, pg_version)
    janitor.init()

    yield

    janitor.drop()


@pytest.fixture(scope='function')
def _db(database):
    """
    Provide the transactional fixtures with access to the database via a Flask-SQLAlchemy
    database connection.
    """
    app.config['SQLALCHEMY_DATABASE_URI'] = 'postgresql:///test_weave'

    with app.app_context():
        db.create_all()

        yield db

        db.session.remove()
        db.drop_all()
