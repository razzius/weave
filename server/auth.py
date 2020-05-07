import flask_login

from .models import VerificationEmail

login_manager = flask_login.LoginManager()


# should use verification token, because otherwise user id would have to change to invalidate session!?
@login_manager.user_loader
def user_loader(email_id):
    return VerificationEmail.query.get(email_id)
