import os
from pydub import AudioSegment
from dotenv import load_dotenv
from youtube_transcript_api import YouTubeTranscriptApi
from google.cloud import texttospeech
import json
from pydub.playback import play
import time
from google.api_core.exceptions import RetryError, ServerError
import vertexai
from vertexai.preview.generative_models import GenerativeModel, GenerationConfig, HarmCategory, HarmBlockThreshold, Part
from googleapiclient.discovery import build
import re

# before using this code, make sure to run
# `export GOOGLE_APPLICATION_CREDENTIALS=your_credentials.json`


def extract_video_id(video_id_or_url):
    # a youtube video id is 11 characters long
    # if the video if is longer than 11 characters, then it's a url
    if len(video_id_or_url) > 11:
        # its a url
        # the video id is the last 11 characters
        return video_id_or_url[-11:]
    else:
        # its a video id
        return video_id_or_url

def get_transcript_list(video_url_or_id):
    video_id = extract_video_id(video_url_or_id)
    try:
        # Retrieve the available transcripts
        transcript_list = YouTubeTranscriptApi.list_transcripts(video_id)
        return transcript_list
    except Exception as e:
        print(f"Error: {e}")
        return None

def transcripts_to_json(video_url_or_id):
    transcript_list = get_transcript_list(video_url_or_id)
    if transcript_list is None:
        return None
    
    # Dictionary to hold transcript information
    transcript_dict = {
        "video_id": transcript_list.video_id,
        "transcripts": []
    }

    # Iterate through manually created and generated transcripts
    for transcript in transcript_list:
        transcript_info = {
            "language": transcript.language,
            "language_code": transcript.language_code,
            "is_generated": transcript.is_generated,
            "is_translatable": transcript.is_translatable,
            "translation_languages": [lang['language'] + ' (' + lang['language_code'] + ')' for lang in transcript.translation_languages]
        }
        transcript_dict["transcripts"].append(transcript_info)

    return json.dumps(transcript_dict, indent=4)

def translate_transcript(video_url_or_id, target_language):
    transcript_list = get_transcript_list(video_url_or_id)

    json_transcript = transcripts_to_json(video_url_or_id)
    if json_transcript is None:
        return "No transcripts available."
    
    transcript_dict = json.loads(json_transcript)

    # Get the first available transcript
    first_transcript_lang_code = transcript_dict['transcripts'][0]['language_code']
    first_transcript = transcript_dict['transcripts'][0]

    transcript = transcript_list.find_transcript([first_transcript_lang_code])

    
    # Check if translation is needed
    if first_transcript_lang_code == target_language:
        print("The transcript is already in the target language.")
        return transcript.fetch()
    else:
        if first_transcript["is_translatable"]:
            # Translate the transcript to the target language
            translated_transcript = transcript.translate(target_language)
            return translated_transcript.fetch()
        else:
            return "Translation not available for this transcript."

def join_transcripts(video_url_or_id, target_language):
    translated_transcript = translate_transcript(video_url_or_id, target_language)
    combined_text = ""

    for phrase in translated_transcript:
        combined_text += phrase['text'] + " "
    
    return insert_punctuation(combined_text)

# Access environment variables
project_id = os.getenv('PROJECT_ID')
location = os.getenv('LOCATION')
google_credentials = os.getenv('GOOGLE_APPLICATION_CREDENTIALS')

# Set the GOOGLE_APPLICATION_CREDENTIALS environment variable
os.environ['GOOGLE_APPLICATION_CREDENTIALS'] = google_credentials
# you have to call `export GOOGLE_APPLICATION_CREDENTIALS=your_credentials.json` in the terminal

vertexai.init(project = project_id, location = location)

generation_config = GenerationConfig(
    temperature = 0.1,          # higher = more creative (default 0.0)
    top_p = 0.5,                # higher = more random responses, response drawn from more possible next tokens (default 0.95)
    top_k = 10,                 # higher = more random responses, sample from more possible next tokens (default 40)
    candidate_count = 1,
    max_output_tokens = 1024
)

safety_settings = {
    HarmCategory.HARM_CATEGORY_HARASSMENT: HarmBlockThreshold.BLOCK_LOW_AND_ABOVE,
    HarmCategory.HARM_CATEGORY_HATE_SPEECH: HarmBlockThreshold.BLOCK_LOW_AND_ABOVE,
    HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT: HarmBlockThreshold.BLOCK_LOW_AND_ABOVE,
    HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT: HarmBlockThreshold.BLOCK_LOW_AND_ABOVE,
}

safety_settings = {
    HarmCategory.HARM_CATEGORY_HARASSMENT: HarmBlockThreshold.BLOCK_LOW_AND_ABOVE,
    HarmCategory.HARM_CATEGORY_HATE_SPEECH: HarmBlockThreshold.BLOCK_LOW_AND_ABOVE,
    HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT: HarmBlockThreshold.BLOCK_LOW_AND_ABOVE,
    HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT: HarmBlockThreshold.BLOCK_LOW_AND_ABOVE,
}

def insert_punctuation(text):
    prompt = (f"""
              Given the text: "{text}", 
              I want you to insert the appropriate punctuation marks and capitalization to make it a proper sentence.
              Maintain the language that the text is in.
              """)

    model = GenerativeModel("gemini-1.0-pro-vision")

    prompt_part = Part.from_text(prompt)

    responses = model.generate_content(
        contents = prompt_part,
        generation_config = generation_config,
        safety_settings = safety_settings,
        stream = False
    )

    return responses.text

def produce_title(youtube_url):
    # Assuming GOOGLE_APPLICATION_CREDENTIALS is set
    youtube = build('youtube', 'v3')

    # Extract the video ID from the URL
    video_id_match = re.search(r'v=([^&]+)', youtube_url)
    video_id = video_id_match.group(1) if video_id_match else None

    if not video_id:
        return "Invalid URL or video ID not found."

    # Call the YouTube API to get the video details
    request = youtube.videos().list(part="snippet", id=video_id)
    response = request.execute()

    # Extract the title from the response
    return response['items'][0]['snippet']['title'] if response['items'] else "Video not found."

# if __name__ == "__main__":
#     # english
#     # video_url = "https://www.youtube.com/watch?v=oz9cEqFynHU"

#     # hindi
#     # video_url = "https://www.youtube.com/watch?v=45JmB3PoqfQ"

#     # Dijsktra's algorithm
#     video_url = "https://www.youtube.com/watch?v=_lHSawdgXpI"

#     # different languages: 'en', 'fr', 'fil', 'id', 'ja', 'ms', 'zh-Hans'

#     # transcript_list = get_transcript_list(video_url)
#     # print(transcript_list)

#     translated_transcript = translate_transcript(video_url, 'zh-Hans')
#     print(translated_transcript)

#     joined_transcripts = join_transcripts(video_url, 'zh-Hans')
#     print(joined_transcripts)