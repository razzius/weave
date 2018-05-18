import os
import json
from datetime import datetime

from flask import Flask, Response, jsonify, request, send_from_directory

from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy
from marshmallow import Schema, ValidationError, fields
from sqlalchemy.sql import exists
from sqlalchemy.types import TypeDecorator, VARCHAR


app = Flask(__name__, static_url_path="/static", static_folder="build/static")
app.config["SQLALCHEMY_DATABASE_URI"] = os.environ["DATABASE_URL"]
app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False
db = SQLAlchemy(app)
CORS(app)


class StringEncodedList(TypeDecorator):

    impl = VARCHAR

    def process_bind_param(self, value, dialect):
        return ",".join(value)

    def process_result_value(self, value, dialect):
        if value == "":
            return []
        else:
            return value.split(",")


class Profile(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(255), nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)

    clinical_specialties = db.Column(StringEncodedList(1024))
    affiliations = db.Column(StringEncodedList(1024))
    additional_interests = db.Column(StringEncodedList(1024))

    date_created = db.Column(db.DateTime, nullable=False, default=datetime.utcnow)
    date_updated = db.Column(db.DateTime, nullable=False, default=datetime.utcnow)

    additional_information = db.Column(db.String(500), nullable=False)

    def __repr__(self):
        return f"<Profile id={self.id} name={self.name}>"


class RenderedList(fields.List):

    def _serialize(self, value, attr, obj):
        if value is None:
            return []
        return super()._serialize(value, attr, obj)

    def _deserialize(self, value, attr, data):
        if value is None:
            return ""
        return super()._deserialize(value, attr, data)


class ProfileSchema(Schema):
    id = fields.Int(dump_only=True)
    name = fields.String()
    email = fields.String()

    clinical_specialties = RenderedList(fields.String, required=True)
    additional_interests = RenderedList(fields.String, required=True)
    affiliations = RenderedList(fields.String, required=True)

    additional_information = fields.String()


profile_schema = ProfileSchema()
profiles_schema = ProfileSchema(many=True)


@app.route("/")
@app.route("/<path:path>")  # Enable any url redirecting to home for SPA
def index(path=None):
    return send_from_directory("build", "index.html")


@app.route("/api/profiles")
def get_profiles():
    return jsonify(profiles_schema.dump(Profile.query.all()).data)


@app.route("/api/profiles/<profile_id>")
def get_profile(profile_id=None):
    return jsonify(
        profile_schema.dump(
            Profile.query.filter(Profile.id == profile_id).one_or_none()
        ).data
    )


def error(reason):
    return Response(json.dumps(reason), status=400, content_type="application/json")


@app.route("/api/profile", methods=["POST"])
def create_profile(profile_id=None):
    json_data = request.get_json()

    try:
        schema = profile_schema.load(json_data)
    except ValidationError as err:
        return jsonify(err.messages), 422

    if schema.errors:
        return jsonify(schema.errors), 422

    if db.session.query(exists().where(Profile.email == schema.data["email"])).scalar():
        return error({"email": ["This email already exists in the database"]})

    profile = Profile(**schema.data)
    db.session.add(profile)
    db.session.commit()

    return jsonify(profile_schema.dump(profile).data)


@app.route("/api/profile/<profile_id>", methods=["PUT"])
def update_profile(profile_id=None):
    profile = Profile({})
    db.session.add(profile)
    db.session.commit()

    return jsonify(ProfileSchema().dump(profile).data)