import uuid
from typing import Optional

from server.models import (
    FacultyProfile,
    StudentProfile,
    VerificationEmail,
    VerificationToken,
    save,
)

from server.current_time import get_current_time


def generate_test_email() -> str:
    return f"{str(uuid.uuid4())}@test.com"


def create_test_verification_email(
    email: Optional[str] = None, is_admin: bool = False, is_faculty: bool = True
) -> VerificationEmail:
    if email is None:
        email = generate_test_email()

    return save(
        VerificationEmail(email=email, is_admin=is_admin, is_faculty=is_faculty)
    )


def create_test_verification_token(
    token: Optional[str] = None,
    verification_email: Optional[VerificationEmail] = None,
    is_admin: bool = False,
    is_faculty: bool = True,
) -> VerificationToken:
    if token is None:
        token = str(uuid.uuid4())

    if verification_email is None:
        verification_email = create_test_verification_email(is_faculty=is_faculty)

    return save(VerificationToken(token=token, email_id=verification_email.id))


def create_test_profile(
    email: Optional[str] = None,
    name="Test User",
    is_admin=False,
    available_for_mentoring=False,
    date_updated=None,
) -> FacultyProfile:
    if email is None:
        email = generate_test_email()

    if date_updated is None:
        date_updated = get_current_time()

    verification_email = create_test_verification_email(email, is_admin)

    profile = save(
        FacultyProfile(
            name=name,
            verification_email_id=verification_email.id,
            contact_email=email,
            available_for_mentoring=available_for_mentoring,
            cadence="monthly",
            additional_information="",
            date_updated=date_updated
        )
    )

    return profile


def create_test_student_profile(
    email: Optional[str] = None,
    name="Test User",
    is_admin=False,
    available_for_mentoring=False,
) -> StudentProfile:
    if email is None:
        email = generate_test_email()

    verification_email = create_test_verification_email(email, is_admin)

    profile = save(
        StudentProfile(
            name=name,
            verification_email_id=verification_email.id,
            contact_email=email,
            available_for_mentoring=available_for_mentoring,
            cadence="monthly",
            additional_information="",
        )
    )

    return profile
