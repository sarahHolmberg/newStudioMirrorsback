"""
make-study-audio.py
Turns the `speech` text of every info step in a study data file into an mp3,
plus, if the data file has `audioAll`, one mp3 with every lesson after each other.
Given js/study-codes.js (a list of words) instead, it makes /audio/codes/<word>.mp3.

Uses the free offline Kokoro voice (pip install kokoro-onnx soundfile) and ffmpeg.
Model files: kokoro-v1.0.int8.onnx and voices-v1.0.bin from
https://github.com/thewh1teagle/kokoro-onnx/releases/tag/model-files-v1.0

Usage (from the repo root):
  python scripts/make-study-audio.py js/study-battle-data.js path/to/kokoro.onnx path/to/voices.bin
"""
import json
import os
import subprocess
import sys
import tempfile

import numpy as np
import soundfile as sf
from kokoro_onnx import Kokoro

VOICE = "af_heart"  # CHANGE HERE: any Kokoro voice name
SPEED = 0.95
PAUSE_SECONDS = 1.5  # silence between lessons in all.mp3
CODE_VOLUME = 1.35   # CHANGE HERE: code words this much louder than lessons, so they stand out


def load_data(path):
    # The data file is JavaScript; let Node read it and hand back JSON
    out = subprocess.check_output(["node", "-e", f"console.log(JSON.stringify(require({json.dumps(os.path.abspath(path))})))"])
    return json.loads(out)


def to_mp3(samples, rate, mp3_path, audio_filter=None):
    with tempfile.NamedTemporaryFile(suffix=".wav") as wav:
        sf.write(wav.name, samples, rate)
        extra = ["-af", audio_filter] if audio_filter else []
        subprocess.run(["ffmpeg", "-y", "-loglevel", "error", "-i", wav.name, *extra, "-ac", "1", "-b:a", "64k", mp3_path], check=True)


def make_codes(words, kokoro):
    os.makedirs("audio/codes", exist_ok=True)
    for word in words:
        samples, rate = kokoro.create(f"Code word: {word}. ... {word}.", voice=VOICE, speed=SPEED, lang="en-us")
        out = f"audio/codes/{word}.mp3"
        # Louder than the lessons (a page cannot play above 100%, so it is built into the file);
        # the limiter keeps any peak from clipping
        to_mp3(samples, rate, out, f"volume={CODE_VOLUME},alimiter=limit=0.97")
        print(f"{out}: {len(samples) / rate:.1f}s")


def main(data_path, model_path, voices_path):
    data = load_data(data_path)
    kokoro = Kokoro(model_path, voices_path)
    if isinstance(data, list):  # js/study-codes.js: just the code words
        return make_codes(data, kokoro)
    all_parts, rate = [], 24000
    for step in data["steps"]:
        if not step.get("speech") or not step.get("audio"):
            continue
        samples, rate = kokoro.create(step["speech"], voice=VOICE, speed=SPEED, lang="en-us")
        out = step["audio"].lstrip("/")  # /audio/battle/x.mp3 -> audio/battle/x.mp3 in the repo
        os.makedirs(os.path.dirname(out), exist_ok=True)
        to_mp3(samples, rate, out)
        print(f"{out}: {len(samples) / rate:.0f}s")
        all_parts += [samples, np.zeros(int(PAUSE_SECONDS * rate), dtype=samples.dtype)]
    if data.get("audioAll") and all_parts:
        out = data["audioAll"]["src"].lstrip("/")
        to_mp3(np.concatenate(all_parts), rate, out)
        print(f"{out}: done")


if __name__ == "__main__":
    main(*sys.argv[1:4])
