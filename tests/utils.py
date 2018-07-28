from server.models import db


def save(obj):
    db.session.add(obj)
    db.session.commit()

    return obj
