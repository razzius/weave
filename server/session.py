import datetime

from dateutil.relativedelta import relativedelta
from flask import current_app


def token_expired(verification_token):
    hours_until_expiry = (
        168 * 2
        if verification_token.is_personal_device
        else current_app.config["TOKEN_EXPIRY_AGE_HOURS"]
    )

    expire_time = verification_token.date_created + relativedelta(
        hours=hours_until_expiry
    )

    if verification_token.expired:
        current_app.logger.info("token %s expired", verification_token.token)

        return True

    current_time = datetime.datetime.utcnow()

    expired = current_time > expire_time

    current_app.logger.info(
        "current time %s versus expire time %s is expired? %s",
        current_time,
        expire_time,
        expired,
    )

    return expired
