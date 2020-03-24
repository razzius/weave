import uuid
from datetime import datetime
from typing import Any

from flask_sqlalchemy import SQLAlchemy
from sqlalchemy.orm import relationship
from sqlalchemy.ext.declarative import declared_attr


db: Any = SQLAlchemy()


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
    is_mentor = db.Column(db.Boolean)

    def __str__(self):
        return f'<VerificationEmail {self.id}: {self.email}>'


class TagValueMixin(IDMixin):
    date_created = db.Column(db.DateTime, nullable=False, default=default_now)
    value = db.Column(db.String(50), unique=True)


class UserEditableTagMixin(TagValueMixin):
    public = db.Column(db.Boolean, default=True)


class HospitalAffiliationOption(TagValueMixin, db.Model):
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


class ProfileTagMixin(IDMixin):
    @declared_attr
    def profile_id(cls):
        return db.Column(db.String, db.ForeignKey('profile.id'), nullable=False)

    @declared_attr
    def profile(cls):
        return relationship('Profile')

    def __str__(self):
        return self.tag.value

    def __repr__(self):
        return '<{}: {}>'.format(self.__class__.__name__, self.tag.value)


class HospitalAffiliation(ProfileTagMixin, db.Model):
    tag_id = db.Column(
        db.Integer, db.ForeignKey(HospitalAffiliationOption.id), nullable=False
    )
    tag = relationship(HospitalAffiliationOption)

    profile_id = db.Column(db.String, db.ForeignKey('profile.id'), nullable=False)


class ClinicalSpecialty(ProfileTagMixin, db.Model):
    tag_id = db.Column(
        db.Integer, db.ForeignKey(ClinicalSpecialtyOption.id), nullable=False
    )
    tag = relationship(ClinicalSpecialtyOption)


class PartsOfMe(ProfileTagMixin, db.Model):
    tag_id = db.Column(db.Integer, db.ForeignKey(PartsOfMeOption.id), nullable=False)
    tag = relationship(PartsOfMeOption)


class ProfessionalInterest(ProfileTagMixin, db.Model):
    tag_id = db.Column(
        db.Integer, db.ForeignKey(ProfessionalInterestOption.id), nullable=False
    )
    tag = relationship(ProfessionalInterestOption)


class ProfileActivity(ProfileTagMixin, db.Model):
    tag_id = db.Column(db.Integer, db.ForeignKey(ActivityOption.id), nullable=False)
    tag = relationship(ActivityOption)


class ProfileDegree(ProfileTagMixin, db.Model):
    tag_id = db.Column(db.Integer, db.ForeignKey(DegreeOption.id), nullable=False)
    tag = relationship(DegreeOption)


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

    date_created = db.Column(db.DateTime, nullable=False, default=default_now)
    date_updated = db.Column(db.DateTime, nullable=False, default=default_now)

    # TODO make not nullable and remove additional_information === null workarounds
    additional_information = db.Column(db.String(500), default='')

    willing_shadowing = db.Column(db.Boolean, default=False)
    willing_networking = db.Column(db.Boolean, default=False)
    willing_goal_setting = db.Column(db.Boolean, default=False)
    willing_discuss_personal = db.Column(db.Boolean, default=False)
    willing_career_guidance = db.Column(db.Boolean, default=False)
    willing_student_group = db.Column(db.Boolean, default=False)

    cadence = db.Column(db.String(255), nullable=False)
    other_cadence = db.Column(db.String(255), nullable=True)

    available_for_mentoring = db.Column(db.Boolean, default=True)

    def __repr__(self):
        return f'<Profile id={self.id} name={self.name}>'


class VerificationToken(db.Model):
    token = db.Column(db.String(36), primary_key=True)
    email_id = db.Column(
        db.Integer, db.ForeignKey(VerificationEmail.id), nullable=False
    )
    email = relationship(VerificationEmail, backref='verification_tokens')
    date_created = db.Column(db.DateTime, nullable=False, default=default_now)
    verified = db.Column(db.Boolean, default=False)

    expired = db.Column(db.Boolean, default=False)

    email_log = db.Column(db.Text)

    is_personal_device = db.Column(db.Boolean)
