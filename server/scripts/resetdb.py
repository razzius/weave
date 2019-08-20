from . import context
from server import db


db.drop_all()
db.create_all()
