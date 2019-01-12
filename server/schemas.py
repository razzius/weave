from marshmallow import Schema, ValidationError, fields, validates_schema


class CustomTagSchema(Schema):
    value = fields.String()


class CustomTagList(Schema):
    tag = fields.Nested(CustomTagSchema, only='value')


nested_tag_list = fields.Nested(CustomTagList, only='tag', many=True)


class ProfileSchema(Schema):
    id = fields.String(dump_only=True)
    name = fields.String()
    contact_email = fields.String()
    profile_image_url = fields.String(allow_none=True)

    affiliations = nested_tag_list
    clinical_specialties = nested_tag_list
    professional_interests = nested_tag_list
    parts_of_me = nested_tag_list
    activities = nested_tag_list

    additional_information = fields.String()

    willing_shadowing = fields.Boolean()
    willing_networking = fields.Boolean()
    willing_goal_setting = fields.Boolean()
    willing_discuss_personal = fields.Boolean()
    willing_career_guidance = fields.Boolean()
    willing_student_group = fields.Boolean()

    cadence = fields.String()
    other_cadence = fields.String(allow_none=True)


VALID_DOMAINS = {
    '@hms.harvard.edu',
    '@bidmc.harvard.edu',
    '@bwh.harvard.edu',
    '@mgh.harvard.edu',
    '@childrens.harvard.edu',
    '@dfci.harvard.edu',
    '@mah.harvard.edu',
    '@meei.harvard.edu',
    '@partners.org',
    '@hphc.org',
    '@challiance.org',
}


class ValidEmailSchema(Schema):
    email = fields.String(required=True)

    @validates_schema
    def validate_email(self, in_data):
        email = in_data.get('email', '')

        if not any(email.endswith(domain) for domain in VALID_DOMAINS):
            raise ValidationError(
                'Email must end with harvard.edu or partners.org', 'email'
            )


profile_schema = ProfileSchema()
profiles_schema = ProfileSchema(many=True)
valid_email_schema = ValidEmailSchema()
