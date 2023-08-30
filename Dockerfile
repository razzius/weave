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
RUN asdf install nodejs 20.5.1
RUN asdf global nodejs 20.5.1

RUN asdf plugin add pnpm
RUN asdf install pnpm 8.7.0
RUN asdf global pnpm 8.7.0

## Install frontend dependencies

COPY index.html package.json pnpm-lock.yaml /app/
RUN pnpm install

COPY src /app/src
COPY public /app/public

## Build the frontend

RUN pnpm build

ENV REACT_APP_SERVER_URL 'http://localhost:5000'

# ENV LANG 'C.UTF-8'
# ENV LC_ALL C.UTF-8
# ENV CLOUDINARY_URL ''

EXPOSE 5000

# CMD ["poetry", "run", "gunicorn", "app", "-b", "0.0.0.0:5000"]
