import json
import pathlib

from marshmallow import Schema, ValidationError, fields, validates_schema

from .models import StudentPCESiteOption, StudentProgramOption, StudentYearOption


class CustomTagSchema(Schema):
    value = fields.String()


class CustomTagList(Schema):
    tag = fields.Nested(CustomTagSchema, only="value")


nested_tag_list = fields.Nested(CustomTagList, only="tag", many=True, required=True)


class BaseProfileSchema(Schema):
    id = fields.String(dump_only=True)
    name = fields.String(required=True)
    contact_email = fields.String(required=True)
    profile_image_url = fields.String(allow_none=True)
    date_updated = fields.DateTime(dump_only=True)

    affiliations = nested_tag_list
    clinical_specialties = nested_tag_list
    professional_interests = nested_tag_list
    parts_of_me = nested_tag_list
    activities = nested_tag_list

    additional_information = fields.String()

    willing_discuss_personal = fields.Boolean()
    willing_student_group = fields.Boolean()

    cadence = fields.String(missing="monthly")
    other_cadence = fields.String(allow_none=True)

    # This is assigned to profiles by mutation. TODO find a better way
    starred = fields.Boolean(dump_only=True)


class FacultyProfileSchema(BaseProfileSchema):
    degrees = nested_tag_list

    willing_shadowing = fields.Boolean()
    willing_networking = fields.Boolean()
    willing_goal_setting = fields.Boolean()
    willing_career_guidance = fields.Boolean()


class RelationOption(fields.Field):
    def __init__(self, model, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.model = model

    def _deserialize(self, value, *args, **kwargs):
        return self.model.query.filter(self.model.value == value).first()

    def _serialize(self, value, *args, **kwargs):
        if value is None:
            return None

        return value.value


class StudentProfileSchema(BaseProfileSchema):
    program = fields.String()

    current_year = fields.String()

    program = RelationOption(StudentProgramOption, allow_none=True)
    current_year = RelationOption(StudentYearOption, allow_none=True)
    pce_site = RelationOption(StudentPCESiteOption, allow_none=True)

    willing_dual_degrees = fields.Boolean()
    willing_advice_clinical_rotations = fields.Boolean()
    willing_research = fields.Boolean()
    willing_residency = fields.Boolean()


PROJECT_ROOT = pathlib.Path(__file__).parent.parent
VALID_DOMAINS = json.load(open(PROJECT_ROOT / "src" / "valid_domains.json"))


class ValidEmailSchema(Schema):
    email = fields.String(required=True)

    is_personal_device = fields.Boolean(missing=False)

    @validates_schema
    def validate_email(self, in_data):
        email = in_data.get("email", "").lower()

        if not any(email.endswith(domain) for domain in VALID_DOMAINS):
            raise ValidationError(
                "Email must end with harvard.edu or partners.org", "email"
            )


faculty_profile_schema = FacultyProfileSchema()
faculty_profiles_schema = FacultyProfileSchema(many=True)

student_profile_schema = StudentProfileSchema()
student_profiles_schema = StudentProfileSchema(many=True)

valid_email_schema = ValidEmailSchema()
