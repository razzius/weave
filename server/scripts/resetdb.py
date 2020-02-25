from server import db
from server import app


with app.app_context():
    db.drop_all()
    db.create_all()
