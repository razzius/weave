import datetime
import uuid
from typing import Any

from flask_sqlalchemy import SQLAlchemy
import sqlalchemy
from sqlalchemy.ext.declarative import declared_attr
from sqlalchemy.orm import relationship

from server.session import token_expired

from server.current_time import get_current_time


db: Any = SQLAlchemy(engine_options={"pool_pre_ping": True})

Column = db.Column


def save(instance):
    db.session.add(instance)
    db.session.commit()

    return instance


def generate_uuid():
    return str(uuid.uuid4())


class GetByIDMixin:

    @classmethod
    def get_by_id(cls, id_):
        return cls.query.session.get(cls, id_)


class IDMixin(GetByIDMixin):
    id = Column(db.Integer, primary_key=True)


class TimeStamp(sqlalchemy.types.TypeDecorator):
    impl = sqlalchemy.types.DateTime
    cache_ok = True

    def process_bind_param(self, value: datetime, _dialect):
        return value.astimezone(datetime.timezone.utc)

    def process_result_value(self, value, _dialect):
        return value.astimezone(datetime.timezone.utc)


class VerificationEmail(IDMixin, db.Model):
    email = Column(db.String(120), unique=True, nullable=False)
    is_admin = Column(db.Boolean)
    is_faculty = Column(db.Boolean)

    def __str__(self):
        return f"<VerificationEmail {self.id}: {self.email}>"


class TagValueMixin(IDMixin):
    date_created = Column(TimeStamp, nullable=False, default=get_current_time)
    value = Column(db.String(50), unique=True)


class UserEditableTagMixin(TagValueMixin):
    public = Column(db.Boolean, default=True)


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


class BaseProfile(GetByIDMixin):
    id = Column(db.String, primary_key=True, default=generate_uuid)
    name = Column(db.String(255), nullable=False)
    contact_email = Column(db.String(120), nullable=False)

    profile_image_url = Column(db.String(255))

    date_created = Column(TimeStamp, nullable=False, default=get_current_time)
    date_updated = Column(TimeStamp, nullable=False, default=get_current_time)

    additional_information = Column(db.String(500), nullable=False, default="")

    cadence = Column(db.String(255), nullable=False)
    other_cadence = Column(db.String(255), nullable=True)

    available_for_mentoring = Column(db.Boolean, default=True)

    willing_discuss_personal = Column(db.Boolean, default=False)
    willing_student_group = Column(db.Boolean, default=False)

    @declared_attr
    def verification_email_id(cls):
        return Column(
            db.Integer, db.ForeignKey(VerificationEmail.id), nullable=False
        )

    @declared_attr
    def verification_email(cls):
        return relationship(VerificationEmail, uselist=False)

    def __repr__(self):
        return f"<{self.__class__.__name__} id={self.id} name={self.name}>"


class FacultyProfile(BaseProfile, db.Model):
    # TODO rename to hospital_affiliations
    affiliations = relationship("FacultyHospitalAffiliation", cascade="all, delete", viewonly=True)

    clinical_specialties = relationship(
        "FacultyClinicalSpecialty", cascade="all, delete", viewonly=True
    )

    professional_interests = relationship(
        "FacultyProfessionalInterest", cascade="all, delete", viewonly=True
    )

    parts_of_me = relationship("FacultyPartsOfMe", cascade="all, delete", viewonly=True)

    activities = relationship("FacultyProfileActivity", cascade="all, delete", viewonly=True)

    degrees = relationship("FacultyProfileDegree", cascade="all, delete", viewonly=True)

    willing_shadowing = Column(db.Boolean, default=False)
    willing_networking = Column(db.Boolean, default=False)
    willing_goal_setting = Column(db.Boolean, default=False)
    willing_career_guidance = Column(db.Boolean, default=False)


class StudentProfile(BaseProfile, db.Model):
    affiliations = relationship("StudentHospitalAffiliation", cascade="all, delete", viewonly=True)

    clinical_specialties = relationship(
        "StudentClinicalSpecialty", cascade="all, delete", viewonly=True
    )

    professional_interests = relationship(
        "StudentProfessionalInterest", cascade="all, delete", viewonly=True
    )

    parts_of_me = relationship("StudentPartsOfMe", cascade="all, delete", viewonly=True)

    activities = relationship("StudentProfileActivity", cascade="all, delete", viewonly=True)

    program_id = Column(
        db.Integer, db.ForeignKey(StudentProgramOption.id), nullable=True
    )
    program = relationship(StudentProgramOption)

    current_year_id = Column(
        db.Integer, db.ForeignKey(StudentYearOption.id), nullable=True
    )
    current_year = relationship(StudentYearOption)

    pce_site_id = Column(
        db.Integer, db.ForeignKey(StudentPCESiteOption.id), nullable=True
    )
    pce_site = relationship(StudentPCESiteOption)

    willing_dual_degrees = Column(db.Boolean, default=False)
    willing_advice_clinical_rotations = Column(db.Boolean, default=False)
    willing_research = Column(db.Boolean, default=False)
    willing_residency = Column(db.Boolean, default=False)


