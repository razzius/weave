from server import app


def context():
    app.app_context().push()
