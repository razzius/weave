FROM debian:12

RUN apt-get update -y && apt-get install -y \
  build-essential \
  curl \
  git \
  libbz2-dev \
  libffi-dev \
  liblzma-dev \
  libreadline-dev \
  libsqlite3-dev \
  libssl-dev \
  zlib1g-dev

RUN git clone --depth 1 https://github.com/asdf-vm/asdf.git ~/.asdf
RUN echo "source $HOME/.asdf/asdf.sh" >> /root/.bashrc
ENV PATH="$PATH:/root/.asdf/bin"

WORKDIR /root

## Install backend system dependencies

RUN asdf plugin add python
RUN asdf install python 3.7.6
RUN asdf global python 3.7.6

## Build the backend

COPY Pipfile Pipfile.lock /app/

WORKDIR /app

env PATH="$PATH:/root/.asdf/shims"

RUN python3 -m pip install pipenv

env PATH=/root/.asdf/installs/python/3.7.6/bin/:$PATH

RUN pipenv install --ignore-pipfile --deploy

COPY server /app/server

## Build the frontend

RUN asdf plugin add nodejs
RUN asdf install nodejs 13.12.0
RUN asdf global nodejs 13.12.0

RUN asdf plugin add yarn
RUN asdf install yarn 1.22.4
RUN asdf global yarn 1.22.4

COPY src /app/src
COPY public /app/public
COPY package.json yarn.lock /app/

WORKDIR /app/src

RUN yarn install --frozen-lockfile
RUN yarn build

ENV FLASK_ENV 'development'
ENV REACT_APP_SERVER_URL 'http://localhost:5000'

# ENV LANG 'C.UTF-8'
# ENV LC_ALL C.UTF-8
# ENV CLOUDINARY_URL ''

WORKDIR /app

EXPOSE 5000

# ENTRYPOINT [ "pipenv" ]

# CMD ["run", "gunicorn", "server:app", "-b", "0.0.0.0:5000"]
