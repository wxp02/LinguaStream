from bark.generation import load_codec_model, generate_text_semantic
import torchaudio
import torch
from encodec.utils import convert_audio
from hubert.hubert_manager import HuBERTManager
from hubert.pre_kmeans_hubert import CustomHubert
from hubert.customtokenizer import CustomTokenizer
import numpy as np
from youtube_translate import translate_transcript, join_transcripts, insert_punctuation, text_to_speech, merge_audio_files
from scipy.io.wavfile import write as write_wav
import re

from bark.api import generate_audio, semantic_to_waveform
from transformers import BertTokenizer
from bark.generation import SAMPLE_RATE, preload_models, codec_decode, generate_coarse, generate_fine, generate_text_semantic

from IPython.display import Audio
import nltk
import os

os.environ["CUDA_VISIBLE_DEVICES"] = "0"

# Ensure that NLTK's 'punkt' resource is downloaded
def ensure_nltk_resources():
    try:
        nltk.data.find('tokenizers/punkt')
    except LookupError:
        print("NLTK 'punkt' tokenizer not found. Downloading...")
        nltk.download('punkt')

preload_models()

device = 'cpu'

# From https://github.com/gitmylo/bark-voice-cloning-HuBERT-quantizer
hubert_manager = HuBERTManager()
hubert_manager.make_sure_hubert_installed()
hubert_manager.make_sure_tokenizer_installed()

# Load the HuBERT model
hubert_model = CustomHubert(checkpoint_path='data/models/hubert/hubert.pt').to(device)

# Load the CustomTokenizer model
tokenizer = CustomTokenizer.load_from_checkpoint('data/models/hubert/tokenizer.pth').to(device)

# Assuming bark and hubert models are correctly imported and initialized as per your description.
def clone_voice(audio_filepath, output_name):
    model = load_codec_model(use_gpu=True if device == 'cuda' else False)
    
    # Load and pre-process the audio waveform
    wav, sr = torchaudio.load(audio_filepath)
    wav = convert_audio(wav, sr, model.sample_rate, model.channels)
    wav = wav.to(device)

    # Generate semantic vectors and tokens
    semantic_vectors = hubert_model.forward(wav, input_sample_hz=model.sample_rate)
    semantic_tokens = tokenizer.get_token(semantic_vectors)

    # Extract discrete codes from the model
    with torch.no_grad():
        encoded_frames = model.encode(wav.unsqueeze(0))
    codes = torch.cat([encoded[0] for encoded in encoded_frames], dim=-1).squeeze()  # [n_q, T]

    # Save the outputs to a file
    codes = codes.cpu().numpy()
    semantic_tokens = semantic_tokens.cpu().numpy()
    output_path = f'bark_voices/voice_models/{output_name}.npz'
    np.savez(output_path, fine_prompt=codes, coarse_prompt=codes[:2, :], semantic_prompt=semantic_tokens)
    print(f"Cloned voice saved to {output_path}")

def generate_longer_voices(text_prompt, voice_name, output_path, output_name):
    if voice_name in ['en', 'fr', 'zh-Hans']:
        text_to_speech(text_prompt, voice_name, "NEUTRAL")
        merge_audio_files(output_path, f'{output_name}.mp3')
    else:
        sentences = nltk.sent_tokenize(text_prompt)

        print("Sentences:", sentences)

        pieces = []
        for sentence in sentences:
            audio_array = generate_audio(sentence, history_prompt=voice_name, text_temp=0.1, waveform_temp=0.1)
            if audio_array is None or len(audio_array) == 0:
                print("Error: Audio generation failed for sentence:", sentence)
                continue  # Skip this sentence or handle error appropriately
            pieces.append(audio_array)

            filepath = f'bark_voices/generated_audios/curr.wav' # change this to your desired output path
            write_wav(filepath, SAMPLE_RATE, audio_array)

        if not pieces:
            print("No audio pieces were generated.")
            return

        concatenated_audio = np.concatenate(pieces)

        filepath = f'{output_path}/{output_name}.wav'
        write_wav(filepath, SAMPLE_RATE, concatenated_audio)
        print(f"Cloned voice saved to {filepath}")


# if __name__ == "__main__":
#     ensure_nltk_resources()
#     # english
#     # video_url = "https://www.youtube.com/watch?v=oz9cEqFynHU"

#     # hindi
#     # video_url = "https://www.youtube.com/watch?v=45JmB3PoqfQ"

#     # Dijsktra's algorithm (english)
#     # video_url = "https://www.youtube.com/watch?v=_lHSawdgXpI"

#     # translated_transcript = translate_transcript(video_url, 'en')
#     # print(translated_transcript)

#     # joined_transcripts = join_transcripts(video_url, 'en')
#     # print(joined_transcripts)

#     # Usage example:
#     # audio_path = 'bark_voices/speaker/gordonramsey.mp3'  # Input audio file
#     # voice_name = 'gordonramsey'  # Output voice name
#     # clone_voice(audio_path, voice_name)

#     text = '''Today I will teach you how to run Dijkstra's algorithm on a weighted directed graph, Dijkstra's algorithm tells you the shortest distance from a node to every other node in the graph, this is different from prims and kruskal which results in minimum spanning trees'''
#     script = insert_punctuation(text)
#     print(script)
#     voice_model = "bark_voices/voice_models/gordonramsey.npz"
#     output_path = 'bark_voices/generated_audios'
#     output_name = 'gordonramsey'
#     generate_longer_voices(script, voice_model, output_path, output_name)