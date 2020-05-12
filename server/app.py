import os
from flask import Flask
from flask_cors import CORS
from flask_sslify import SSLify
from flask_saml2.sp.idphandler import IdPHandler
from flask_saml2.sp.parser import ResponseParser
from flask_saml2.utils import certificate_from_file, private_key_from_file
from signxml import XMLVerifier
from .admin import init_admin
from .emails import init_email
from .models import db
from .auth import login_manager, service_provider
from . import views
from . import cli

CERTIFICATE = certificate_from_file("sp.crt")
PRIVATE_KEY = private_key_from_file("saml.key")


class NoCacheIndexFlask(Flask):
    def get_send_file_max_age(self, name):
        if name.lower().endswith("index.html"):
            return 0
        return 31536000


IDP_CERTIFICATE = certificate_from_file("idp.crt")


class X509IdPHandler(IdPHandler):
    def get_response_parser(self, saml_response):
        return X509XmlParser(
            self.decode_saml_string(saml_response), certificate=self.certificate
        )


class X509XmlParser(ResponseParser):
    def parse_signed(self, xml_tree, certificate):
        """
        Passes ignore_ambiguous_key_info=True to ignore KeyValue and validate using X509Data only.
        """
        return (
            XMLVerifier()
            .verify(xml_tree, x509_cert=certificate, ignore_ambiguous_key_info=True)
            .signed_xml
        )


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
    app.config["SESSION_PROTECTION"] = "strong"

    app.config["SERVER_NAME"] = "localhost:5000"
    app.config["SAML2_SP"] = {
        "certificate": CERTIFICATE,
        "private_key": PRIVATE_KEY,
    }
    app.config["SAML2_IDENTITY_PROVIDERS"] = [
        {
            "CLASS": "server.app.X509IdPHandler",
            "OPTIONS": {
                "display_name": "keycloak",
                "entity_id": "http://localhost:8080/auth/realms/master",
                "sso_url": "http://localhost:8080/auth/realms/master/protocol/saml",
                "slo_url": "http://localhost:8080/auth/realms/master/protocol/saml",
                "certificate": IDP_CERTIFICATE,
            },
        },
    ]

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
    app.register_blueprint(service_provider.create_blueprint(), url_prefix="/saml/")

    return app