class ProfileTagMixin(IDMixin):
    def __str__(self):
        return self.tag.value

    def __repr__(self):
        return "<{}: {}>".format(self.__class__.__name__, self.tag.value)


class FacultyProfileTagMixin(ProfileTagMixin):
    @declared_attr
    def profile_id(cls):
        return Column(db.String, db.ForeignKey(FacultyProfile.id), nullable=False)

    @declared_attr
    def profile(cls):
        return relationship(FacultyProfile)


class StudentProfileTagMixin(ProfileTagMixin):
    @declared_attr
    def profile_id(cls):
        return Column(db.String, db.ForeignKey(StudentProfile.id), nullable=False)

    @declared_attr
    def profile(cls):
        return relationship(StudentProfile)


class FacultyHospitalAffiliation(FacultyProfileTagMixin, db.Model):
    tag_id = Column(
        db.Integer, db.ForeignKey(HospitalAffiliationOption.id), nullable=False
    )
    tag = relationship(HospitalAffiliationOption)


class FacultyClinicalSpecialty(FacultyProfileTagMixin, db.Model):
    tag_id = Column(
        db.Integer, db.ForeignKey(ClinicalSpecialtyOption.id), nullable=False
    )
    tag = relationship(ClinicalSpecialtyOption)


class FacultyPartsOfMe(FacultyProfileTagMixin, db.Model):
    tag_id = Column(db.Integer, db.ForeignKey(PartsOfMeOption.id), nullable=False)
    tag = relationship(PartsOfMeOption)


class FacultyProfessionalInterest(FacultyProfileTagMixin, db.Model):
    tag_id = Column(
        db.Integer, db.ForeignKey(ProfessionalInterestOption.id), nullable=False
    )
    tag = relationship(ProfessionalInterestOption)


class FacultyProfileActivity(FacultyProfileTagMixin, db.Model):
    tag_id = Column(db.Integer, db.ForeignKey(ActivityOption.id), nullable=False)
    tag = relationship(ActivityOption)


class FacultyProfileDegree(FacultyProfileTagMixin, db.Model):
    tag_id = Column(db.Integer, db.ForeignKey(DegreeOption.id), nullable=False)
    tag = relationship(DegreeOption)


class StudentHospitalAffiliation(StudentProfileTagMixin, db.Model):
    tag_id = Column(
        db.Integer, db.ForeignKey(HospitalAffiliationOption.id), nullable=False
    )
    tag = relationship(HospitalAffiliationOption)


class StudentClinicalSpecialty(StudentProfileTagMixin, db.Model):
    tag_id = Column(
        db.Integer, db.ForeignKey(ClinicalSpecialtyOption.id), nullable=False
    )
    tag = relationship(ClinicalSpecialtyOption)


class StudentPartsOfMe(StudentProfileTagMixin, db.Model):
    tag_id = Column(db.Integer, db.ForeignKey(PartsOfMeOption.id), nullable=False)
    tag = relationship(PartsOfMeOption)


class StudentProfessionalInterest(StudentProfileTagMixin, db.Model):
    tag_id = Column(
        db.Integer, db.ForeignKey(ProfessionalInterestOption.id), nullable=False
    )
    tag = relationship(ProfessionalInterestOption)


class StudentProfileActivity(StudentProfileTagMixin, db.Model):
    tag_id = Column(db.Integer, db.ForeignKey(ActivityOption.id), nullable=False)
    tag = relationship(ActivityOption)


class ProfileStar(db.Model):
    from_verification_email_id = Column(
        db.Integer, db.ForeignKey(VerificationEmail.id), primary_key=True
    )
    to_verification_email_id = Column(
        db.Integer, db.ForeignKey(VerificationEmail.id), primary_key=True
    )


class VerificationToken(db.Model, IDMixin):
    token = Column(db.String(36), unique=True)
    email_id = Column(
        db.Integer, db.ForeignKey(VerificationEmail.id), nullable=False
    )
    email = relationship(VerificationEmail, backref="verification_tokens")
    date_created = Column(
        TimeStamp, nullable=False, default=get_current_time
    )
    verified = Column(db.Boolean, default=False)

    logged_out = Column(db.Boolean, default=False)

    email_log = Column(db.Text)

    is_personal_device = Column(db.Boolean)

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
