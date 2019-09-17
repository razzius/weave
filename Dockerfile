FROM ubuntu:18.04

RUN apt-get update -y && \
  apt-get install -y python3.6 python-pip python3-dev python3-distutils libpq-dev

COPY Pipfile Pipfile.lock /app/

WORKDIR /app

RUN pip install pipenv

RUN pipenv run python3 --version

RUN pipenv install --ignore-pipfile --deploy

COPY server /app/server
COPY src /app/src
COPY public /app/public
COPY package.json yarn.lock /app/

## Build the frontend
RUN apt-get install -y curl

RUN curl -sL https://deb.nodesource.com/setup_12.x | bash -
RUN apt-get install -y nodejs

RUN curl -sS https://dl.yarnpkg.com/debian/pubkey.gpg | apt-key add -
RUN echo "deb https://dl.yarnpkg.com/debian/ stable main" | tee /etc/apt/sources.list.d/yarn.list
RUN apt-get update
RUN apt-get install -y yarn

WORKDIR /app/src

RUN yarn install --frozen-lockfile
RUN yarn build

ENV LANG 'C.UTF-8'
ENV LC_ALL C.UTF-8

ENV FLASK_DEBUG '1'
ENV REACT_APP_SERVER_URL 'http://localhost:5000'
ENV SENDGRID_API_KEY ''
ENV SECRET_KEY ''
ENV DATABASE_URL ''

# Basic auth username and password are required to enable the admin
# ENV BASIC_AUTH_USERNAME ''
# ENV BASIC_AUTH_PASSWORD ''

WORKDIR /app

EXPOSE 5000

ENTRYPOINT ["pipenv"]

CMD ["run", "gunicorn", "server:app", "-b", "0.0.0.0:5000"]
