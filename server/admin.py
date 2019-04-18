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


class ModelViewSortedById(BasicAuthModelView):
    column_default_sort = ('id', False)


class ModelViewSortedByValue(BasicAuthModelView):
    column_default_sort = ('value', False)


class ModelViewSortedByDateCreated(BasicAuthModelView):
    column_default_sort = ('date_created', False)


admin = Admin(index_view=BasicAuthAdminView())
admin.add_view(ModelViewSortedByDateCreated(VerificationToken, db.session))
admin.add_view(ModelViewSortedById(VerificationEmail, db.session))
admin.add_view(ModelViewSortedByDateCreated(Profile, db.session))
admin.add_view(ModelViewSortedByValue(ClinicalSpecialtyOption, db.session))
admin.add_view(ModelViewSortedByValue(ProfessionalInterestOption, db.session))
admin.add_view(ModelViewSortedByValue(PartsOfMeOption, db.session))
admin.add_view(ModelViewSortedByValue(ActivityOption, db.session))
admin.add_view(ModelViewSortedByValue(HospitalAffiliationOption, db.session))
admin.add_view(ModelViewSortedByValue(DegreeOption, db.session))


def init_admin(app):
    basic_auth.init_app(app)
    admin.init_app(app)
