import datetime
import uuid
from typing import Optional

from server.models import Profile, VerificationEmail, VerificationToken, save


def create_test_verification_email(email: str, is_admin: bool):
    return save(VerificationEmail(email=email, is_admin=is_admin))


def create_test_verification_token(
    token: str, verification_email: VerificationEmail, is_admin: bool
) -> VerificationToken:
    return save(VerificationToken(token=token, email_id=verification_email.id))


def create_test_profile(
    token: Optional[str] = None,
    email: Optional[str] = None,
    name='Test User',
    is_admin=False,
    available_for_mentoring=False,
    date_updated=datetime.date.today(),
) -> Profile:
    if token is None:
        token = str(uuid.uuid4())

    if email is None:
        email = f'{str(uuid.uuid4())}@test.com'

    verification_email = create_test_verification_email(email, is_admin)

    token = create_test_verification_token(
        token, verification_email=verification_email, is_admin=False
    )

    profile = save(
        Profile(
            name=name,
            verification_email_id=verification_email.id,
            contact_email=email,
            available_for_mentoring=available_for_mentoring,
            cadence='monthly',
        )
    )

    return profile
