from flask import Blueprint, send_from_directory


home = Blueprint("home", __name__)


@home.route("/")
@home.route("/<path:path>")  # Enable any url redirecting to home for SPA
def index(path=None):
    return send_from_directory("../dist/assets", "index.html")


@home.route("/assets/<path:path>")
def send_static(path):
    return send_from_directory("../dist/assets", path)


@home.route("/debug-sentry")
def trigger_error():
    raise Exception("Test error")
