import datetime

from dateutil.relativedelta import relativedelta
from flask import current_app


def token_expired(verification_token):
    if verification_token.expired:
        current_app.logger.info("token %s expired", verification_token.token)

        return True

    hours_until_expiry = (
        168 * 2
        if verification_token.is_personal_device
        else current_app.config["TOKEN_EXPIRY_AGE_HOURS"]
    )

    expire_time = verification_token.date_created + relativedelta(
        hours=hours_until_expiry
    )

    current_app.logger.info(
        "Token %s date_created %s is_personal_device: %s set to expire %s",
        verification_token.token,
        verification_token.date_created,
        verification_token.is_personal_device,
        expire_time,
    )

    current_time = datetime.datetime.utcnow()

    expired = current_time > expire_time

    current_app.logger.info(
        "current time %s versus expire time %s is expired? %s",
        current_time,
        expire_time,
        expired,
    )

    return expired
