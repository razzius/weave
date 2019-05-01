# HMS Weave project (working title)

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
$ export DATABASE_URL='postgres:///hms'
$ pipenv run python scripts/resetdb.py
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
# open the frontend in your browser
$ open http://localhost:3000
# how to open the local admin (note that the backend serves the admin as html, rather than the frontend serving it)
$ open http://localhost:5000/admin
```
