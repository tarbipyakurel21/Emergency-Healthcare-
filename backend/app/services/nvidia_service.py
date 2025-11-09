import os
import base64
import requests
from dotenv import load_dotenv

load_dotenv()

NVIDIA_API_KEY = os.getenv("NVIDIA_API_KEY")
NVIDIA_URL = "https://integrate.api.nvidia.com/v1/chat/completions"

# Supported file types
SUPPORTED_MEDIA = {
    "png": ["image/png", "image_url"],
    "jpg": ["image/jpeg", "image_url"],
    "jpeg": ["image/jpeg", "image_url"],
    "webp": ["image/webp", "image_url"],
    "mp4": ["video/mp4", "video_url"],
    "webm": ["video/webm", "video_url"],
    "mov": ["video/mov", "video_url"],
}


def _encode_media(filepath: str):
    ext = filepath.split(".")[-1].lower()
    if ext not in SUPPORTED_MEDIA:
        raise ValueError(f"Unsupported media type: {ext}")
    with open(filepath, "rb") as f:
        return base64.b64encode(f.read()).decode("utf-8"), SUPPORTED_MEDIA[ext]


def chat_with_nvidia(prompt: str, media_files=None):
    if media_files is None:
        media_files = []

    content = [{"type": "text", "text": prompt}]
    has_video = False

    # Attach media (if any)
    for path in media_files:
        data_b64, (mime_type, media_type) = _encode_media(path)
        if media_type == "video_url":
            has_video = True
        media_obj = {
            "type": media_type,
            media_type: {"url": f"data:{mime_type};base64,{data_b64}"}
        }
        content.append(media_obj)

    if has_video and len(media_files) > 1:
        raise ValueError("Only one video can be used at a time.")

    payload = {
        "model": "nvidia/nemotron-nano-12b-v2-vl",
        "messages": [
            {"role": "system", "content": "/think"},
            {"role": "user", "content": content}
        ],
        "max_tokens": 1024,
        "temperature": 0.7,
        "stream": False,
    }

    headers = {
        "Authorization": f"Bearer {NVIDIA_API_KEY}",
        "Content-Type": "application/json",
        "Accept": "application/json",
    }

    response = requests.post(NVIDIA_URL, json=payload, headers=headers)
    response.raise_for_status()
    data = response.json()
    return data["choices"][0]["message"]["content"]
