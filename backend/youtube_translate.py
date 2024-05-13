import os
from pydub import AudioSegment
from youtube_transcript_api import YouTubeTranscriptApi
from google.cloud import translate_v2
from google.cloud import texttospeech
import json

# before using this code, make sure to run
# `export GOOGLE_APPLICATION_CREDENTIALS=your_credentials.json`

# Access environment variables
project_id = os.getenv('PROJECT_ID')
location = os.getenv('LOCATION')
google_credentials = os.getenv('GOOGLE_APPLICATION_CREDENTIALS')

# Set the GOOGLE_APPLICATION_CREDENTIALS environment variable
os.environ['GOOGLE_APPLICATION_CREDENTIALS'] = google_credentials


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

    return combined_text

def clear_directory(directory):
    """
    Removes all files from the specified directory.
    """
    for filename in os.listdir(directory):
        file_path = os.path.join(directory, filename)
        try:
            if os.path.isfile(file_path) or os.path.islink(file_path):
                os.unlink(file_path)
            elif os.path.isdir(file_path):
                shutil.rmtree(file_path)
        except Exception as e:
            print(f'Failed to delete {file_path}. Reason: {e}')

def text_to_speech(transcript, target_language, gender = "NEUTRAL", chunk_size=4500):
    """
    Generate audio files from the given text using Text-to-Speech API.
    Audio files are stored in a directory named 'mp3'.
    
    Args:
    - transcript (str): The text to convert to speech.
    - target_language (str): Language code for the target language (e.g., 'fr' for French, 'es' for Spanish).
    - chunk_size (int): Maximum number of characters per chunk.
    """
    directory = "mp3"
    if not os.path.exists(directory):
        os.makedirs(directory)
    else:
        clear_directory(directory)

    client = texttospeech.TextToSpeechClient()
    chunks = []

    # Ensure that chunks do not exceed the byte limit
    while len(transcript.encode('utf-8')) > chunk_size:
        part = transcript[:chunk_size]
        while len(part.encode('utf-8')) > chunk_size:
            part = part[:-1]
        chunks.append(part)
        transcript = transcript[len(part):]
    if transcript:
        chunks.append(transcript)

    for i, chunk in enumerate(chunks):
        synthesis_input = texttospeech.SynthesisInput(text=chunk)
        output_file = f"{directory}/audio_{i}.mp3"
        
        if gender == "MALE":
            voice = texttospeech.VoiceSelectionParams(
                language_code=target_language,
                ssml_gender=texttospeech.SsmlVoiceGender.MALE
            )
        elif gender == "FEMALE":
            voice = texttospeech.VoiceSelectionParams(
                language_code=target_language,
                ssml_gender=texttospeech.SsmlVoiceGender.FEMALE
            )
        else:
            voice = texttospeech.VoiceSelectionParams(
                language_code=target_language,
                ssml_gender=texttospeech.SsmlVoiceGender.NEUTRAL
            )
        
        audio_config = texttospeech.AudioConfig(
            audio_encoding=texttospeech.AudioEncoding.MP3
        )

        response = client.synthesize_speech(
            input=synthesis_input, voice=voice, audio_config=audio_config
        )

        with open(output_file, "wb") as out:
            out.write(response.audio_content)
            print(f'Audio content written to file {output_file}')


def merge_audio_files(output_filename):
    """
    Merge all MP3 files in the 'mp3' directory into a single MP3 file.

    Args:
    - output_filename (str): Filename for the merged output file.
    """
    directory = "mp3"
    files = [f for f in os.listdir(directory) if f.endswith('.mp3')]
    files.sort()  # Sort files to maintain order

    # Load the first file
    merged = AudioSegment.from_mp3(os.path.join(directory, files[0]))

    # Concatenate the rest of the files
    for file in files[1:]:
        current_audio = AudioSegment.from_mp3(os.path.join(directory, file))
        merged += current_audio

    # Export the result
    merged.export(os.path.join(directory, output_filename), format="mp3")
    print(f'Merged audio has been saved to {os.path.join(directory, output_filename)}')

