import uuid
from datetime import datetime
from typing import Any

from flask_sqlalchemy import SQLAlchemy
from sqlalchemy.ext.declarative import declared_attr
from sqlalchemy.orm import relationship

from server.session import token_expired


db: Any = SQLAlchemy(engine_options={"pool_pre_ping": True})


def save(instance):
    db.session.add(instance)
    db.session.commit()

    return instance


def default_now():
    """
    Bind a reference to datetime.utcnow() so that freezegun can patch it.

    If datetime.utcnow is passed to `default`, it will be bound at module
    evaluation time and freezegun will have no effect.
    """
    return datetime.utcnow()


def generate_uuid():
    return str(uuid.uuid4())


class IDMixin:
    id = db.Column(db.Integer, primary_key=True)


class VerificationEmail(IDMixin, db.Model):
    email = db.Column(db.String(120), unique=True, nullable=False)
    is_admin = db.Column(db.Boolean)
    is_faculty = db.Column(db.Boolean)

    def __str__(self):
        return f"<VerificationEmail {self.id}: {self.email}>"


class TagValueMixin(IDMixin):
    date_created = db.Column(db.DateTime, nullable=False, default=default_now)
    value = db.Column(db.String(50), unique=True)


class UserEditableTagMixin(TagValueMixin):
    public = db.Column(db.Boolean, default=True)


class HospitalAffiliationOption(TagValueMixin, db.Model):
    pass


class StudentProgramOption(TagValueMixin, db.Model):
    pass


class StudentYearOption(TagValueMixin, db.Model):
    pass


class StudentPCESiteOption(TagValueMixin, db.Model):
    pass


class DegreeOption(TagValueMixin, db.Model):
    pass


class ClinicalSpecialtyOption(UserEditableTagMixin, db.Model):
    pass


class ProfessionalInterestOption(UserEditableTagMixin, db.Model):
    pass


class PartsOfMeOption(UserEditableTagMixin, db.Model):
    pass


class ActivityOption(UserEditableTagMixin, db.Model):
    pass


class BaseProfile:
    id = db.Column(db.String, primary_key=True, default=generate_uuid)
    name = db.Column(db.String(255), nullable=False)
    contact_email = db.Column(db.String(120), nullable=False)

    profile_image_url = db.Column(db.String(255))

    date_created = db.Column(db.DateTime, nullable=False, default=default_now)
    date_updated = db.Column(db.DateTime, nullable=False, default=default_now)

    # TODO make not nullable and remove additional_information === null workarounds
    additional_information = db.Column(db.String(500), default="")

    cadence = db.Column(db.String(255), nullable=False)
    other_cadence = db.Column(db.String(255), nullable=True)

    available_for_mentoring = db.Column(db.Boolean, default=True)

    willing_discuss_personal = db.Column(db.Boolean, default=False)
    willing_student_group = db.Column(db.Boolean, default=False)

    @declared_attr
    def verification_email_id(cls):
        return db.Column(
            db.Integer, db.ForeignKey(VerificationEmail.id), nullable=False
        )

    @declared_attr
    def verification_email(cls):
        return relationship(VerificationEmail, uselist=False)

    def __repr__(self):
        return f"<{self.__class__.__name__} id={self.id} name={self.name}>"


class FacultyProfile(BaseProfile, db.Model):
    # TODO rename to hospital_affiliations
    affiliations = relationship("FacultyHospitalAffiliation", cascade="all, delete")

    clinical_specialties = relationship(
        "FacultyClinicalSpecialty", cascade="all, delete"
    )

    professional_interests = relationship(
        "FacultyProfessionalInterest", cascade="all, delete"
    )

    parts_of_me = relationship("FacultyPartsOfMe", cascade="all, delete")

    activities = relationship("FacultyProfileActivity", cascade="all, delete")

    degrees = relationship("FacultyProfileDegree", cascade="all, delete")

    willing_shadowing = db.Column(db.Boolean, default=False)
    willing_networking = db.Column(db.Boolean, default=False)
    willing_goal_setting = db.Column(db.Boolean, default=False)
    willing_career_guidance = db.Column(db.Boolean, default=False)


class StudentProfile(BaseProfile, db.Model):
    affiliations = relationship("StudentHospitalAffiliation", cascade="all, delete")

    clinical_specialties = relationship(
        "StudentClinicalSpecialty", cascade="all, delete"
    )

    professional_interests = relationship(
        "StudentProfessionalInterest", cascade="all, delete"
    )

    parts_of_me = relationship("StudentPartsOfMe", cascade="all, delete")

    activities = relationship("StudentProfileActivity", cascade="all, delete")

    program_id = db.Column(
        db.Integer, db.ForeignKey(StudentProgramOption.id), nullable=True
    )
    program = relationship(StudentProgramOption)

    current_year_id = db.Column(
        db.Integer, db.ForeignKey(StudentYearOption.id), nullable=True
    )
    current_year = relationship(StudentYearOption)

    pce_site_id = db.Column(
        db.Integer, db.ForeignKey(StudentPCESiteOption.id), nullable=True
    )
    pce_site = relationship(StudentPCESiteOption)

    willing_dual_degrees = db.Column(db.Boolean, default=False)
    willing_advice_clinical_rotations = db.Column(db.Boolean, default=False)
    willing_research = db.Column(db.Boolean, default=False)
    willing_residency = db.Column(db.Boolean, default=False)


