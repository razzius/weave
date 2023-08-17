import os
import uuid

from structlog import get_logger
from flask_saml2.sp import ServiceProvider
from flask_saml2.utils import certificate_from_string, private_key_from_string
from flask import redirect, session, url_for
import flask_login

from .views.api import save_verification_token
from .queries import get_verification_email_by_email


log = get_logger()


class WeaveServiceProvider(ServiceProvider):
    def login_successful(self, auth_data, relay_state):
        email = auth_data.nameid

        log.info("Got successful saml login", auth_data=auth_data.__dict__)

        session["auth_data_attributes"] = auth_data.attributes

        token = str(uuid.uuid4())

        verification_email = get_verification_email_by_email(email)

        if verification_email is None:
            log.info("email not found", email=email)
            # would be good to know if they were faculty or not
            return """
                While harvardkey integration is in beta,
                you must sign up using email before signing in with harvardkey
            """

        verification_token = save_verification_token(
            verification_email.id, token, is_personal_device=False
        )

        flask_login.login_user(verification_token)

        return redirect("/")

    def logout(self):
        flask_login.logout_user()

        return redirect("/")

    def get_auth_data_in_session(self):
        return session["auth_data_attributes"]

    def is_user_logged_in(self):
        return flask_login.current_user.is_authenticated

    def get_logout_return_url(self):
        return url_for("home.index", _external=True)

    def get_default_login_return_url(self):
        return url_for("home.index", _external=True)


def init_saml(app):
    required_saml_envvars = {
        "SAML_SP_CERT",
        "SAML_IDP_CERT",
        "SAML_SP_KEY",
        "WEAVE_SERVER_NAME",
        "SAML_ENTITY_ID",
        "SAML_SSO_URL",
    }

    if all(os.environ.get(var) is not None for var in required_saml_envvars):
        SP_CERTIFICATE = certificate_from_string(
            os.environ.get("SAML_SP_CERT").replace("|", "\n")
        )
        IDP_CERTIFICATE = certificate_from_string(
            os.environ.get("SAML_IDP_CERT").replace("|", "\n")
        )
        PRIVATE_KEY = private_key_from_string(
            os.environ.get("SAML_SP_KEY").replace("|", "\n")
        )

        app.config["SERVER_NAME"] = os.environ.get("WEAVE_SERVER_NAME")

        app.config["SAML2_SP"] = {
            "certificate": SP_CERTIFICATE,
            "private_key": PRIVATE_KEY,
        }
        # saml_url = "http://localhost:8080/auth/realms/master/protocol/saml"

        app.config["SAML2_IDENTITY_PROVIDERS"] = [
            {
                "CLASS": "server.saml.X509IdPHandler",
                "OPTIONS": {
                    # "display_name": "keycloak",
                    "entity_id": os.environ.get("SAML_ENTITY_ID"),
                    "sso_url": os.environ.get("SAML_SSO_URL"),
                    # "slo_url": saml_url,
                    "certificate": IDP_CERTIFICATE,
                },
            },
        ]

        sp = WeaveServiceProvider()
        app.register_blueprint(sp.create_blueprint(), url_prefix="/saml/")
