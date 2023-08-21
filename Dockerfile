FROM debian:12

RUN apt-get update -y && apt-get install -y \
  build-essential \
  curl \
  git \
  libbz2-dev \
  libffi-dev \
  liblzma-dev \
  libpq-dev \
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
RUN asdf install python 3.11.4
RUN asdf global python 3.11.4

## Build the backend

COPY pyproject.toml poetry.lock /app/

WORKDIR /app

env PATH="$PATH:/root/.asdf/shims"

env PATH=/root/.asdf/installs/python/3.11.4/bin/:$PATH

RUN asdf plugin add poetry
RUN asdf install poetry 1.6.0
RUN asdf global poetry 1.6.0

RUN poetry install

COPY server /app/server
COPY app.py /app/

## Install frontend system dependencies

RUN asdf plugin add nodejs
RUN asdf install nodejs 13.12.0
RUN asdf global nodejs 13.12.0

RUN asdf plugin add yarn
RUN asdf install yarn 1.22.19
RUN asdf global yarn 1.22.19

## Install frontend dependencies

COPY package.json yarn.lock /app/
RUN yarn install --frozen-lockfile

COPY src /app/src
COPY public /app/public

## Build the frontend

WORKDIR /app/src

RUN yarn build

ENV FLASK_ENV 'development'
ENV REACT_APP_SERVER_URL 'http://localhost:5000'

# ENV LANG 'C.UTF-8'
# ENV LC_ALL C.UTF-8
# ENV CLOUDINARY_URL ''

WORKDIR /app

EXPOSE 5000

# CMD ["poetry", "run", "gunicorn", "app", "-b", "0.0.0.0:5000"]
