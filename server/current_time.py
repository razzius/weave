import datetime

from datetime import timezone


def get_current_time():
    """
    Returns the current timezone-aware time (unlike
    datetime.datetime.utcnow(), which, despite the name,
    give a naive timezone.)
    """
    return datetime.datetime.now(timezone.utc)
