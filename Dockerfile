FROM ubuntu:18.04

RUN apt-get update -y
RUN apt-get install -y python-minimal python3.6 python3-distutils python-pip curl

RUN curl -sL https://deb.nodesource.com/node_12.x/pool/main/n/nodejs/nodejs_12.10.0-1nodesource1_amd64.deb -o node.deb
RUN dpkg -i node.deb

RUN curl -sL https://github.com/yarnpkg/yarn/releases/download/v1.17.3/yarn_1.17.3_all.deb -o yarn.deb
RUN dpkg -i yarn.deb

## Build the backend

COPY Pipfile Pipfile.lock /app/

WORKDIR /app

RUN pip install pipenv
RUN pipenv install --ignore-pipfile --deploy

COPY server /app/server

## Build the frontend

COPY src /app/src
COPY public /app/public
COPY package.json yarn.lock /app/

WORKDIR /app/src

RUN yarn install --frozen-lockfile
RUN yarn build

ENV LANG 'C.UTF-8'
ENV LC_ALL C.UTF-8

ENV FLASK_DEBUG '1'
ENV REACT_APP_SERVER_URL 'http://localhost:5000'
ENV CLOUDINARY_URL ''
ENV SENDGRID_API_KEY ''
ENV SECRET_KEY ''

WORKDIR /app

EXPOSE 5000

ENTRYPOINT ["pipenv"]

CMD ["run", "gunicorn", "server:app", "-b", "0.0.0.0:5000"]