class ProfileTagMixin(IDMixin):
    def __str__(self):
        return self.tag.value

    def __repr__(self):
        return "<{}: {}>".format(self.__class__.__name__, self.tag.value)


class FacultyProfileTagMixin(ProfileTagMixin):
    @declared_attr
    def profile_id(cls):
        return db.Column(db.String, db.ForeignKey(FacultyProfile.id), nullable=False)

    @declared_attr
    def profile(cls):
        return relationship(FacultyProfile)


class StudentProfileTagMixin(ProfileTagMixin):
    @declared_attr
    def profile_id(cls):
        return db.Column(db.String, db.ForeignKey(StudentProfile.id), nullable=False)

    @declared_attr
    def profile(cls):
        return relationship(StudentProfile)


class FacultyHospitalAffiliation(FacultyProfileTagMixin, db.Model):
    tag_id = db.Column(
        db.Integer, db.ForeignKey(HospitalAffiliationOption.id), nullable=False
    )
    tag = relationship(HospitalAffiliationOption)


class FacultyClinicalSpecialty(FacultyProfileTagMixin, db.Model):
    tag_id = db.Column(
        db.Integer, db.ForeignKey(ClinicalSpecialtyOption.id), nullable=False
    )
    tag = relationship(ClinicalSpecialtyOption)


class FacultyPartsOfMe(FacultyProfileTagMixin, db.Model):
    tag_id = db.Column(db.Integer, db.ForeignKey(PartsOfMeOption.id), nullable=False)
    tag = relationship(PartsOfMeOption)


class FacultyProfessionalInterest(FacultyProfileTagMixin, db.Model):
    tag_id = db.Column(
        db.Integer, db.ForeignKey(ProfessionalInterestOption.id), nullable=False
    )
    tag = relationship(ProfessionalInterestOption)


class FacultyProfileActivity(FacultyProfileTagMixin, db.Model):
    tag_id = db.Column(db.Integer, db.ForeignKey(ActivityOption.id), nullable=False)
    tag = relationship(ActivityOption)


class FacultyProfileDegree(FacultyProfileTagMixin, db.Model):
    tag_id = db.Column(db.Integer, db.ForeignKey(DegreeOption.id), nullable=False)
    tag = relationship(DegreeOption)


class StudentHospitalAffiliation(StudentProfileTagMixin, db.Model):
    tag_id = db.Column(
        db.Integer, db.ForeignKey(HospitalAffiliationOption.id), nullable=False
    )
    tag = relationship(HospitalAffiliationOption)


class StudentClinicalSpecialty(StudentProfileTagMixin, db.Model):
    tag_id = db.Column(
        db.Integer, db.ForeignKey(ClinicalSpecialtyOption.id), nullable=False
    )
    tag = relationship(ClinicalSpecialtyOption)


class StudentPartsOfMe(StudentProfileTagMixin, db.Model):
    tag_id = db.Column(db.Integer, db.ForeignKey(PartsOfMeOption.id), nullable=False)
    tag = relationship(PartsOfMeOption)


class StudentProfessionalInterest(StudentProfileTagMixin, db.Model):
    tag_id = db.Column(
        db.Integer, db.ForeignKey(ProfessionalInterestOption.id), nullable=False
    )
    tag = relationship(ProfessionalInterestOption)


class StudentProfileActivity(StudentProfileTagMixin, db.Model):
    tag_id = db.Column(db.Integer, db.ForeignKey(ActivityOption.id), nullable=False)
    tag = relationship(ActivityOption)


class ProfileStar(db.Model):
    from_verification_email_id = db.Column(
        db.Integer, db.ForeignKey(VerificationEmail.id), primary_key=True
    )
    to_verification_email_id = db.Column(
        db.Integer, db.ForeignKey(VerificationEmail.id), primary_key=True
    )


class VerificationToken(db.Model, IDMixin):
    token = db.Column(db.String(36), unique=True)
    email_id = db.Column(
        db.Integer, db.ForeignKey(VerificationEmail.id), nullable=False
    )
    email = relationship(VerificationEmail, backref="verification_tokens")
    date_created = db.Column(db.DateTime, nullable=False, default=default_now)
    verified = db.Column(db.Boolean, default=False)

    logged_out = db.Column(db.Boolean, default=False)

    email_log = db.Column(db.Text)

    is_personal_device = db.Column(db.Boolean)

    def get_id(self):
        return self.token

    @property
    def is_active(self):
        return self.is_authenticated

    @property
    def is_authenticated(self):
        return not self.logged_out and not token_expired(self)

    @property
    def is_anonymous(self):
        return False
