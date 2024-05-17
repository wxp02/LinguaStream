from flask import Flask, request, jsonify
from flask_cors import CORS
import youtube_translate as ytTranslate

app = Flask(__name__)
CORS(app, supports_credentials=True)

#create a dictionary of language and country codes
country_codes={
    "English":"en",
    "French":"fr",
    "Chinese": "cn",
}

@app.route('/translate', methods=['POST', 'GET'])
def translate_video():
    if request.is_json:
        req_data = request.get_json()
        print(req_data)
        youtube_link = req_data['youtube_link']
        language = req_data['language']
        langCode = country_codes[language]
        print(langCode)
        #translated_transcript = ytTranslate.translate_transcript(youtube_link, langCode)
        joined_transcript = ytTranslate.join_transcripts(youtube_link, langCode)
        return jsonify({
            'youtube_link': youtube_link,
            'language': language,
        }), 200
    else:
        return jsonify({"error": "Request must be JSON"}), 400

if __name__ == '__main__':
    app.run(debug=True)
