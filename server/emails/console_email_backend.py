from .email_backend import EmailBackend
from ..current_time import get_current_time


class ConsoleEmailBackend(EmailBackend):
    def send_email(self, to, subject, html):
        date = get_current_time()

        summary = f"""
        Logging email to Console.
        Date: {date}
        To: {to}
        Subject: {subject}
        HTML:
        {html}
        """
        print(summary)
        return summary
