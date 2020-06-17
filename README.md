# Weave

Weave is a mentorship application designed for connecting faculty with medical and dental students.
Currently it is somewhat specific to Harvard Medical School and Harvard School of Dental Medicine,
but it is intended to be configurable to the needs of different medical schools.

## Tech Stack

- Flask powers the API and serves static files
- React powers the web interface

### Requirements

- [Python](https://www.python.org/) [(version)](Pipfile#L7)
- [Node](https://nodejs.org/) [(version)](package.json#L4)
- [Postgresql](https://www.postgresql.org/) [(version)](tests/conftest.py#L11)
- [pipenv](https://github.com/pypa/pipenv#installation) [(version)](Pipfile#L8)
- [yarn](https://yarnpkg.com/en/docs/install) [(version)](package.json#L5)

### Developing with `vagrant`

A `Vagrantfile` is provided which allows developing in the same
Ubuntu 18.04 environment that is supported in production.
Here are the officially-supported Vagrant and VirtualBox versions:

```sh
$ vagrant --version
Vagrant 2.2.7
$ VBoxManage -version
6.1.2r135662
# Optionally add vagrant-hostsupdater using:
$ vagrant plugin install vagrant-hostsupdater
# This will allow accessing the virtual machine at http://weave.local.
$ vagrant plugin list
vagrant-hostsupdater (1.1.1.160, global)
```

Running `vagrant up` will install the dependencies and create a database,
and print out the instructions to start the development servers:

```sh
$ vagrant ssh -c "/vagrant/server/scripts/servers.sh"
```

Once the backend outputs:

```
* Running on http://0.0.0.0:5000/ (Press CTRL+C to quit)
```

And the frontend outputs:

```
Starting the development server...

Compiled successfully!

You can now view weave-mentorship in the browser.
```

You can access http://weave.local if you are using the vagrant-hostsupdater plugin,
and http://192.168.50.4 otherwise.

## Manual Development Setup

The following commands are run automatically when provisioning Vagrant for the first time,
and can be rerun via `vagrant provision`. Nonetheless, you may need to re-run or modify a setup command
if you are not using Vagrant or if you are making changes such as installing new Python or Node packages.

### Installing the frontend requirements

```sh
$ yarn install
```

### Install the backend requirements

```sh
$ pipenv install --dev --ignore-pipfile
```

### Create the database

Note that this drops your local database to start from a clean state.

```sh
# You can call your database however you'd like; I use "weave"
$ createdb weave
# If you use a different database, change the DATABASE_URL accordingly.
# The following is the default DATABASE_URL (see server/app.py).
$ export DATABASE_URL='postgresql:///weave'
# Whatever database is at DATABASE_URL will be cleared by the following command, so be careful!
$ pipenv run python -m server.scripts.resetdb
```

### Running Python test

```sh

pipenv run test
#Run a command in virtual Environment without
#keyword pip and virtualenv



### Run the app in development mode

In development mode, there is both a `python` process to serve the API and a `node` server process to serve the frontend.
Both are configured to automatically reload.

```sh
# Run backend
$ pipenv run start
# In another shell, start frontend with:
$ yarn start
```

### Accessing the app locally

If you are running the application outside of a virtual machine, or if the
virtual machine has a graphical user interface, you may access the application
directly at http://localhost:3000.

The admin is served by the server, rather than the frontend, so it is accessible at http://localhost:5000/admin.
It is protected by http basic auth using the environment variables `BASIC_AUTH_USERNAME`,
`BASIC_AUTH_PASSWORD`, and `SECRET_KEY`. The username and password are used to sign in and the secret key is used
as a persistent key to sign sessions.

```sh
# The following secrets can be set to anything locally. Use secret values in production.
$ export BASIC_AUTH_USERNAME='username'
$ export BASIC_AUTH_PASSWORD='password'
$ export SECRET_KEY='secret'
# Open the local admin
$ open http://localhost:5000/admin
```

### Creating a user session for any domain

If, in development, you do not have an account on an authorized domain, you can use the `create-session` script to create a login link for yourself. Usage:

```sh
$ pipenv run flask create-session you@domain.com
Loading .env environment variables…
http://weave.localhost:3000/verify?token=...
```

This only works if the email is already registered. To create an account for yourself, manually add a Verification Email in the admin.

### Building the frontend for production

```sh
$ yarn build
```

Now the frontend can be served as a static file from `build/index.html`.

Though inefficient, the backend will serve this html file when the index is requested.

A more efficient setup would be to serve the index.html from a CDN when any path
is requested on your domain.

### Running the backend in production

Gunicorn is the production application server. The usual configuration is to use nginx or another reverse proxy
to terminate ssl and forward requests from port 443 to port 5000.

```sh
$ pipenv run shell
$ gunicorn server:app -b 0.0.0.0:5000
```

### Running in `docker`

Docker as of now is only supported in development.
The only current production deployment of Weave which is at HMS runs on Heroku.

With that being said, a `Dockerfile` exists, but it only supports debug mode (`FLASK_ENV` set to `development`).
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

To connect the database, you'll have to pass in a `DATABASE_URL`. Here's a
working example that connects to a postgresql database running on a MacOS
localhost and enables the admin with `local` as username and password.

```sh
$ docker run -it -p 5000:5000 \
  -e DATABASE_URL=postgresql://$USER@host.docker.internal:5432/hms \
  -e BASIC_AUTH_USERNAME=local \
  -e BASIC_AUTH_PASSWORD=local \
    $(docker build -q .)
```

After starting docker, open http://localhost:5000/admin/verificationtoken/, enter `local`
as the username and password, and you should see an empty list of verification tokens.

As a useful snippet, here's how to build a docker image and debug with `bash`:

```sh
$ docker run -it --entrypoint /bin/bash $(docker build -q .)
```

## Security

Please do not submit issues or pull requests for security issues. Instead, email the maintainer at razzi@abuissa.net.
