from http import HTTPStatus

from server.models import ProfileStar, save

from .utils import create_test_profile, create_test_verification_token


def test_get_profile(client, auth, db_session):
    verification_token = create_test_verification_token()

    profile = create_test_profile(available_for_mentoring=True)

    auth.login(verification_token.token)

    response = client.get(f"/api/profiles/{profile.id}")

    assert response.status_code == HTTPStatus.OK.value

    assert not response.json["starred"]


def test_get_unavailable_profile(client, auth, db_session):
    verification_token = create_test_verification_token()

    profile = create_test_profile(available_for_mentoring=False)

    auth.login(verification_token.token)

    response = client.get(f"/api/profiles/{profile.id}")

    assert response.status_code == HTTPStatus.NOT_FOUND.value


def test_get_starred_profile(client, auth, db_session):
    verification_token = create_test_verification_token()

    profile = create_test_profile(available_for_mentoring=True)

    # Do queries here so that they don't add to the count later
    profile_id = profile.id

    auth.login(verification_token.token)

    save(
        ProfileStar(
            from_verification_email_id=verification_token.email_id,
            to_verification_email_id=profile.verification_email_id,
        )
    )

    # from sqlalchemy import event

    # qs = []

    # def count_queries(*args):
    #     # __import__('pdb').set_trace()
    #     print('--------------------q')
    #     print(str(args[1]))
    #     print('--------------------end.\n\n ')
    #     nonlocal qs
    #     # __import__('pdb').set_trace()
    #     qs.append(args[1])

    # event.listen(db.engine, 'after_execute', count_queries)

    response = client.get(f"/api/profiles/{profile_id}")

    assert response.status_code == HTTPStatus.OK.value

    assert response.json["starred"]

    # __import__('pdb').set_trace()
    # assert len(qs) == 1


def test_get_profile_starred_by_other_user(client, auth, db_session):
    verification_token = create_test_verification_token()

    other_verification_token = create_test_verification_token()

    profile = create_test_profile(available_for_mentoring=True)

    save(
        ProfileStar(
            from_verification_email_id=other_verification_token.email_id,
            to_verification_email_id=profile.verification_email_id,
        )
    )

    auth.login(verification_token.token)

    response = client.get(f"/api/profiles/{profile.id}")

    assert response.status_code == HTTPStatus.OK.value

    assert not response.json["starred"]
