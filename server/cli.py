from typing import Any

import click
from flask import Blueprint

from server.emails import get_verification_url
from server.views.api import generate_token

from .models import VerificationToken, save
from .queries import get_verification_email_by_email


blueprint: Any = Blueprint("cli", __name__, cli_group=None)


@blueprint.cli.command("create-session")
@click.argument("email")
def create_session(email):
    verification_email = get_verification_email_by_email(email)
    if verification_email is None:
        print(f"Email {email} not found.")
        exit(1)

    token = generate_token()
    save(
        VerificationToken(
            email=verification_email, token=token, is_personal_device=True
        )
    )

    url = get_verification_url(token)
    print(url)
