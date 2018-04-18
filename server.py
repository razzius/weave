from flask import Flask, url_for, request, redirect, jsonify


app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:////tmp/test.db'
db = SQLAlchemy(app)


class Profile(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(255), nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)

    date_created = db.Column(db.DateTime, nullable=False, default=datetime.utcnow)
    date_updated = db.Column(db.DateTime, nullable=False, default=datetime.utcnow)

    def __repr__(self):
        return f'<Profile id={self.id} name={self.name}>'


class ProfileInterest(db.Model):
    interest = db.Column(db.String(120))

    clinical = db.Column(db.Boolean)

    profile_id = db.Column(db.Integer, db.ForeignKey('category.id'), nullable=False)
    profile = db.relationship('Profile', backref=db.backref('posts', lazy=True))


@app.route('/api/profiles')
def get_profiles():
    return jsonify([
        {
            'id': 1,
            'name': 'Razzi Abuissa',
            'email': 'rabuissa@sas.upenn.edu',
            'affiliations': ['PennMed'],
            'interests': ['yoga', 'software'],
            'clinicalInterests': [],
            'levelOfInvolvement': ['low'],
            'meetingFrequency': ['monthly']
        },
        {
            'id': 2,
            'name': 'Jon Kusner',
            'email': 'jon.kusner8@harvard.edu',
            'affiliations': ['Boston Hospital'],
            'clinicalInterests': ['Cardiology'],
            'interests': ['archery', 'pottery'],
            'levelOfInvolvement': ['high'],
            'meetingFrequency': ['weekly']
        },
        {
            'id': 3,
            'name': 'Jane',
            'email': 'jane.swimmer@harvard.edu',
            'affiliations': ['Mercy Hospital'],
            'interests': ['mentorship', 'swimming'],
            'clinicalInterests': [],
            'levelOfInvolvement': ['high'],
            'meetingFrequency': ['weekly']
        }
    ])


@app.route('/api/profile/<profile_id>')
def get_profile(profile_id=None):
    return {}


@app.route('/api/profile/<profile_id>', methods=['POST'])
def create_profile(profile_id=None):
    profile = Profile({})
    db.session.add(profile)
    db.session.commit()

    return jsonify(serialize_profile(profile))


@app.route('/api/profile/<profile_id>', methods=['POST'])
def update_profile(profile_id=None):
    profile = Profile({})
    db.session.add(profile)
    db.session.commit()

    return jsonify(serialize_profile(profile))
