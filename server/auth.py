from flask import session
import flask_login

from server.views.api import UnauthorizedError

from .models import VerificationToken


login_manager = flask_login.LoginManager()
login_manager.session_protection = "strong"


@login_manager.user_loader
def user_loader(token):
    return VerificationToken.query.filter_by(token=token).first()


@login_manager.unauthorized_handler
def unauthorized():
    if "_id" in session:
        flask_login.logout_user()

        raise UnauthorizedError({"token": ["invalid"]})

    raise UnauthorizedError({"token": ["not set"]})
