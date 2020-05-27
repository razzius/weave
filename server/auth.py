import flask_login

from .models import VerificationToken


login_manager = flask_login.LoginManager()


@login_manager.user_loader
def user_loader(token):
    return VerificationToken.query.get(token)
