def paginate(page):
    size = 20

    start = (page - 1) * size

    end = start + size

    return start, end
