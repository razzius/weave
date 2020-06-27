from http import HTTPStatus

from flask import jsonify

from .blueprint import api

# This is a non-standard http status, used by Microsoft's IIS, but it's useful
# to disambiguate between unrecognized and expired tokens.
LOGIN_TIMEOUT_STATUS = 440


class UserError(Exception):
    status_code = HTTPStatus.BAD_REQUEST.value

    def __init__(self, invalid_data, status_code=None):
        self.invalid_data = invalid_data

        if status_code is not None:
            self.status_code = status_code


class UnauthorizedError(UserError):
    status_code = HTTPStatus.UNAUTHORIZED.value


class ForbiddenError(UserError):
    status_code = HTTPStatus.FORBIDDEN.value


class InvalidPayloadError(UserError):
    status_code = HTTPStatus.UNPROCESSABLE_ENTITY.value


class LoginTimeoutError(UserError):
    status_code = LOGIN_TIMEOUT_STATUS


@api.errorhandler(UserError)
def handle_user_error(e):
    invalid_data = e.invalid_data
    status_code = e.status_code
    return jsonify(invalid_data), status_code
