import os

import sentry_sdk
from flask import Flask, send_from_directory
from flask_admin import Admin, AdminIndexView, expose
from flask_admin.contrib.sqla import ModelView
from flask_basicauth import BasicAuth
from flask_cors import CORS
from flask_sslify import SSLify
from sentry_sdk.integrations.flask import FlaskIntegration

import server.views

from .models import (
    ActivityOption,
    ClinicalSpecialtyOption,
    DegreeOption,
    HospitalAffiliationOption,
    PartsOfMeOption,
    ProfessionalInterestOption,
    Profile,
    VerificationEmail,
    VerificationToken,
    db,
)


sentry_dsn = os.environ.get('PYTHON_SENTRY_DSN')

sentry_sdk.init(dsn=sentry_dsn, integrations=[FlaskIntegration()])


class NoCacheIndexFlask(Flask):
    def get_send_file_max_age(self, name):
        if name.lower().endswith('index.html'):
            return 0
        return 31536000


app = NoCacheIndexFlask(
    __name__, static_url_path='/static', static_folder='../build/static'
)
app.secret_key = os.environ['SECRET_KEY']

app.config['SQLALCHEMY_DATABASE_URI'] = os.environ['DATABASE_URL']
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['MAILGUN_DOMAIN'] = os.environ['MAILGUN_DOMAIN']
# app.config['SQLALCHEMY_ECHO'] = app.debug

db.init_app(app)
CORS(app)
SSLify(app)

app.config['BASIC_AUTH_USERNAME'] = os.environ['BASIC_AUTH_USERNAME']
app.config['BASIC_AUTH_PASSWORD'] = os.environ['BASIC_AUTH_PASSWORD']

basic_auth = BasicAuth(app)


class BasicAuthAdminView(AdminIndexView):
    @expose('/')
    @basic_auth.required
    def index(self):
        return super().index()


class BasicAuthModelView(ModelView):
    @expose('/', methods=('GET',))
    @basic_auth.required
    def index_view(self):
        return super().index_view()

    @expose('/new', methods=('GET', 'POST'))
    @basic_auth.required
    def create_view(self):
        return super().create_view()

    @expose('/details', methods=('GET',))
    @basic_auth.required
    def details_view(self):
        return super().details_view()

    @expose('/edit', methods=('GET', 'POST'))
    @basic_auth.required
    def edit_view(self):
        return super().edit_view()

    @expose('/delete', methods=('POST',))
    @basic_auth.required
    def delete_view(self):
        return super().delete_view()


admin = Admin(app, index_view=BasicAuthAdminView())
admin.add_view(BasicAuthModelView(VerificationToken, db.session))
admin.add_view(BasicAuthModelView(VerificationEmail, db.session))
admin.add_view(BasicAuthModelView(Profile, db.session))
admin.add_view(BasicAuthModelView(ClinicalSpecialtyOption, db.session))
admin.add_view(BasicAuthModelView(ProfessionalInterestOption, db.session))
admin.add_view(BasicAuthModelView(PartsOfMeOption, db.session))
admin.add_view(BasicAuthModelView(ActivityOption, db.session))
admin.add_view(BasicAuthModelView(HospitalAffiliationOption, db.session))
admin.add_view(BasicAuthModelView(DegreeOption, db.session))


@app.route('/')
@app.route('/<path:path>')  # Enable any url redirecting to home for SPA
def index(path=None):
    return send_from_directory('../build', 'index.html')


app.register_blueprint(server.views.api)
