from flask import Flask, request, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app, supports_credentials=True)

@app.route('/translate', methods=['POST', 'OPTIONS'])
def translate_video():
    if request.is_json:
        req_data = request.get_json()
        youtube_link = req_data['youtube_link']
        language = req_data['language']

        return jsonify({
            'youtube_link': youtube_link,
            'language': language,
        }), 200
    else:
        return jsonify({"error": "Request must be JSON"}), 400

if __name__ == '__main__':
    app.run(debug=True)
