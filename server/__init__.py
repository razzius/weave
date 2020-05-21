import inspect
import os
import sentry_sdk
from sentry_sdk.integrations.flask import FlaskIntegration

from .app import create_app
from . import models


sentry_dsn = os.environ.get("PYTHON_SENTRY_DSN")

sentry_sdk.init(dsn=sentry_dsn, integrations=[FlaskIntegration()])


app = create_app()


@app.shell_context_processor
def shell_context():
    return dict(inspect.getmembers(models))
