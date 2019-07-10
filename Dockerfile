from ubuntu:18.04

run apt-get update -y && \
  apt-get install -y python3.6 python-pip python3-dev python3-distutils libpq-dev

copy Pipfile.lock /app/Pipfile.lock
copy Pipfile /app/Pipfile

workdir /app

run pip install pipenv

run pipenv run python3 --version

run pipenv install --ignore-pipfile --deploy

# This is due to the fact that outside of docker, the valid_domains.json is in ../src
COPY server /app/server
COPY src/valid_domains.json /app/src/valid_domains.json

ENV LANG 'C.UTF-8'
ENV LC_ALL C.UTF-8

ENV FLASK_APP 'server'
ENV REACT_APP_SERVER_URL 'http://localhost:5000'
ENV SENDGRID_API_KEY ''
ENV SECRET_KEY ''
ENV DATABASE_URL ''
ENV BASIC_AUTH_USERNAME ''
ENV BASIC_AUTH_PASSWORD ''

entrypoint ["pipenv"]

cmd ["run", "gunicorn", "server:app", "-b", "0.0.0.0:5000"]
