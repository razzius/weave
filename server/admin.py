from flask_admin import Admin, AdminIndexView, expose
from flask_admin.contrib.sqla import ModelView
from flask_basicauth import BasicAuth

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

basic_auth = BasicAuth()


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


admin = Admin(index_view=BasicAuthAdminView())
admin.add_view(BasicAuthModelView(VerificationToken, db.session))
admin.add_view(BasicAuthModelView(VerificationEmail, db.session))
admin.add_view(BasicAuthModelView(Profile, db.session))
admin.add_view(BasicAuthModelView(ClinicalSpecialtyOption, db.session))
admin.add_view(BasicAuthModelView(ProfessionalInterestOption, db.session))
admin.add_view(BasicAuthModelView(PartsOfMeOption, db.session))
admin.add_view(BasicAuthModelView(ActivityOption, db.session))
admin.add_view(BasicAuthModelView(HospitalAffiliationOption, db.session))
admin.add_view(BasicAuthModelView(DegreeOption, db.session))


def init_admin(app):
    basic_auth.init_app(app)
    admin.init_app(app)
