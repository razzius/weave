# Weave

## Requirements

- Python 3.7.3
- Node 12.10.0
- Postgresql 11.1
- [pipenv](https://github.com/pypa/pipenv#installation) 2018.11.26
- [yarn](https://yarnpkg.com/en/docs/install) 1.22.0

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
# For local development, this can be anything
$ export SECRET_KEY='localsecret'
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

## Building the frontend for production

```sh
$ yarn build
```

Now the frontend can be served as a static file from `build/index.html`.

Though inefficient, the backend will serve this html file when the index is requested.

A more efficient setup would be to serve the index.html from a CDN when any path
is requested on your domain.

## Running in `docker`

Docker as of now is only supported in development.
The only current production deployment of Weave which is at HMS runs on Heroku.

With that being said, a `Dockerfile` exists, but it only supports debug mode (`FLASK_DEBUG` set to 1).
As such, it is **not suitable** for production deployments as-is.

```sh
# Build the image
$ docker build .
Sending build context to Docker daemon  21.03MB
Step 1/28 : FROM ubuntu:18.04
...
Successfully built 2c6aa87fb1cf
# Run the image (replace with image id from above)
$ docker run -it -p 5000:5000 2c6aa87fb1c
[2019-09-17 10:28:35 +0000] [1] [INFO] Starting gunicorn 19.9.0
[2019-09-17 10:28:35 +0000] [1] [INFO] Listening at: http://0.0.0.0:5000 (1)
[2019-09-17 10:28:35 +0000] [1] [INFO] Using worker: sync
[2019-09-17 10:28:35 +0000] [15] [INFO] Booting worker with pid: 15
[2019-09-17 10:28:35,478] WARNING in admin: Not configuring admin because BASIC_AUTH_USERNAME and BASIC_AUTH_PASSWORD are not set.
```

At this point you can load the homepage, but the database is not connected.

To connect the database, you'll have to pass in a DATABASE url. Here's a working example
that connects to a postgresql database running on a MacOS localhost.

```sh
$ docker run -it -p 5000:5000 \
  -e DATABASE_URL=postgresql://$USER@host.docker.internal:5432/hms \
  -e BASIC_AUTH_USERNAME=local \
  -e BASIC_AUTH_PASSWORD=local \
    $(docker build -q .)
```

After starting docker, open http://localhost:5000/admin/verificationtoken/ and enter `local`
as the username and password, and you should see an empty list of verification tokens.


As a useful snippet, here's how to build and debug a docker image:

```sh
$ docker run -it --entrypoint /bin/bash $(docker build -q .)
```
