import os

from flask import current_app

from flask_mail import Mail, Message

from .console_email_backend import ConsoleEmailBackend
from .email_backend import EmailBackend
from .sparkpost_email_backend import SparkPostEmailBackend


SERVER_URL = os.environ.get('REACT_APP_SERVER_URL', 'http://localhost:5000')
CLIENT_URL = os.environ.get('WEAVE_CLIENT_URL', SERVER_URL)

SPARKPOST_API_KEY = os.environ.get('SPARKPOST_API_KEY')
MAIL_SERVER = os.environ.get('MAIL_SERVER')


def init_email(app):
    email_backend: EmailBackend

    if MAIL_SERVER is not None:
        mail = Mail(app)
        app.email_backend = mail
    elif SPARKPOST_API_KEY:
        app.email_backend = SparkPostEmailBackend(SPARKPOST_API_KEY)
    else:
        app.logger.warning(
            'Configuring email to log to console because SPARKPOST_API_KEY is not set.'
        )
        app.email_backend = ConsoleEmailBackend()


EMAIL_CLOSING = """
<p>
    Sincerely,
</p>

<p>
    Weave Team
</p>
"""


def get_verification_url(token):
    return f'{CLIENT_URL}/verify?token={token}'


def self_link(href):
    return f'<a href="{href}">{href}</a>'


def send_faculty_registration_email(email, token):
    verify_link = self_link(get_verification_url(token))

    current_app.logger.info('Sending faculty registration verify_link %s', verify_link)

    html = f"""
    <p>Hello,</p>

    <p>
        Welcome to Weave, a mentorship platform to connect students and faculty
        at Harvard Medical School and Harvard School of Dental Medicine. You
        have successfully registered for a faculty mentor profile. The
        following link will direct you to create your profile page:
        {verify_link}. You may return to edit your profile or change your
        availability settings anytime by returning to {CLIENT_URL} and clicking
        “Login” in the top right-hand corner.
    </p>

    <p>
        Thank you for inspiring students through your mentorship service.
    </p>

    {EMAIL_CLOSING}
    """

    message = Message('Weave Mentor Registration', recipients=[email], html=html)

    return current_app.email_backend.send(message)


def send_student_registration_email(email, token):
    verify_link = self_link(get_verification_url(token))

    current_app.logger.info('Sending student registration verify_link %s', verify_link)

    html = f"""
    <p>Hello,</p>

    <p>
        Welcome to Weave, a mentorship platform to connect students and faculty
        at Harvard Medical School and Harvard School of Dental Medicine. You
        have successfully registered for a student mentee profile. The
        following link will direct you to view the database of faculty mentors:
        {verify_link}. You may access this database of mentors anytime by
        returning to {CLIENT_URL} and clicking “Login” in the top right-hand
        corner.
    </p>

    <p>
        We hope that this platform helps foster meaningful conversations and
        mentorship relationships for you!
    </p>

    {EMAIL_CLOSING}
    """

    message = Message('Weave Mentee Registration', recipients=[email], html=html)

    return current_app.email_backend.send(message)


def send_faculty_login_email(email, token):
    verify_link = self_link(get_verification_url(token))

    current_app.logger.info('Sending faculty login verify_link %s', verify_link)

    html = f"""
    <p>Hello,</p>

    <p>
        Welcome back to Weave, a mentorship platform to connect students and
        faculty at Harvard Medical School and Harvard School of Dental
        Medicine. You have previously created a profile; you may return to your
        profile for editing or viewing through this link: {verify_link}.
    </p>

    {EMAIL_CLOSING}
    """

    message = Message('Weave Mentor Login', recipients=[email], html=html)

    return current_app.email_backend.send(message)


def send_student_login_email(email, token):
    verify_link = self_link(get_verification_url(token))

    current_app.logger.info('Sending student login verify_link %s', verify_link)

    html = f"""
    <p>Hello,</p>

    <p>
        Welcome back to Weave, a mentorship platform to connect students and
        faculty at Harvard Medical School and Harvard School of Dental
        Medicine. You may access the faculty mentorship database though this
        link: {verify_link}.
    </p>

    {EMAIL_CLOSING}
    """

    message = Message('Weave Mentee Login', recipients=[email], html=html)

    return current_app.email_backend.send(message)
