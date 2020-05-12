from flask import Blueprint, request, send_from_directory, url_for

from server.models import VerificationToken
from server.auth import flask_login

home = Blueprint("home", __name__)


@home.route("/")
@home.route("/<path:path>")  # Enable any url redirecting to home for SPA
def index(path=None):
    login_url = url_for("flask_saml2_sp.login")
    print(login_url)
    # return f'<a href="{login_url}">Log in!!</a>'
    return send_from_directory("../build", "index.html")


@home.route("/assets/<path:path>")
def send_static(path):
    return send_from_directory("../build/assets", path)


@home.route("/debug-sentry")
def trigger_error():
    raise Exception("Test error")


@home.route("/debug-user")
def debug_user():
    return f"Logged in as {None}"


@home.route("/login", methods=["GET", "POST"])
def fake_login():
    token_parameter = request.form.get("token", "")

    verification_token = VerificationToken.query.get(token_parameter)

    if verification_token is not None:
        email = verification_token.email
        flask_login.login_user(email)

        return "login"

    return "no"
