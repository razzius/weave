import os
import requests

MAILGUN_DOMAIN = os.environ['MAILGUN_DOMAIN']
MAILGUN_API_KEY = os.environ['MAILGUN_API_KEY']
SERVER_URL = os.environ['REACT_APP_SERVER_URL']


def send_confirmation_token(email, token):
    verify_url = f'https://{SERVER_URL}/verify?token={token}'

    return requests.post(
        f'https://api.mailgun.net/v3/{MAILGUN_DOMAIN}/messages',
        auth=('api', MAILGUN_API_KEY),
        data={
            'from': 'HMS Advise Admin <razzi@abuissa.net>',
            'to': [email],
            'subject': 'HMS Advise verification token',
            'text': token,
            'html': f"""
            <p>Hi,</p>

            <p>
              Your verification token is {token}.
            </p>

            <p>
              Follow the link here to verify your email: <a href="{verify_url}">{verify_url}</a>.
            </p>

            <p>
              Regards,
            </p>

            <p>
              HMS Advise Team
            </p>
            """
        },
    )
