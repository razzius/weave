import json
from datetime import datetime

from flask import Flask, Response, jsonify, request, send_from_directory

from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy
from marshmallow import Schema, ValidationError, fields, pre_load
from sqlalchemy import PrimaryKeyConstraint
from sqlalchemy.ext.declarative import declared_attr
from sqlalchemy.sql import exists


app = Flask(__name__, static_url_path="/static", static_folder="build/static")
app.config["SQLALCHEMY_DATABASE_URI"] = "sqlite:////tmp/test.db"
app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False
db = SQLAlchemy(app)
CORS(app)


class Profile(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(255), nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)

    personal_interests = db.Column(db.String(1000))

    date_created = db.Column(db.DateTime, nullable=False, default=datetime.utcnow)
    date_updated = db.Column(db.DateTime, nullable=False, default=datetime.utcnow)

    def __repr__(self):
        return f"<Profile id={self.id} name={self.name}>"


# class Interest():
#     interest = db.Column(db.String(120))

#     @declared_attr
#     def profile_id(cls):
#         return db.Column(db.Integer, db.ForeignKey(Profile.id), nullable=False)

#     @declared_attr
#     def __table_args__(cls):
#         return (PrimaryKeyConstraint("interest", "profile_id", name="interest_pk"),)


# class PersonalInterest(db.Model, Interest):
#     profile = db.relationship(
#         "Profile", backref=db.backref("personal_interests", lazy=True)
#     )


# class ClinicalInterest(db.Model, Interest):
#     profile = db.relationship(
#         "Profile", backref=db.backref("clinical_interests", lazy=True)
#     )


# class Affiliation(db.Model):
#     affiliation = db.Column(db.String(120))

#     profile_id = db.Column(db.Integer, db.ForeignKey(Profile.id), nullable=False)
#     profile = db.relationship("Profile", backref=db.backref("affiliations", lazy='dynamic'))

#     @declared_attr
#     def __table_args__(cls):
#         return (PrimaryKeyConstraint("affiliation", "profile_id", name="interest_pk"),)


class PersonalInterestSchema(Schema):

    class Meta:
        model = PersonalInterest


class ClinicalInterestSchema(Schema):

    class Meta:
        model = ClinicalInterest


class AffiliationSchema(Schema):

    class Meta:
        model = Affiliation


class ProfileSchema(Schema):
    id = fields.Int(dump_only=True)
    name = fields.String()
    email = fields.String()

    # personal_interests = fields.Nested(
    #     PersonalInterestSchema, many=True, exclude=("profile",)
    # )
    # clinical_interests = fields.Nested(
    #     ClinicalInterestSchema, many=True, exclude=("profile",)
    # )
    # affiliations = fields.Nested(AffiliationSchema, many=True, exclude=("profile",))

    @pre_load
    def process_personal_interests(self, data):
        data['personal_interests'] = [
            {'interest': interest} for interest in data['personal_interests']
        ]
        return data


profile_schema = ProfileSchema()
profiles_schema = ProfileSchema(many=True)


@app.route("/")
@app.route("/<path:path>")
def index(path=None):
    return send_from_directory("build", "index.html")


@app.route("/api/profiles")
def get_profiles():
    return jsonify(profiles_schema.dump(Profile.query.all()))


@app.route("/api/profile/<profile_id>")
def get_profile(profile_id=None):
    return {}


def error(reason):
    return Response(json.dumps(reason), status=400, content_type="application/json")


@app.route("/api/profile", methods=["POST"])
def create_profile(profile_id=None):
    json_data = request.get_json()

    try:
        data = profile_schema.load(json_data)
    except ValidationError as err:
        return jsonify(err.messages), 422

    if db.session.query(exists().where(Profile.email == data["email"])).scalar():
        return error({"email": ["This email already exists in the database"]})

    profile = Profile(**data)
    db.session.add(profile)
    db.session.commit()

    return profile_schema.dump(profile).data


@app.route("/api/profile/<profile_id>", methods=["PUT"])
def update_profile(profile_id=None):
    profile = Profile({})
    db.session.add(profile)
    db.session.commit()

    return jsonify(ProfileSchema().dump(profile).data)
