import os

from flask import current_app
import requests


# MAILGUN_API_KEY = os.environ['MAILGUN_API_KEY']
# MAILGUN_DOMAIN = os.environ.get('MAILGUN_DOMAIN', 'tests')
SERVER_URL = os.environ['REACT_APP_SERVER_URL']
SENDGRID_API_KEY = os.environ['SENDGRID_API_KEY']


# curl --request POST \
#   --url https://api.sendgrid.com/v3/mail/send \
#   --header "Authorization: Bearer $SENDGRID_API_KEY" \
#   --header 'Content-Type: application/json' \
#   --data '{"personalizations": [{"to": [{"email": "razzi53@gmail.com"}]}],"from": {"email": "admin@hmsweave.com"},"subject": "Sending with SendGrid is Fun","content": [{"type": "text/plain", "value": "and easy to do anywhere, even with cURL"}]}'
def _send_email(to, subject, html):

    return requests.post(
        'https://api.sendgrid.com/v3/mail/send',
        headers={
            'Authorization': f'Bearer {SENDGRID_API_KEY}'
        },
        json={
            'personalizations': [
                {'to': [{'email': to}]},
            ],
            'from': {'email': 'admin@hmsweave.com'},
            'subject': subject,
            'content': [{'type': 'text/html', 'value': html}],
        },
    )


EMAIL_CLOSING = """
<p>
    Sincerely,
</p>

<p>
    Weave Team
</p>
"""


def get_verification_url(token):
    return f'{SERVER_URL}/verify?token={token}'


def self_link(href):
    return f'<a href="{href}">{href}</a>'


def send_faculty_registration_email(email, token):
    verify_link = self_link(get_verification_url(token))

    current_app.logger.info('Sending faculty registration verify_link %s', verify_link)

    html = f"""
    <p>Hello,</p>

    <p>
        Welcome to Weave, a mentorship platform to connect students and
        faculty at Harvard Medical School. You have successfully registered for a faculty mentor profile.
        The following link will direct you to create your profile page: {verify_link}.
        You may return to edit your profile or change your availability
        settings anytime by returning to {SERVER_URL} and clicking “Login” in
        the top right-hand corner.
    </p>

    <p>
        Thank you for inspiring students through your mentorship service.
    </p>

    {EMAIL_CLOSING}
    """

    return _send_email(email, 'Weave Mentor Registration', html)


def send_student_registration_email(email, token):
    verify_link = self_link(get_verification_url(token))

    current_app.logger.info('Sending student registration verify_link %s', verify_link)

    html = f"""
    <p>Hello,</p>

    <p>
        Welcome to Weave, a mentorship platform to connect students and
        faculty at Harvard Medical School. You have successfully registered for a student mentee profile. The
        following link will direct you to view the database of faculty mentors: {verify_link}.
        You may access this database of mentors anytime by returning to {SERVER_URL}
        and clicking “Login” in the top right-hand corner.
    </p>

    <p>
        We hope that this platform helps foster meaningful conversations and mentorship relationships for you!
    </p>

    {EMAIL_CLOSING}
    """

    return _send_email(email, 'Weave Mentee Registration', html)


def send_faculty_login_email(email, token):
    verify_link = self_link(get_verification_url(token))

    current_app.logger.info('Sending faculty login verify_link %s', verify_link)

    html = f"""
    <p>Hello,</p>

    <p>
        Welcome back to Weave, a mentorship platform to connect students
        and faculty at Harvard Medical School. You have previously created a profile; you may return to
        your profile for editing or viewing through this link: {verify_link}.
    </p>

    {EMAIL_CLOSING}
    """

    return _send_email(email, 'Weave Mentor Login', html)


def send_student_login_email(email, token):
    verify_link = self_link(get_verification_url(token))

    current_app.logger.info('Sending student login verify_link %s', verify_link)

    html = f"""
    <p>Hello,</p>

    <p>
        Welcome back to Weave, a mentorship platform to connect students
        and faculty at Harvard Medical School. You may access the faculty mentorship database though this
        link: {verify_link}.
    </p>

    {EMAIL_CLOSING}
    """

    return _send_email(email, 'Weave Mentee Login', html)
