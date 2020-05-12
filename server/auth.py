import flask_login
from flask import redirect, session, url_for
from flask_saml2.sp import ServiceProvider

from server.views.api import get_or_create_verification_email

from .models import VerificationToken
from .views.api import generate_token, save_verification_token


login_manager = flask_login.LoginManager()


@login_manager.user_loader
def user_loader(token):
    return VerificationToken.query.get(token)


class ExampleServiceProvider(ServiceProvider):
    def login_successful(self, auth_data, relay_state):
        user_id = auth_data.nameid
        session["auth_data"] = auth_data.to_dict()

        print("gona log in ")
        print(user_id)

        email = auth_data.attributes["urn:oid:1.2.840.113549.1.9.1"]

        # TODO is_mentor
        verification_email = get_or_create_verification_email(email, is_mentor=True)

        token = generate_token()

        # TODO is_personal_device
        verification_token = save_verification_token(
            verification_email.id, token, is_personal_device=True
        )

        flask_login.login_user(verification_token)

        return redirect("/")

    def logout(self):
        flask_login.logout_user()

        return redirect("/")

    def get_auth_data_in_session(self):
        return session["auth_data"]

    def is_user_logged_in(self):
        return flask_login.current_user.is_authenticated

    def get_logout_return_url(self):
        return url_for("home.index", _external=True)

    def get_default_login_return_url(self):
        return url_for("home.index", _external=True)


service_provider = ExampleServiceProvider()
