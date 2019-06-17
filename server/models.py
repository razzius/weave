import uuid
from datetime import datetime

from flask_sqlalchemy import SQLAlchemy
from sqlalchemy.orm import relationship


db = SQLAlchemy()


def save(instance):
    db.session.add(instance)
    db.session.commit()


def get_verification_email_by_email(email):
    return VerificationEmail.query.filter(
        VerificationEmail.email == email
    ).one_or_none()


def generate_uuid():
    return str(uuid.uuid4())


class IDMixin():
    id = db.Column(db.Integer, primary_key=True)


class VerificationEmail(IDMixin, db.Model):
    email = db.Column(db.String(120), unique=True, nullable=False)
    is_admin = db.Column(db.Boolean)
    is_mentor = db.Column(db.Boolean)
    is_personal_device = db.Column(db.Boolean)

    def __str__(self):
        return f'<VerificationEmail {self.id}: {self.email}>'


class PredefinedTagMixin(IDMixin):
    value = db.Column(db.String(50))


class UserEditableTagMixin(IDMixin):
    value = db.Column(db.String(50))
    public = db.Column(db.Boolean, default=False)


class HospitalAffiliationOption(PredefinedTagMixin, db.Model):
    pass


class ClinicalSpecialtyOption(UserEditableTagMixin, db.Model):
    pass


class ProfessionalInterestOption(UserEditableTagMixin, db.Model):
    pass


class PartsOfMeOption(UserEditableTagMixin, db.Model):
    pass


class ActivityOption(UserEditableTagMixin, db.Model):
    pass


class DegreeOption(UserEditableTagMixin, db.Model):
    pass


class HospitalAffiliation(IDMixin, db.Model):
    tag_id = db.Column(
        db.Integer, db.ForeignKey(HospitalAffiliationOption.id), nullable=False
    )
    tag = relationship(HospitalAffiliationOption)

    profile_id = db.Column(db.String, db.ForeignKey('profile.id'), nullable=False)


class ClinicalSpecialty(IDMixin, db.Model):
    tag_id = db.Column(
        db.Integer, db.ForeignKey(ClinicalSpecialtyOption.id), nullable=False
    )
    tag = relationship(ClinicalSpecialtyOption)

    profile_id = db.Column(db.String, db.ForeignKey('profile.id'), nullable=False)


class PartsOfMe(IDMixin, db.Model):
    tag_id = db.Column(
        db.Integer, db.ForeignKey(PartsOfMeOption.id), nullable=False
    )
    tag = relationship(PartsOfMeOption)

    profile_id = db.Column(db.String, db.ForeignKey('profile.id'), nullable=False)


class ProfessionalInterest(IDMixin, db.Model):
    tag_id = db.Column(
        db.Integer, db.ForeignKey(ProfessionalInterestOption.id), nullable=False
    )
    tag = relationship(ProfessionalInterestOption)

    profile_id = db.Column(db.String, db.ForeignKey('profile.id'), nullable=False)


class ProfileActivity(IDMixin, db.Model):
    tag_id = db.Column(
        db.Integer, db.ForeignKey(ActivityOption.id), nullable=False
    )
    tag = relationship(ActivityOption)

    profile_id = db.Column(db.String, db.ForeignKey('profile.id'), nullable=False)


class ProfileDegree(IDMixin, db.Model):
    tag_id = db.Column(
        db.Integer, db.ForeignKey(DegreeOption.id), nullable=False
    )
    tag = relationship(DegreeOption)

    profile_id = db.Column(db.String, db.ForeignKey('profile.id'), nullable=False)


class Profile(db.Model):
    id = db.Column(db.String, primary_key=True, default=generate_uuid)
    name = db.Column(db.String(255), nullable=False)
    verification_email_id = db.Column(
        db.Integer, db.ForeignKey(VerificationEmail.id), nullable=False
    )
    verification_email = relationship(VerificationEmail, uselist=False)
    contact_email = db.Column(db.String(120), unique=True, nullable=False)

    profile_image_url = db.Column(db.String(255))

    clinical_specialties = relationship(ClinicalSpecialty, cascade='all, delete')
    affiliations = relationship(HospitalAffiliation, cascade='all, delete')
    professional_interests = relationship(ProfessionalInterest, cascade='all, delete')
    parts_of_me = relationship(PartsOfMe, cascade='all, delete')
    activities = relationship(ProfileActivity, cascade='all, delete')
    degrees = relationship(ProfileDegree, cascade='all, delete')

    date_created = db.Column(db.DateTime, nullable=False, default=datetime.utcnow)
    date_updated = db.Column(db.DateTime, nullable=False, default=datetime.utcnow)

    # TODO make not nullable and remove additional_information === null workarounds
    additional_information = db.Column(db.String(500), default='')

    willing_shadowing = db.Column(db.Boolean, default=False)
    willing_networking = db.Column(db.Boolean, default=False)
    willing_goal_setting = db.Column(db.Boolean, default=False)
    willing_discuss_personal = db.Column(db.Boolean, default=False)
    willing_career_guidance = db.Column(db.Boolean, default=False)
    willing_student_group = db.Column(db.Boolean, default=False)

    cadence = db.Column(db.String(255))
    other_cadence = db.Column(db.String(255), nullable=True)

    available_for_mentoring = db.Column(db.Boolean, default=True)

    def __repr__(self):
        return f'<Profile id={self.id} name={self.name}>'


class VerificationToken(db.Model):
    token = db.Column(db.String(36), primary_key=True)
    email_id = db.Column(
        db.Integer, db.ForeignKey(VerificationEmail.id), nullable=False
    )
    date_created = db.Column(db.DateTime, nullable=False, default=datetime.utcnow)
    verified = db.Column(db.Boolean, default=False)

    expired = db.Column(db.Boolean, default=False)

    email_log = db.Column(db.Text)
