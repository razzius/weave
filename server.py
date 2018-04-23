from datetime import datetime

from flask import Flask, jsonify, request, send_from_directory, Response

from flask_sqlalchemy import SQLAlchemy
from marshmallow import fields
from marshmallow_sqlalchemy import ModelSchema
from sqlalchemy import PrimaryKeyConstraint
from sqlalchemy.ext.declarative import declared_attr


app = Flask(
    __name__,
    static_url_path='/static',
    static_folder='build/static'
)
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


@app.route('/')
@app.route('/<path:path>')
def index(path=None):
    return send_from_directory('build', 'index.html')


@app.route('/api/profiles')
def get_profiles():
    return jsonify(profiles_schema.dump(Profile.query.all()).data)


@app.route('/api/profile/<profile_id>')
def get_profile(profile_id=None):
    return {}


@app.route('/api/profile', methods=['POST'])
def create_profile(profile_id=None):
    data = request.json
    errors = profile_schema.validate(data, session=db.session)

    if errors:
        return Response(errors, status=400, content_type='application/json')

    if Profile.query.filter(Profile.email == data['email']).count > 0:
        return Response({'email': ['This email already exists in the database']},
                        status=400,
                        content_type='application/json')

    profile = Profile(**data)
    db.session.add(profile)
    db.session.commit()

    return profile_schema.dump(profile).data


@app.route('/api/profile/<profile_id>', methods=['PUT'])
def update_profile(profile_id=None):
    profile = Profile({})
    db.session.add(profile)
    db.session.commit()

    return jsonify(ProfileSchema().dump(profile).data)
