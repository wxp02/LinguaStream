from pytube import YouTube
import sys
import os
from moviepy.editor import *
import shutil
from celebrity_voice import generate_longer_voices
from youtube_translate import join_transcripts

def modify_youtube_video(video_url, path_name, file_name, script, voice_model):
    # Ensure the directory exists and is empty
    if os.path.exists(path_name):
        shutil.rmtree(path_name)
    os.makedirs(path_name, exist_ok=True)

    # Download the video from YouTube
    yt = YouTube(video_url)
    yt.streams.first().download(output_path=path_name, filename=f'{file_name}.mp4')

    # Ensure the downloaded file is named correctly
    downloaded_file_path = os.path.join(path_name, f"{file_name}.mp4")
    if not os.path.exists(downloaded_file_path):
        raise FileNotFoundError("The expected video file was not downloaded correctly.")

    # Generate the audio file using the provided script and voice model
    generate_longer_voices(script, voice_model, path_name, file_name)

    # Replace the audio in the video file
    replace_audio(path_name)


def replace_audio(folder_path):
    audio_extensions = ['.mp3', '.wav']
    video_extensions = ['.mp4']
    processed_audio_files = set()

    for file in os.listdir(folder_path):
        if any(file.endswith(ext) for ext in video_extensions):
            video_file = os.path.join(folder_path, file)
            basename = os.path.splitext(file)[0]

            audio_file = None
            for ext in audio_extensions:
                if os.path.exists(os.path.join(folder_path, f'{basename}{ext}')):
                    audio_file = os.path.join(folder_path, f'{basename}{ext}')
                    processed_audio_files.add(audio_file)
                    break

            if audio_file is None:
                print(f'No matching audio file found for {file}')
                continue

            video = VideoFileClip(video_file)
            audio = AudioFileClip(audio_file)

            video_with_new_audio = video.set_audio(audio)
            video_with_new_audio.write_videofile(os.path.join(folder_path, f'{basename}_ad.mp4'))

    for file in os.listdir(folder_path):
        if any(file.endswith(ext) for ext in audio_extensions) and os.path.join(folder_path, file) not in processed_audio_files:
            print(f'No matching video file found for {file}')

if __name__ == "__main__":
    video_url = "https://www.youtube.com/watch?v=_lHSawdgXpI"
    path_name = 'modify'
    file_name = "en_regular"
    script = join_transcripts(video_url, 'en')
    voice_model = "v2/en_speaker_6"

    modify_youtube_video(video_url, path_name, file_name, script, voice_model)
    # replace_audio(path_name)


