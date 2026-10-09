"""Download and encode the DROID footage used by the launch film.

The encoded clips (about 600 MB) are not committed. This rebuilds
video/public/footage/ from video/footage.json.

Usage: python3 scripts/fetch_footage.py   (needs ffmpeg on PATH)
"""
import json
import pathlib
import subprocess
import concurrent.futures

root = pathlib.Path(__file__).resolve().parent.parent
manifest = json.loads((root / "video" / "footage.json").read_text())
out_dir = root / "video" / "public" / "footage"
out_dir.mkdir(parents=True, exist_ok=True)


def encode(item):
    name, spec = item
    out = out_dir / f"{name}.mp4"
    if out.exists():
        return name, "exists"
    args = ["ffmpeg", "-v", "error", "-y"]
    if "input_seconds" in spec:
        args += ["-t", str(spec["input_seconds"])]
    args += [
        "-i", spec["gcs"],
        "-vf", "setpts=2*PTS,scale=1920:1080:flags=lanczos,unsharp=5:5:0.4",
        "-r", "30", "-c:v", "libx264", "-crf", "19", "-preset", "medium",
        "-pix_fmt", "yuv420p", "-g", "15", "-movflags", "+faststart", "-an", str(out),
    ]
    subprocess.run(args, check=True)
    return name, "encoded"


with concurrent.futures.ThreadPoolExecutor(4) as ex:
    for name, status in ex.map(encode, manifest["streams"].items()):
        print(f"{name}: {status}")
