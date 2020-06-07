import flask_login

from server.views.api import UnauthorizedError

from .models import VerificationToken


class JSONLoginManager(flask_login.LoginManager):
    """
    All authenticated views are currently API views.

    This could be extended to return an html error page if the request
    is not accessing the API blueprint.
    """

    def unauthorized(self):
        raise UnauthorizedError({"token": ["not set"]})


login_manager = JSONLoginManager()


@login_manager.user_loader
def user_loader(token):
    return VerificationToken.query.filter_by(token=token).first()
