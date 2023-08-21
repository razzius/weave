from dateutil.relativedelta import relativedelta

from flask import current_app

from structlog import get_logger

from .current_time import get_current_time


logger = get_logger()


def token_expired(verification_token):
    log = logger.bind(
        email=verification_token.email.email, token_id=verification_token.id,
    )

    if verification_token.logged_out:
        log.info("Token logged_out")

        return True

    hours_until_expiry = (
        168 * 2
        if verification_token.is_personal_device
        else current_app.config["TOKEN_EXPIRY_AGE_HOURS"]
    )

    expire_time = verification_token.date_created + relativedelta(
        hours=hours_until_expiry
    )

    current_time = get_current_time()

    expired = current_time > expire_time

    log.info(
        "Token expired?",
        date_created=verification_token.date_created.isoformat(),
        current_time=current_time.isoformat(),
        is_personal_device=verification_token.is_personal_device,
        expire_time=expire_time.isoformat(),
        expired=expired,
    )

    return expired
