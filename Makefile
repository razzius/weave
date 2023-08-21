.PHONY: run

all:
	podman build .

run:
	export IMAGE_ID=$(shell podman images --format "{{.ID}} {{.CreatedAt}}" | sort -rk 2 | head -1 | cut -d ' ' -f 1); \
	docker run -i -t -p 5000:5000 $$IMAGE_ID poetry run gunicorn app -b :5000
