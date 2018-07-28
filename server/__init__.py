from flask import Flask, send_from_directory
import os

from raven.contrib.flask import Sentry
from flask_cors import CORS
from flask_admin import Admin
from flask_admin.contrib.sqla import ModelView
from .models import Profile, VerificationEmail, VerificationToken, db
import server.views

app = Flask(__name__, static_url_path='/static', static_folder='../build/static')
app.secret_key = os.environ['SECRET_KEY']

app.config['SQLALCHEMY_DATABASE_URI'] = os.environ['DATABASE_URL']
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['MAILGUN_DOMAIN'] = os.environ['MAILGUN_DOMAIN']
# app.config['SQLALCHEMY_ECHO'] = app.debug


db.init_app(app)
CORS(app)
Sentry(app)


admin = Admin(app, name='advising app', template_mode='bootstrap3')
admin.add_view(ModelView(VerificationToken, db.session))
admin.add_view(ModelView(VerificationEmail, db.session))
admin.add_view(ModelView(Profile, db.session))


@app.route('/')
@app.route('/<path:path>')  # Enable any url redirecting to home for SPA
def index(path=None):
    return send_from_directory('../build', 'index.html')


app.register_blueprint(server.views.api)
