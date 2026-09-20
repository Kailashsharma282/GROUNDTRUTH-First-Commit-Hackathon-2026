import asyncio
import os
import sys
import imageio_ffmpeg
import edge_tts
from PIL import Image
import subprocess
import shutil

SCRIPT_TEXT = """
Welcome to GroundTruth, the AI-powered reality verification platform built natively on AWS for the Ship It track.
Organizations spend enormous effort documenting safety policies, standard operating procedures, and compliance checklists.
However, documentation only describes what should happen. The real physical world is often completely different.
GroundTruth bridges that gap by comparing documented requirements directly against real-world photographic evidence using Amazon SageMaker AI.

Let us walk through our live primary demo story: Blocked Emergency Exit.
First, we ingest the Emergency Safety and Egress Standard version 3.4.
GroundTruth automatically extracts and normalizes the policy into structured visual requirements, specifically Section 4.2: Emergency exits and designated egress pathways must remain unobstructed across a minimum width of 1.2 meters.

Next, an inspector on site captures photographic evidence of Exit Door 2B in Block B Floor 2.
The high-resolution photograph is uploaded securely to an encrypted Amazon S3 vault using pre-signed URLs.

Our AWS Step Functions pipeline triggers the Amazon SageMaker AI vision-language inference engine.
Within 412 milliseconds, SageMaker evaluates the requirement against the image tensors and detects a HIGH severity Reality Gap with 94 percent confidence.
Four heavy delivery freight crates are obstructing 70 percent of the doorway threshold, narrowing egress clearance from 1.2 meters down to 0.38 meters.
The system highlights the obstruction with precise bounding boxes and automatically flags an institutional memory warning: five similar egress violations have occurred at this exact location within 30 days.

GroundTruth instantly converts this reality gap into a corrective action ticket assigned to facilities supervisor Marcus Vance.
The field team relocates the crates to Storage Bay B-12 and submits a post-remediation photograph.

Now comes the signature Before and After verification engine.
SageMaker executes a multi-image comparison: Before is Non-Compliant, After is 100 percent Compliant with 97 percent confidence.
Following our strict AI trust boundary, high-impact safety closures require human confirmation.
The supervisor reviews the interactive slider and signs off, formally closing the finding and recording an immutable entry into the Amazon DynamoDB audit log.

Architecturally, GroundTruth runs as a serverless AWS workflow.
Amazon Amplify and CloudFront host the React frontend.
Amazon API Gateway and AWS Lambda handle the serverless application layer.
AWS Step Functions coordinates the multi-step inspection pipeline.
Amazon SageMaker performs multimodal AI inference.
Amazon DynamoDB stores operational state with single-digit millisecond latency.
And Amazon EventBridge, SQS FIFO queues, SNS push alerts, and CloudWatch handle asynchronous events, queues, and observability.

GroundTruth does not just tell organizations what their rules are.
It shows where reality diverges, turns that gap into action, and verifies whether the fix actually worked.
"""

async def generate_narration_audio(output_audio_path):
    print("Generating high-definition voiceover narration using edge-tts...")
    communicate = edge_tts.Communicate(SCRIPT_TEXT, voice="en-US-AndrewMultilingualNeural", rate="-2%")
    await communicate.save(output_audio_path)
    print(f"[OK] Voiceover audio generated: {output_audio_path}")

def get_audio_duration(audio_path, ffmpeg_exe):
    cmd = [ffmpeg_exe, "-i", audio_path]
    res = subprocess.run(cmd, stderr=subprocess.PIPE, stdout=subprocess.PIPE, text=True)
    import re
    match = re.search(r"Duration:\s*(\d+):(\d+):(\d+\.\d+)", res.stderr)
    if match:
        hours, mins, secs = match.groups()
        return float(hours) * 3600 + float(mins) * 60 + float(secs)
    return 145.0

def create_demo_mp4():
    ffmpeg_exe = imageio_ffmpeg.get_ffmpeg_exe()
    print(f"Using bundled FFmpeg: {ffmpeg_exe}")

    temp_dir = os.path.join(os.path.dirname(os.path.abspath(__file__)), "temp_media")
    os.makedirs(temp_dir, exist_ok=True)
    
    audio_path = os.path.join(temp_dir, "demo_narration.mp3")
    asyncio.run(generate_narration_audio(audio_path))
    
    duration = get_audio_duration(audio_path, ffmpeg_exe)
    print(f"Narration Audio Duration: {duration:.2f} seconds (~{int(duration // 60)}m {int(duration % 60)}s)")

    brain_dir = r"C:\Users\kaila\.gemini\antigravity-ide\brain\5ce25624-85cf-4a46-bc5b-34dccf92eb44"
    webp_files = [
        os.path.join(brain_dir, f) 
        for f in os.listdir(brain_dir) 
        if f.endswith(".webp") and "groundtruth" in f
    ]
    # Sort by modification time to pick the freshest live demonstration recording
    webp_files.sort(key=lambda p: os.path.getmtime(p), reverse=True)
    
    output_mp4_root = r"c:\Users\kaila\OneDrive\Desktop\Projects\GROUNDTRUTH-first-commit-hackathon\groundtruth_3min_live_demo.mp4"
    output_mp4_artifact = os.path.join(brain_dir, "groundtruth_3min_live_demo.mp4")

    if webp_files:
        webp_path = webp_files[0]
        print(f"Source WebP video selected: {webp_path}")
        
        cmd = [
            ffmpeg_exe, "-y",
            "-stream_loop", "-1",
            "-i", webp_path,
            "-i", audio_path,
            "-t", str(duration),
            "-vf", "scale=1920:1080:force_original_aspect_ratio=decrease,pad=1920:1080:(ow-iw)/2:(oh-ih)/2,format=yuv420p",
            "-c:v", "libx264",
            "-preset", "medium",
            "-crf", "22",
            "-c:a", "aac",
            "-b:a", "192k",
            "-shortest",
            output_mp4_root
        ]
        print("Executing FFmpeg MP4 encoding...")
        proc = subprocess.run(cmd, stdout=subprocess.PIPE, stderr=subprocess.PIPE)
        if proc.returncode == 0:
            print(f"[OK] Successfully generated root MP4: {output_mp4_root}")
            shutil.copy2(output_mp4_root, output_mp4_artifact)
            print(f"[OK] Copied MP4 to artifact directory: {output_mp4_artifact}")
        else:
            print(f"FFmpeg error:\n{proc.stderr.decode('utf-8', errors='ignore')}")
            sys.exit(1)
    else:
        print("No source WebP found.")

if __name__ == "__main__":
    create_demo_mp4()
