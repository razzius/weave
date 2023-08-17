import os

from flask import Flask

from structlog import get_logger
import sentry_sdk
from sentry_sdk.integrations.flask import FlaskIntegration

from server.admin import init_admin
from server.emails import init_email
from server.models import db
from server.auth import login_manager
from server import views
from server import cli


log = get_logger()


class NoCacheIndexFlask(Flask):
    def get_send_file_max_age(self, name):
        if name.lower().endswith("index.html"):
            return 0
        return 31536000


def create_app():
    sentry_dsn = os.environ.get("PYTHON_SENTRY_DSN")

    sentry_sdk.init(dsn=sentry_dsn, integrations=[FlaskIntegration()])

    app = NoCacheIndexFlask(
        "server", static_url_path="/static", static_folder="../build/static"
    )

    app.config["SQLALCHEMY_DATABASE_URI"] = os.environ.get(
        "DATABASE_URL", "postgresql:///weave"
    )
    app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False
    app.config["SQLALCHEMY_ECHO"] = bool(os.environ.get("SQLALCHEMY_ECHO"))
    app.config["BASIC_AUTH_USERNAME"] = os.environ.get("BASIC_AUTH_USERNAME")
    app.config["BASIC_AUTH_PASSWORD"] = os.environ.get("BASIC_AUTH_PASSWORD")
    app.config["SECRET_KEY"] = os.environ.get("SECRET_KEY")

    app.config["TOKEN_EXPIRY_AGE_HOURS"] = int(
        os.environ.get("REACT_APP_TOKEN_EXPIRY_AGE_HOURS", 1)
    )

    db.init_app(app)
    login_manager.init_app(app)

    if not app.debug:
        app.config["SESSION_COOKIE_SAMESITE"] = "Strict"
        app.config["SESSION_COOKIE_SECURE"] = True

    init_admin(app)
    init_email(app)

    app.register_blueprint(views.home)
    app.register_blueprint(views.api)
    app.register_blueprint(cli.blueprint)

    # TODO saml not finished
    # from .saml import init_saml
    # init_saml(app)

    return app
