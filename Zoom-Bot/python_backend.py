# Code adapted from https://github.com/wiseman/py-webrtcvad/blob/master/example.py

import collections
import contextlib
import sys
import webrtcvad
import os

import pyvirtualcam
import numpy as np
from PIL import Image
import asyncio
from pyppeteer import launch

class Frame(object):
    """Represents a "frame" of audio data."""
    def __init__(self, bytes, timestamp, duration):
        self.bytes = bytes
        self.timestamp = timestamp
        self.duration = duration


def frame_generator(frame_duration_ms, audio, sample_rate):
    """Generates audio frames from PCM audio data.

    Takes the desired frame duration in milliseconds, the PCM data, and
    the sample rate.

    Yields Frames of the requested duration.
    """
    n = int(sample_rate * (frame_duration_ms / 1000.0) * 2)
    offset = 0
    timestamp = 0.0
    duration = (float(n) / sample_rate) / 2.0
    while offset + n < len(audio):
        yield Frame(audio[offset:offset + n], timestamp, duration)
        timestamp += duration
        offset += n

        
def get_speaking_time(frame_duration_ms, sample_rate, vad, frames):
    voiced_frames = []
    voiced_count = 0
    for frame in frames:
        is_speech = vad.is_speech(frame.bytes, sample_rate)
        if is_speech:
            voiced_count += 1
    return voiced_count
    

def get_initials(name):
    name = name.split(' ')
    if len(name) == 1:
        return name[0][0]
    elif len(name) == 0:
        return ""
    return name[0][0] + name[1][0]
    

def calculcate_stps():
    path = r".\bot\recordings"
    with open(os.path.join(path, 'mixed.pcm'), 'rb') as f:
        audio = f.read()
    sample_rate = 32000
    agressiveness = 1
    frame_duration_ms = 30
    vad = webrtcvad.Vad( agressiveness )
    frames = frame_generator(frame_duration_ms, audio, sample_rate)
    frames = list(frames)
    tst = get_speaking_time(frame_duration_ms, sample_rate, vad, frames)
    initials = ""
    stp = ""

    with open(os.path.join(path, 'participant_info.txt')) as f:
        lines = f.readlines()

    for line in lines:
        entry = line[:-1].split(",")
        if entry[0] == "Speaking Time Bot":
            continue
        fname = os.path.join(path, entry[1]+".pcm")
        if not os.path.isfile(fname) or not tst:
            initials += get_initials(entry[0]) + ","
            stp += "0,"
            continue
        with open(fname, 'rb') as f:
            audio = f.read()
        frames = frame_generator(frame_duration_ms, audio, sample_rate)
        frames = list(frames)
        t = get_speaking_time(frame_duration_ms, sample_rate, vad, frames)
        perc = int(100 * t / tst)
        initials += get_initials(entry[0]) + ","
        stp += str(perc) + ","

    initials = initials[:-1]
    stp = stp[:-1]

    with open(r'.\vis\data\stps.txt', 'w') as f:
        f.write(initials + "\n" + stp)
        

async def get_screenshot():
    browser = await launch()
    page = await browser.newPage()
    await page.goto('http://localhost:8123/vis/real_time.html')
    await page.screenshot({'path': 'plot.png', 'fullPage': 'true'})
    await page.close()
    await browser.close()

# await get_screenshot()
    
def convert_image():
    im = Image.open('plot.png')
    width, height = im.size   # Get dimensions
    new_width = 1920
    new_height = 1080
    left = (width - new_width)/2
    top = (height - new_height)/2
    right = (width + new_width)/2
    bottom = (height + new_height)/2

    # Crop the center of the image
    im = im.crop((left, top, right, bottom))
    im = np.asarray(im)
    return im
    
print('started')
with pyvirtualcam.Camera(width=1920, height=1080, fps=5) as cam:
    while True:
        # await get_screenshot()
        asyncio.run(get_screenshot())
        frame = np.zeros((cam.height, cam.width, 4), np.uint8)
        frame[:, :, :] = convert_image()
        cam.send(frame[:, :, :3])
        calculcate_stps()
        cam.sleep_until_next_frame()

