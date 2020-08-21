import os

from flask import current_app
from structlog import get_logger

from server.models import VerificationToken

from .console_email_backend import ConsoleEmailBackend
from .email_backend import EmailBackend
from .sparkpost_email_backend import SparkPostEmailBackend


log = get_logger()


SERVER_URL = os.environ.get("REACT_APP_SERVER_URL", "http://localhost:5000")
CLIENT_URL = os.environ.get("WEAVE_CLIENT_URL", SERVER_URL)

SPARKPOST_API_KEY = os.environ.get("SPARKPOST_API_KEY")


def init_email(app):
    email_backend: EmailBackend

    if SPARKPOST_API_KEY is None:
        log.warning(
            "Configuring email to log to console because SPARKPOST_API_KEY is not set."
        )
        app.email_backend = ConsoleEmailBackend()
    else:
        app.email_backend = SparkPostEmailBackend(SPARKPOST_API_KEY)


EMAIL_CLOSING = """
<p>
    Sincerely,
</p>

<p>
    Weave Team
</p>
"""


def get_verification_url(token: VerificationToken):
    return f"{CLIENT_URL}/verify?token={token.token}"


def self_link(href):
    return f'<a href="{href}">{href}</a>'


def send_faculty_registration_email(email: str, token: VerificationToken) -> str:
    verify_link = self_link(get_verification_url(token))

    log.info("Sending faculty registration link", token_id=token.id)

    html = f"""
    <p>Hello,</p>

    <p>
        Welcome to Weave, a mentorship platform to connect students
        and faculty at Harvard Medical School and Harvard School of
        Dental Medicine. You have successfully registered for a
        faculty mentor profile. The following link will direct you to
        create your profile page: {verify_link}. You may return to
        edit your profile or change your availability settings anytime
        by returning to {CLIENT_URL} and clicking “Login” in the top
        right-hand corner.
    </p>

    <p>
        Thank you for inspiring students through your mentorship service.
    </p>

    {EMAIL_CLOSING}
    """

    return current_app.email_backend.send_email(
        email, "Weave Faculty Registration", html
    )


def send_student_registration_email(email: str, token: VerificationToken) -> str:
    verify_link = self_link(get_verification_url(token))

    log.info("Sending student registration link", token_id=token.id)

    html = f"""
    <p>Hello,</p>

    <p>
        Welcome to Weave, a mentorship platform to connect students
        and faculty at Harvard Medical School and Harvard School of
        Dental Medicine. You have successfully registered for a
        student profile. The following link will direct you to view
        the database of faculty and student mentors:
        {verify_link}. You may access this database of mentors anytime
        by returning to {CLIENT_URL} and clicking “Login” in the top
        right-hand corner.
    </p>

    <p>
        We hope that this platform helps foster meaningful conversations and
        mentorship relationships for you!
    </p>

    {EMAIL_CLOSING}
    """

    return current_app.email_backend.send_email(
        email, "Weave Student Registration", html
    )


def send_faculty_login_email(email, token):
    verify_link = self_link(get_verification_url(token))

    log.info("Sending faculty login link", token_id=token.id)

    html = f"""
    <p>Hello,</p>

    <p>
        Welcome back to Weave, a mentorship platform to connect
        students and faculty at Harvard Medical School and Harvard
        School of Dental Medicine. You have previously created a
        faculty mentor profile; you may return to your profile for
        editing or viewing through this link: {verify_link}.
    </p>

    {EMAIL_CLOSING}
    """

    return current_app.email_backend.send_email(email, "Weave Faculty Login", html)


def send_student_login_email(email, token):
    verify_link = self_link(get_verification_url(token))

    log.info("Sending student login link", token_id=token.id)

    html = f"""
    <p>Hello,</p>

    <p>
        Welcome back to Weave, a mentorship platform to connect
        students and faculty at Harvard Medical School and Harvard
        School of Dental Medicine. You may access the mentorship
        database though this link: {verify_link}.
    </p>

    {EMAIL_CLOSING}
    """

    return current_app.email_backend.send_email(email, "Weave Student Login", html)
