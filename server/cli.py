import click
from flask import Blueprint

from server.emails import get_verification_url
from server.views.api import generate_token

from .models import (
    FacultyProfile, VerificationEmail, VerificationToken, db, save
)
from .queries import get_verification_email_by_email


blueprint = Blueprint("cli", __name__, cli_group=None)


@blueprint.cli.command()
@click.argument("email")
def create_session(email):
    verification_email = get_verification_email_by_email(email)
    if verification_email is None:
        print(f"Email {email} not found.")
        exit(1)

    token = generate_token()
    verification_token = save(
        VerificationToken(
            email=verification_email, token=token, is_personal_device=True
        )
    )

    url = get_verification_url(verification_token)
    print(url)


@blueprint.cli.command()
def reset_db():
    db.drop_all()
    db.create_all()


@blueprint.cli.command()
@click.argument("email")
def create_admin(email):
    save(VerificationEmail(email=email, is_admin=True, is_faculty=True))


@blueprint.cli.command()
def populate():
    CLOUDINARY_PREFIX = (
        "https://res.cloudinary.com/dxzddmun4/image/upload/c_crop,h_200,w_200"
    )

    profiles = [
        FacultyProfile(
            name="Manatee",
            contact_email="mermaidofthesea@gmail.com",
            profile_image_url=f"{CLOUDINARY_PREFIX}/v1528666929/keonolml4mwgsixpprsh.png",
            clinical_specialties=[
                # 'Advanced Heart Failure & Transplant Cardiology',
                # 'Clinical Cardiac Electrophysiology',
                # 'Cardiovascular Disease',
            ],
            affiliations=[],  # 'Forsyth Institute'.split(),
            activities=[],
            cadence="monthly",
        ),
        FacultyProfile(
            name="Falcon!!",
            contact_email="F.alcon@birdsofprey.com",
            profile_image_url=f"{CLOUDINARY_PREFIX}/v1528666737/nbnszojbvgqaxxlv1izh.png",
            clinical_specialties=[],  # 'Endocrinology, Diabetes & Metabolism'.split(','),
            affiliations=[],  # 'Dana-Farber Cancer Institute',
            activities=[],
            additional_information=(
                "I am excited to take students under my wing and"
                " share my love of diabetes outcomes research!"
            ),
            willing_shadowing=True,
            willing_networking=True,
            willing_goal_setting=True,
            willing_discuss_personal=True,
            willing_career_guidance=False,
            cadence="monthly",
        ),
        FacultyProfile(
            name="California Sea Lion",
            contact_email="sea.ze.theday@gmail.com",
            profile_image_url=f"{CLOUDINARY_PREFIX}/v1528667191/aqzz8rwsutgdx4bzpbbn.png",
            clinical_specialties=[],  # 'Pediatric Hematology-Oncology,Pain Medicine'.split(','),
            affiliations=[],  # 'Children’s Hospital Boston',
            activities=[],
            additional_information=(
                "I'm happy to discuss personal aspects,"
                " such as work-life balance, and how my role as a mother"
                " impacts my work in pediatrics."
            ),
            willing_shadowing=True,
            willing_networking=True,
            willing_goal_setting=True,
            willing_discuss_personal=True,
            willing_career_guidance=False,
            cadence="monthly",
        ),
        FacultyProfile(
            name="Cat",
            contact_email="hellokitty@gmail.com",
            profile_image_url=f"{CLOUDINARY_PREFIX}/v1528741344/eo4fleywh2ljmj27i89s.png",
            clinical_specialties=[],  # 'Dermatology,Procedural Dermatology'.split(','),
            affiliations=[],  # 'Brigham and Women’s Hospital',
            activities=[],
            additional_information=(
                "I'm interested in meeting with students who are passionate about the skin!"
            ),
            willing_shadowing=True,
            willing_networking=False,
            willing_goal_setting=True,
            willing_discuss_personal=False,
            willing_career_guidance=False,
            cadence="quarterly",
        ),
        FacultyProfile(
            name="Puppy",
            contact_email="happypuppy@gmail.com",
            profile_image_url=f"{CLOUDINARY_PREFIX}/v1528668241/q8k83ozecn81gjq1qpjp.png",
            clinical_specialties=[],  # ['Addiction Psychiatry', 'Child & Adolescent Psychiatry'],
            affiliations=[],  # 'McLean Hospital',
            activities=[],
            additional_information=(
                "Looking forward to discussing all aspects of life and medicine with students."
            ),
            willing_shadowing=True,
            willing_networking=True,
            willing_goal_setting=True,
            willing_discuss_personal=True,
            willing_career_guidance=False,
            cadence="biweekly",
        ),
    ]

    for index, profile in enumerate(profiles):
        email = VerificationEmail(email=f"animal{index}@gmail.com", is_faculty=True)

        save(email)

        profile.verification_email_id = email.id

        save(profile)

        print(profile.id)
