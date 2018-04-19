from datetime import datetime

from flask import Flask, jsonify
from marshmallow import fields

from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import PrimaryKeyConstraint
from sqlalchemy.ext.declarative import declared_attr
from marshmallow_sqlalchemy import ModelSchema


app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:////tmp/test.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
db = SQLAlchemy(app)


class Profile(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(255), nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)

    date_created = db.Column(db.DateTime, nullable=False, default=datetime.utcnow)
    date_updated = db.Column(db.DateTime, nullable=False, default=datetime.utcnow)

    def __repr__(self):
        return f'<Profile id={self.id} name={self.name}>'


class Interest():
    interest = db.Column(db.String(120))

    @declared_attr
    def profile_id(cls):
        return db.Column(db.Integer, db.ForeignKey(Profile.id), nullable=False)

    @declared_attr
    def __table_args__(cls):
        return (
            PrimaryKeyConstraint('interest', 'profile_id', name='interest_pk'),
        )


class PersonalInterest(db.Model, Interest):
    profile = db.relationship('Profile', backref=db.backref('personal_interests', lazy=True))


class ClinicalInterest(db.Model, Interest):
    profile = db.relationship('Profile', backref=db.backref('clinical_interests', lazy=True))


class PersonalInterestSchema(ModelSchema):
    class Meta:
        model = PersonalInterest


class ClinicalInterestSchema(ModelSchema):
    class Meta:
        model = ClinicalInterest


class ProfileSchema(ModelSchema):
    personal_interests = fields.Nested(PersonalInterestSchema, many=True, exclude=('profile',))
    clinical_interests = fields.Nested(ClinicalInterestSchema, many=True, exclude=('profile',))

    class Meta:
        model = Profile
        fields = ['id', 'name', 'email', 'personal_interests', 'clinical_interests']


profile_schema = ProfileSchema()
profiles_schema = ProfileSchema(many=True)


@app.route('/api/profiles')
def get_profiles():
    return jsonify(profiles_schema.dump(Profile.query.all()).data)


@app.route('/api/profile/<profile_id>')
def get_profile(profile_id=None):
    return {}


@app.route('/api/profile/<profile_id>', methods=['POST'])
def create_profile(profile_id=None):
    profile = Profile({})
    db.session.add(profile)
    db.session.commit()

    profile_schema = ProfileSchema()
    return profile_schema.dump(profile).data


@app.route('/api/profile/<profile_id>', methods=['PUT'])
def update_profile(profile_id=None):
    profile = Profile({})
    db.session.add(profile)
    db.session.commit()

    return jsonify(ProfileSchema().dump(profile).data)