def change_speed(audio_segment, target_duration):
    """
    Change the playback speed of an audio segment to match the target duration.
    
    Args:
    - audio_segment (AudioSegment): The audio segment to modify.
    - target_duration (int): The target duration in milliseconds.
    
    Returns:
    - AudioSegment: The modified audio segment with the new duration.
    """
    current_duration = len(audio_segment)
    if current_duration == 0:
        return audio_segment
    speed_ratio = target_duration / current_duration
    return audio_segment.speedup(playback_speed=speed_ratio)

def text_to_speech_and_align(translated_transcript, target_language, output_file):
    """
    Generate speech for each entry in the translated transcript, adjust the speed if the duration
    is not as desired, align according to the start time, and merge into a single audio file.
    
    Args:
    - translated_transcript (list): List of dictionaries with 'text', 'start', and 'duration'.
    - target_language (str): Language code for the TTS.
    - output_file (str): Path to save the final merged audio file.
    """
    client = texttospeech.TextToSpeechClient()
    combined_audio = AudioSegment.silent(duration=0)  # Initialize with silent audio
    last_end_time = 0  # Track the end time of the last segment

    # Ensure the output directory exists
    directory = os.path.dirname(output_file)
    if not os.path.exists(directory):
        os.makedirs(directory)

    for entry in translated_transcript:
        text = entry['text']
        start_time = entry['start'] * 1000  # Convert start time to milliseconds
        duration_target = entry['duration'] * 1000  # Convert duration to milliseconds
        end_time = start_time + duration_target

        # Set up the TTS request
        synthesis_input = texttospeech.SynthesisInput(text=text)
        voice = texttospeech.VoiceSelectionParams(
            language_code=target_language,
            ssml_gender=texttospeech.SsmlVoiceGender.FEMALE
        )
        audio_config = texttospeech.AudioConfig(
            audio_encoding=texttospeech.AudioEncoding.MP3
        )

        # Synthesize speech
        response = client.synthesize_speech(
            input=synthesis_input, voice=voice, audio_config=audio_config
        )

        # Save the audio to a temporary file
        temp_file = f"{directory}/temp_audio.mp3"
        with open(temp_file, "wb") as audio_file:
            audio_file.write(response.audio_content)

        # Load this temporary file with pydub
        segment = AudioSegment.from_mp3(temp_file)
        os.unlink(temp_file)  # Delete the temp file

        # Adjust the speed of the audio to match the duration if necessary
        if len(segment) != duration_target:
            segment = change_speed(segment, duration_target)

        # Calculate the silence needed before this segment to align it properly
        silence_needed = start_time - last_end_time
        if silence_needed > 0:
            silence_segment = AudioSegment.silent(duration=silence_needed)
            combined_audio += silence_segment  # Add silence before the current segment
        elif silence_needed < 0:
            # If there is an overlap, trim the combined audio
            combined_audio = combined_audio[:silence_needed]

        # Add the current segment to the combined audio
        combined_audio += segment
        last_end_time = end_time  # Update the end time

    # Export the combined audio
    combined_audio.export(output_file, format="mp3")
    print(f"Aligned and combined audio has been saved to {output_file}")

if __name__ == "__main__":
    # english
    video_url = "https://www.youtube.com/watch?v=oz9cEqFynHU"

    # hindi
    # video_url = "https://www.youtube.com/watch?v=45JmB3PoqfQ"

    # different languages: 'en', 'fr', 'fil', 'id', 'ja', 'ms'

    translated_transcript = translate_transcript(video_url, 'en')
    print(translated_transcript)

    joined_transcripts = join_transcripts(video_url, 'en')
    print(joined_transcripts)

    video_id = extract_video_id(video_url)
    transcript = YouTubeTranscriptApi.get_transcript(video_id)
    print(transcript)

    # text_to_speech(joined_transcripts, 'ms', "FEMALE")

    # merge_audio_files('final_output.mp3')

    # text_to_speech_and_align(translated_transcript, 'en', 'output/final_audio.mp3')