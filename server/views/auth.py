from flask import Blueprint


auth = Blueprint('auth', __name__)


@auth.route('/_saml')
def saml():
    return 'saml!'
