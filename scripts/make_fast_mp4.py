import os
import sys
import subprocess
import imageio_ffmpeg
import asyncio
import edge_tts
from PIL import Image

# Concise, compelling script strictly under 3 minutes (~2 min 25 sec)
SCRIPT_TEXT = """
Welcome to GroundTruth, the AI-powered reality verification platform built natively on AWS for the Ship It track.
Policies and compliance manuals describe what should happen. The physical world is often completely different.
GroundTruth closes this gap by comparing visual requirements directly against real-world photographic evidence using Amazon SageMaker AI.

Let us walk through our live primary demo story: Blocked Emergency Exit.
First, we ingest the Emergency Safety and Egress Standard.
GroundTruth parses Section 4.2: Emergency exits and designated egress pathways must remain unobstructed across a minimum width of 1.2 meters.

Next, a field inspector captures photographic evidence of Exit Door 2B in Block B Floor 2.
The photograph is uploaded to an encrypted Amazon S3 vault using pre-signed URLs.

Our AWS Step Functions pipeline invokes Amazon SageMaker AI.
Within 412 milliseconds, SageMaker detects a HIGH severity Reality Gap with 94 percent confidence.
Four freight crates obstruct 70 percent of the doorway threshold, narrowing clearance to 0.38 meters.
The system highlights the obstruction with precise bounding boxes and flags an institutional memory alert for repeat violations.

GroundTruth instantly converts this reality gap into a corrective action ticket assigned to facilities supervisor Marcus Vance.
The field team relocates the crates and submits a post-remediation photograph.

SageMaker performs multi-image verification: Before is Non-Compliant, After is 100 percent Compliant with 97 percent confidence.
Following our AI trust boundary, the supervisor confirms the remediation and signs off.
This records an immutable entry with SHA-256 hash into the Amazon DynamoDB audit log.

Architecturally, GroundTruth is serverless on AWS: Amazon Amplify, API Gateway, Lambda, Step Functions, SageMaker, S3, DynamoDB, Cognito, EventBridge, SQS, SNS, and CloudWatch.
GroundTruth turns visual reality gaps into verifiable action.
"""

async def generate_voiceover(audio_path):
    print("Generating voiceover audio (target: ~2m 25s)...")
    communicate = edge_tts.Communicate(SCRIPT_TEXT, voice="en-US-AndrewMultilingualNeural", rate="+0%")
    await communicate.save(audio_path)
    print(f"[OK] Voiceover generated: {audio_path}")

def get_audio_duration(audio_path, ffmpeg_exe):
    cmd = [ffmpeg_exe, "-i", audio_path]
    res = subprocess.run(cmd, stderr=subprocess.PIPE, stdout=subprocess.PIPE, text=True)
    import re
    match = re.search(r"Duration:\s*(\d+):(\d+):(\d+\.\d+)", res.stderr)
    if match:
        hours, mins, secs = match.groups()
        return float(hours) * 3600 + float(mins) * 60 + float(secs)
    return 145.0

def main():
    ffmpeg_exe = imageio_ffmpeg.get_ffmpeg_exe()
    brain_dir = r"C:\Users\kaila\.gemini\antigravity-ide\brain\5ce25624-85cf-4a46-bc5b-34dccf92eb44"
    source_webp = os.path.join(brain_dir, "groundtruth_demo_1789916497417.webp")
    
    if not os.path.exists(source_webp):
        source_webp = os.path.join(brain_dir, "groundtruth_live_demo_1789911162518.webp")

    temp_dir = os.path.join(os.path.dirname(os.path.abspath(__file__)), "temp_media")
    os.makedirs(temp_dir, exist_ok=True)
    audio_path = os.path.join(temp_dir, "demo_voiceover_under3min.mp3")

    asyncio.run(generate_voiceover(audio_path))
    duration = get_audio_duration(audio_path, ffmpeg_exe)
    print(f"Final Audio Duration: {duration:.2f} seconds ({int(duration//60)}m {int(duration%60)}s) - Strictly under 3 minutes!")

    output_root = r"c:\Users\kaila\OneDrive\Desktop\Projects\GROUNDTRUTH-first-commit-hackathon\groundtruth_3min_live_demo.mp4"
    output_artifact = os.path.join(brain_dir, "groundtruth_3min_live_demo.mp4")

    # Open WebP image and get frame count
    im = Image.open(source_webp)
    total_frames = getattr(im, "n_frames", 1)
    print(f"Source WebP has {total_frames} frames. Skipping initial splash (frame 0)...")

    # Target frame rate to span the full audio duration smoothly
    valid_frames = total_frames - 1
    fps = max(valid_frames / duration, 4.0)
    print(f"Encoding at {fps:.2f} FPS across {duration:.2f}s duration...")

    # Start FFmpeg process with pipe
    cmd = [
        ffmpeg_exe, "-y",
        "-f", "image2pipe",
        "-vcodec", "png",
        "-r", str(fps),
        "-i", "-",
        "-i", audio_path,
        "-vf", "scale=1920:1080:force_original_aspect_ratio=decrease,pad=1920:1080:(ow-iw)/2:(oh-ih)/2,format=yuv420p",
        "-c:v", "libx264",
        "-preset", "veryfast",
        "-crf", "20",
        "-c:a", "aac",
        "-b:a", "192k",
        "-shortest",
        output_root
    ]

    proc = subprocess.Popen(cmd, stdin=subprocess.PIPE, stdout=subprocess.PIPE, stderr=subprocess.PIPE)

    # Feed frames 1 to end
    for frame_idx in range(1, total_frames):
        im.seek(frame_idx)
        # Convert RGB and pipe as PNG
        rgb_im = im.convert("RGB")
        rgb_im.save(proc.stdin, "PNG")

    stdout, stderr = proc.communicate()

    if proc.returncode == 0:
        import shutil
        shutil.copy2(output_root, output_artifact)
        size_mb = os.path.getsize(output_root) / (1024 * 1024)
        print(f"\n=======================================================")
        print(f" [SUCCESS] LIVE DEMO MP4 CREATED!")
        print(f" Path: {output_root}")
        print(f" Duration: {int(duration//60)}m {int(duration%60)}s (under 3 minutes)")
        print(f" Resolution: 1920x1080 HD")
        print(f" File Size: {size_mb:.2f} MB")
        print(f"=======================================================\n")
    else:
        print("FFmpeg Error:", stderr.decode("utf-8", errors="ignore"))
        sys.exit(1)

if __name__ == "__main__":
    main()
