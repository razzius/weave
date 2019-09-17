# Weave

## Requirements

- Python 3.6.8
- Node 10.15.3
- Postgresql 11.1
- [pipenv](https://github.com/pypa/pipenv#installation)
- [yarn](https://yarnpkg.com/en/docs/install)

## Installation

```sh
# install frontend
$ yarn
# install backend
$ pipenv install
```

## Create the database

Note that this drops your local database to start from a clean state.

```sh
# You can call your database however you'd like; I use hms
$ createdb hms
$ export DATABASE_URL='postgresql:///hms'
$ pipenv run python -m server.scripts.resetdb
```

## Run the app

```sh
# run backend
$ pipenv run start
# in another shell, start frontend with:
$ npm start
```

## Accessing the app locally

```sh
# Open the frontend in your browser
$ open http://localhost:3000
# Open the local admin (note that the backend serves the admin as html, rather than the frontend serving it)
$ open http://localhost:5000/admin
```

## Running in `docker`

Docker as of now is only supported in development.
The only current production deployment of Weave which is at HMS runs on Heroku.

With that being said, a `Dockerfile` exists, but it only supports debug mode (FLASK_DEBUG set to 1).
As such, it is **not suitable** for production deployments as-is.

Furthermore, the database

```sh
# Build the image
$ docker build . --tag hms-weave-$(git rev-parse @)
Sending build context to Docker daemon  21.03MB
Step 1/28 : FROM ubuntu:18.04
...
Successfully built 2c6aa87fb1cf
# Run the image (replace with image id from above)
# docker run -it -p 5000:5000 2c6aa87fb1c
[2019-09-17 10:28:35 +0000] [1] [INFO] Starting gunicorn 19.9.0
[2019-09-17 10:28:35 +0000] [1] [INFO] Listening at: http://0.0.0.0:5000 (1)
[2019-09-17 10:28:35 +0000] [1] [INFO] Using worker: sync
[2019-09-17 10:28:35 +0000] [15] [INFO] Booting worker with pid: 15
[2019-09-17 10:28:35,478] WARNING in admin: Not configuring admin because BASIC_AUTH_USERNAME and BASIC_AUTH_PASSWORD are not set.
```

At this point you can load the homepage, but the database is not connected.

To connect the database, you'll have to pass in a DATABASE url. Here's a working example
that connects to a postgresql database running on a MacOS localhost.

After starting docker, open http://localhost:5000/admin/verificationtoken/ and enter `local`
as the username and password, and you should see an empty list of verification tokens.

```sh
$ docker run -it -p 5000:5000 \
  -e DATABASE_URL=postgresql://$USER@host.docker.internal:5432/hms \
  -e BASIC_AUTH_USERNAME=local \
  -e BASIC_AUTH_PASSWORD=local \
    (docker build -q .)
```

To build and debug a docker image:

```sh
$ docker run -it --entrypoint /bin/bash $(docker build -q .)
```
