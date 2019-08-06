from server import app

app.app_context().push()
from server.models import *

def save(instance):
    db.session.rollback()
    db.session.add(instance)
    db.session.commit()
