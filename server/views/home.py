from flask import Blueprint, request, send_from_directory

from server.models import VerificationToken
from server.auth import flask_login

home = Blueprint("home", __name__)


@home.route("/")
@home.route("/<path:path>")  # Enable any url redirecting to home for SPA
def index(path=None):
    #     return """<form method="POST" action="/login">
    #     <input name="email" type="text" placeholder="email">
    #     <input name="token" type="password" placeholder="token">
    #     <input type="submit" value="submitme">
    #     </form>
    # """
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
