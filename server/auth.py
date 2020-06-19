import flask_login

from server.views.api import UnauthorizedError, validate_verification_token

from .models import VerificationToken


login_manager = flask_login.LoginManager()
login_manager.session_protection = "strong"


@login_manager.user_loader
def user_loader(token):
    return VerificationToken.query.filter_by(token=token).first()


@login_manager.unauthorized_handler
def unauthorized():
    verification_token = flask_login.current_user
    if verification_token.is_anonymous:
        raise UnauthorizedError({"token": ["not set"]})

    validate_verification_token(verification_token)
