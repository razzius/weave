from server import app

app.app_context().push()
from server.models import *
