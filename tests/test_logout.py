import http

from .utils import create_test_verification_token
from .conftest import AuthActions


def test_logout(client, auth: AuthActions, db_session):
    verification_token = create_test_verification_token()

    auth.login(verification_token.token)

    response = client.post("/api/logout")

    assert response.status_code == http.HTTPStatus.OK.value

    assert verification_token.logged_out
