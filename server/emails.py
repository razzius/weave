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
            'html': html
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


def send_faculty_registration_email(email, token):
    verify_url = get_verification_url(token)

    html = f"""
    <p>Hello,</p>

    <p>
        Welcome to HMS Weave, a mentorship platform to connect students and
        faculty. You have successfully registered for a faculty mentor profile.
        The following link will direct you to create your profile page: {verify_url}.
        You may return to edit your profile or change your availability
        settings anytime through this link.
    </p>

    <p>
        Thank you for inspiring students through your mentorship service.
    </p>

    {EMAIL_CLOSING}
    """

    return _send_email(email, 'HMS Weave Mentor Registration', html)


def send_student_registration_email(email, token):
    verify_url = get_verification_url(token)

    html = f"""
    <p>Hello,</p>

    <p>
        Welcome to HMS Weave, a mentorship platform to connect students and
        faculty. You have successfully registered for a student mentee profile.
        The following link will direct you to view the database of faculty
        mentors: {verify_url}. You may access this database of mentors anytime
        through this link.
    </p>

    <p>
        We hope that this platform helps foster meaningful conversations and mentorship relationships for you!
    </p>

    {EMAIL_CLOSING}
    """

    return _send_email(email, 'HMS Weave Mentee Registration', html)
