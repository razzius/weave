from server import app  # noqa: F401

from server.scripts.context import context
from server.models import save  # noqa: F401
from server import models

import inspect

locals().update(dict(inspect.getmembers(models)))


context()
