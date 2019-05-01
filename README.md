# HMS Weave project (working title)

## Requirements

- Python 3.6.8
- Node 10.15.3
- [pipenv](https://github.com/pypa/pipenv#installation)
- [yarn](https://yarnpkg.com/en/docs/install)

## Installation

```sh
# install frontend
$ yarn
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
