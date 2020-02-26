import datetime

from .email_backend import EmailBackend


class ConsoleEmailBackend(EmailBackend):
    def send_email(self, to, subject, html):
        date = datetime.datetime.utcnow()

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
