from flask import Flask, request, jsonify
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate
from werkzeug.security import generate_password_hash, check_password_hash
from flask_login import UserMixin, login_user, LoginManager, login_required, current_user, logout_user
import youtube_translate as ytTranslate
import modified_youtube as modifiedYt

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
        if req_data['email'] == "" or req_data['password'] == "":
            return {'login': 'fail', 'message': 'Please enter the necessary login data.'}
        user = User.query.filter_by(email=req_data['email']).first()
        if user is None:
            return {'login': 'fail',
                    'message': 'There is no account with that email.'}
        else:
            if check_password_hash(user.password, req_data['password']):
                login_user(user)
                return {'login': 'pass'}
            else:
                return {'login': 'fail', 
                        'message': 'Incorrect email address or password.'}
    #figure out what else to return when a user is successfully signed up
    return {'login': 'fail', 'message': 'Please enter the necessary login data.'}


@app.route('/signup', methods=['POST', 'GET'])
def signup():
    if request.is_json:
        req_data = request.get_json()
        if req_data['email'] == "" or req_data['password'] == "" or req_data['name']:
            return {'login': 'fail', 'message': 'Please enter the necessary login data.'}
        user = User.query.filter_by(email=req_data['email']).first()
        if user:
            return {'signup': 'fail',
                    'message': 'Email already exists.'}
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

# @app.route('/logout')
# @login_required
# def logout():
#     logout_user()
#     return redirect('localhost:3000/')

# Create a dictionary of language and country codes
country_codes={
    "English": "en",
    "French": "fr",
    "Chinese": "zh-Hans",
}

celebrity_voices={
    "Obama": 'bark_voices/speaker/obama.mp3',
    "Gordon Ramsay": 'bark_voices/speaker/gordonramsey.mp3'
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

        joined_transcript = ytTranslate.join_transcripts(youtube_link, langCode)

        youtube_title = ytTranslate.produce_title(youtube_link)

        # path_name = 'modify'
        # file_name = youtube_title
        # modifiedYt.modify_youtube_video(youtube_link, path_name, file_name, joined_transcript, langCode)
        # video_path = f'{path_name}/{file_name}_ad.mp4'
        # firebase_url = modifiedYt.upload_video_to_firebase(video_path, file_name)
        # print(f'Uploaded video is available at: {firebase_url}')
        # video_url = firebase_url
        video_url = 'https://storage.googleapis.com/linguastream-trial.appspot.com/english_dijkstra'

        return jsonify({
            'youtube_link': youtube_link,
            'language': language,
            'celebrity_voice': celebrity_voice,
            'youtube_title': youtube_title,
            'translated_transcript': joined_transcript,
            'video_url': video_url
        }), 200
    else:
        return jsonify({"error": "Request must be JSON"}), 400

if __name__ == '__main__':
    app.run(debug=True)
