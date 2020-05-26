import os
from flask import Flask
from flask_cors import CORS
from flask_sslify import SSLify
from .admin import init_admin
from .emails import init_email
from .models import db
from .auth import login_manager
from . import views
from . import cli


class NoCacheIndexFlask(Flask):
    def get_send_file_max_age(self, name):
        if name.lower().endswith("index.html"):
            return 0
        return 31536000


def create_app():
    app = NoCacheIndexFlask(
        "server", static_url_path="/static", static_folder="../build/static"
    )

    app.config["SQLALCHEMY_DATABASE_URI"] = os.environ.get(
        "DATABASE_URL", "postgresql:///weave"
    )
    app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False
    app.config["BASIC_AUTH_USERNAME"] = os.environ.get("BASIC_AUTH_USERNAME")
    app.config["BASIC_AUTH_PASSWORD"] = os.environ.get("BASIC_AUTH_PASSWORD")
    app.config["SECRET_KEY"] = os.environ.get("SECRET_KEY")

    app.config["TOKEN_EXPIRY_AGE_HOURS"] = int(
        os.environ.get("REACT_APP_TOKEN_EXPIRY_AGE_HOURS", 1)
    )

    db.init_app(app)
    login_manager.init_app(app)

    if app.debug:
        CORS(app, supports_credentials=True)

    SSLify(app)

    init_admin(app)
    init_email(app)

    app.register_blueprint(views.home)
    app.register_blueprint(views.api)
    app.register_blueprint(cli.blueprint)

    return app
