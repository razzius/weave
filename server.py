from datetime import datetime

from flask import Flask, jsonify

from flask_sqlalchemy import SQLAlchemy
from flask_marshmallow import Marshmallow
from sqlalchemy import PrimaryKeyConstraint


app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:////tmp/test.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
db = SQLAlchemy(app)
ma = Marshmallow(app)


class Profile(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(255), nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)

    date_created = db.Column(db.DateTime, nullable=False, default=datetime.utcnow)
    date_updated = db.Column(db.DateTime, nullable=False, default=datetime.utcnow)

    def __repr__(self):
        return f'<Profile id={self.id} name={self.name}>'


class ProfileInterest(db.Model):
    interest = db.Column(db.String(120))

    clinical = db.Column(db.Boolean)

    profile_id = db.Column(db.Integer, db.ForeignKey(Profile.id), nullable=False)
    profile = db.relationship('Profile', backref=db.backref('posts', lazy=True))

    __table_args__ = (
        PrimaryKeyConstraint('interest', 'clinical', 'profile_id', name='interest_pk'),
    )


class SchemaFieldsMeta(ma.Schema.__class__):
    def __new__(cls, name, bases, attrs):
        if 'Meta' in attrs:
            attrs['Meta'].fields = [column.name for column in attrs['Meta'].model.__table__.columns]
        return super().__new__(cls, name, bases, attrs)


class MagicSchema(ma.Schema, metaclass=SchemaFieldsMeta):
    pass


class ProfileSchema(MagicSchema):
    class Meta:
        model = Profile


profile_schema = ProfileSchema()
profiles_schema = ProfileSchema(many=True)


@app.route('/api/profiles')
def get_profiles():
    return profiles_schema.jsonify(Profile.query.all())


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
