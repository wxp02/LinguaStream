from flask import Flask, request, jsonify
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate
from werkzeug.security import generate_password_hash, check_password_hash
from flask_login import UserMixin, login_user, LoginManager, login_required, current_user, logout_user
# import youtube_translate as ytTranslate

app = Flask(__name__)
CORS(app, supports_credentials=True)
app.config['SECRET_KEY'] = "bbbbbbbbbbb"
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///app.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
db = SQLAlchemy(app)
login_manager = LoginManager()
login_manager.init_app(app)


class User(UserMixin, db.Model):
    __tablename__ = "Users"
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(250), nullable=False)
    email = db.Column(db.String(250), unique=True, nullable=False)
    password = db.Column(db.String(250), nullable=False)

class History(db.Model):
    __tablename__ = "History"
    id = db.Column(db.Integer, primary_key=True)
    firebase_link = db.Column(db.String(250), nullable=False)

with app.app_context():
    db.create_all()

@login_manager.user_loader
def load_user(user_id):
    return User.query.get(int(user_id))

@app.route('/login', methods=['POST', 'GET'])
def login():
    if request.is_json:
        req_data = request.get_json()
        user = User.query.filter_by(email=req_data['email']).first()
        if user is None:
            return {'login': 'fail',
                    'message': 'The user does not exist'}
        else:
            if check_password_hash(user.password, req_data['password']):
                login_user(user)
                return {'login': 'pass'}
            else:
                return {'login': 'fail', 
                        'message': 'wrong password'}
    #figure out what else to return when a user is successfully signed up
    return {'login': 'fail', 'message': 'Please enter the necessary login data'}


@app.route('/signup', methods=['POST', 'GET'])
def signup():
    if request.is_json:
        req_data = request.get_json()
        user = User.query.filter_by(email=req_data['email']).first()
        if user:
            return {'signup': 'fail',
                    'message': 'Email for user already exists'}
        else:
            the_user = User(
                email=req_data['email'],
                name=req_data['name'],
                password=generate_password_hash(req_data['password'], "pbkdf2:sha256", 8)
            )
            db.session.add(the_user)
            db.session.commit()
            login_user(the_user)
            return {'signup': 'pass'}
            #figure out what else to return when a user is successfully signed up
    return {'signup': 'fail', 'message': 'Please enter the necessary signup data'}

@app.route('/logout')
@login_required
def logout():
    logout_user()
    return redirect('localhost:3000/')

# Create a dictionary of language and country codes
country_codes={
    "English": "en",
    "French": "fr",
    "Chinese": "cn",
}

@app.route('/translate', methods=['POST', 'GET'])
def translate_video():
    if request.is_json:
        req_data = request.get_json()
        print(req_data)
        youtube_link = req_data['youtube_link']
        language = req_data['language']
        celebrity_voice = req_data['celebrity_voice']
        langCode = country_codes[language]
        print(langCode)
        # translated_transcript = ytTranslate.translate_transcript(youtube_link, langCode)
        # joined_transcript = ytTranslate.join_transcripts(youtube_link, langCode)
        return jsonify({
            'youtube_link': youtube_link,
            'language': language,
            'celebrity_voice': celebrity_voice,
        }), 200
    else:
        return jsonify({"error": "Request must be JSON"}), 400

if __name__ == '__main__':
    app.run(debug=True)
