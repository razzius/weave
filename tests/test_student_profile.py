from server.models import StudentProfile, save

from .utils import create_test_verification_email


def test_save_student_profile(db_session):
    verification_email = create_test_verification_email(is_faculty=False)

    profile = save(
        StudentProfile(
            name="A Student",
            verification_email=verification_email,
            contact_email="student@student.com",
            cadence="monthly",
        )
    )

    assert profile.id
