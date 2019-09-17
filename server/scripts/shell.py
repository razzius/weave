from server import app  # noqa: F401

from server.scripts.context import context
from server.models import db
from server import models

import inspect

locals().update(dict(inspect.getmembers(models)))


def save(instance):
    db.session.rollback()
    db.session.add(instance)
    db.session.commit()


context()
