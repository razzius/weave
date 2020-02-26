import requests
from requests_toolbelt.utils.dump import dump_all

from .email_backend import EmailBackend


class SparkPostEmailBackend(EmailBackend):
    def __init__(self, api_key):
        self.api_key = api_key

    def send_email(self, to, subject, html) -> str:
        response = requests.post(
            'https://api.sparkpost.com/api/v1/transmissions',
            headers={'Authorization': self.api_key},
            json={
                'content': {
                    'from': 'admin@hmsweave.com',
                    'subject': subject,
                    'html': html,
                },
                'recipients': [{'address': to}],
            },
        )

        email_log = dump_all(response).decode('utf-8')

        return email_log
