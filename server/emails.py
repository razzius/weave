import os

import requests


MAILGUN_API_KEY = os.environ['MAILGUN_API_KEY']
MAILGUN_DOMAIN = os.environ.get('MAILGUN_DOMAIN', 'tests')
SERVER_URL = os.environ['REACT_APP_SERVER_URL']


def _send_email(to, subject, html):

    return requests.post(
        f'https://api.mailgun.net/v3/{MAILGUN_DOMAIN}/messages',
        auth=('api', MAILGUN_API_KEY),
        data={
            'subject': subject,
            'to': [to],
            'from': 'HMS Weave <admin@hmsweave.com>',
            'html': html,
        },
    )


EMAIL_CLOSING = """
<p>
    Sincerely,
</p>

<p>
    HMS Weave Team
</p>
"""


def get_verification_url(token):
    return f'{SERVER_URL}/verify?token={token}'


def self_link(href):
    return f'<a href="{href}">{href}</a>'


def send_faculty_registration_email(email, token):
    verify_link = self_link(get_verification_url(token))

    html = f"""
    <p>Hello,</p>

    <p>
        Welcome to Weave, a mentorship platform to connect students and
        faculty at Harvard Medical School. You have successfully registered for a faculty mentor profile.
        The following link will direct you to create your profile page: {verify_link}.
        You may return to edit your profile or change your availability
        settings anytime by returning to HMSWeave.com and clicking “Login” in
        the top right-hand corner.
    </p>

    <p>
        Thank you for inspiring students through your mentorship service.
    </p>

    {EMAIL_CLOSING}
    """

    return _send_email(email, 'HMS Weave Mentor Registration', html)


def send_student_registration_email(email, token):
    verify_link = self_link(get_verification_url(token))

    html = f"""
    <p>Hello,</p>

    <p>
        Welcome to Weave, a mentorship platform to connect students and
        faculty at Harvard Medical School. You have successfully registered for a student mentee profile. The
        following link will direct you to view the database of faculty mentors: {verify_link}.
        You may access this database of mentors anytime by returning to HMSWeave.com
        and clicking “Login” in the top right-hand corner.
    </p>

    <p>
        We hope that this platform helps foster meaningful conversations and mentorship relationships for you!
    </p>

    {EMAIL_CLOSING}
    """

    return _send_email(email, 'HMS Weave Mentee Registration', html)


def send_faculty_login_email(email, token):
    verify_link = self_link(get_verification_url(token))

    html = f"""
    <p>Hello,</p>

    <p>
        Welcome back to Weave, a mentorship platform to connect students
        and faculty at Harvard Medical School. You have previously created a profile; you may return to
        your profile for editing or viewing through this link: {verify_link}.
    </p>

    {EMAIL_CLOSING}
    """

    return _send_email(email, 'HMS Weave Mentor Login', html)


def send_student_login_email(email, token):
    verify_link = self_link(get_verification_url(token))

    html = f"""
    <p>Hello,</p>

    <p>
        Welcome back to Weave, a mentorship platform to connect students
        and faculty at Harvard Medical School. You may access the faculty mentorship database though this
        link: {verify_link}.
    </p>

    {EMAIL_CLOSING}
    """

    return _send_email(email, 'HMS Weave Mentee Login', html)
