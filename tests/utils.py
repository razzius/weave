import datetime
import uuid
from typing import Optional

from server.models import FacultyProfile, VerificationEmail, VerificationToken, save


def generate_test_email() -> str:
    return f"{str(uuid.uuid4())}@test.com"


def create_test_verification_email(
    email: Optional[str] = None, is_admin: bool = False, is_mentor: bool = True
) -> VerificationEmail:
    if email is None:
        email = generate_test_email()

    return save(VerificationEmail(email=email, is_admin=is_admin, is_mentor=is_mentor))


def create_test_verification_token(
    token: Optional[str] = None,
    verification_email: Optional[VerificationEmail] = None,
    is_admin: bool = False,
    is_mentor: bool = True,
) -> VerificationToken:
    if token is None:
        token = str(uuid.uuid4())

    if verification_email is None:
        verification_email = create_test_verification_email(is_mentor=is_mentor)

    return save(VerificationToken(token=token, email_id=verification_email.id))


def create_test_profile(
    token: Optional[str] = None,
    email: Optional[str] = None,
    name="Test User",
    is_admin=False,
    available_for_mentoring=False,
    date_updated=datetime.date.today(),
) -> FacultyProfile:
    if token is None:
        token = str(uuid.uuid4())

    if email is None:
        email = generate_test_email()

    verification_email = create_test_verification_email(email, is_admin)

    token = create_test_verification_token(
        token, verification_email=verification_email, is_admin=False
    )

    profile = save(
        FacultyProfile(
            name=name,
            verification_email_id=verification_email.id,
            contact_email=email,
            available_for_mentoring=available_for_mentoring,
            date_updated=date_updated,
            cadence="monthly",
        )
    )

    return profile
