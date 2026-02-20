#!/bin/sh
set -e

sudo apt-get update

sudo apt-get install -y \
  build-essential \
  curl \
  git \
  gpg \
  libbz2-dev \
  libffi-dev \
  liblzma-dev \
  libpq-dev \
  libreadline-dev \
  libsqlite3-dev \
  libssl-dev \
  zlib1g-dev \
  postgresql

install_asdf() {
  test -d ~/.asdf || git clone --depth 1 https://github.com/asdf-vm/asdf.git ~/.asdf
  grep -q asdf.sh "$HOME/.bashrc" || echo "source $HOME/.asdf/asdf.sh" >> "$HOME/.bashrc"
  export PATH="$PATH:/$HOME/.asdf/bin"
}

install_asdf_plugins() {
  for tool in $(cut -d ' ' -f 1 .tool-versions); do
    asdf plugin add "$tool"
  done
}

install_asdf

cd /vagrant

install_asdf_plugins

asdf install

ASDF_INSTALLS="$HOME/.asdf/installs"
export PATH="$ASDF_INSTALLS/python/3.14.3/bin:$PATH"
export PATH="$ASDF_INSTALLS/poetry/2.3.2/bin:$PATH"
export PATH="$ASDF_INSTALLS/nodejs/16.20.2/bin:$PATH"
export PATH="$ASDF_INSTALLS/yarn/1.22.19/bin:$PATH"

poetry install --no-root

yarn install --frozen-lockfile
yarn build

sudo su postgres -c 'createuser vagrant -s' || true

sudo su vagrant -c 'createdb weave' || true

poetry run flask reset-db
