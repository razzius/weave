import os
from flask import Flask


class NoCacheIndexFlask(Flask):
    def get_send_file_max_age(self, name):
        if name.lower().endswith('index.html'):
            return 0
        return 31536000


app = NoCacheIndexFlask(
    __name__, static_url_path='/static', static_folder='../build/static'
)

app.config['SQLALCHEMY_DATABASE_URI'] = os.environ['DATABASE_URL']
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['BASIC_AUTH_USERNAME'] = os.environ.get('BASIC_AUTH_USERNAME')
app.config['BASIC_AUTH_PASSWORD'] = os.environ.get('BASIC_AUTH_PASSWORD')
# app.config['SQLALCHEMY_ECHO'] = app.debug
