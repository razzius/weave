import os
import sentry_sdk
from flask import send_from_directory
from flask_cors import CORS
from flask_sslify import SSLify
from sentry_sdk.integrations.flask import FlaskIntegration

import server.views
from .models import db
from .app import app
from .admin import init_admin

sentry_dsn = os.environ.get('PYTHON_SENTRY_DSN')

sentry_sdk.init(dsn=sentry_dsn, integrations=[FlaskIntegration()])


db.init_app(app)
CORS(app)
SSLify(app)

init_admin(app)


@app.route('/')
@app.route('/<path:path>')  # Enable any url redirecting to home for SPA
def index(path=None):
    return send_from_directory('../build', 'index.html')


app.register_blueprint(server.views.api)
