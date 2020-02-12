class EmailBackend:
    def send_email(self, to, subject, html) -> str:
        """
        Send an email and return a text record of the email provider's response.
        """
        raise NotImplementedError
