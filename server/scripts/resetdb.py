from .context import context
from server import db


context()
db.drop_all()
db.create_all()
