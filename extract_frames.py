import cv2
import os
import glob

# Source paths
violence_src = r"dataset/Real Life Violence Dataset/Violence"
non_violence_src = r"dataset/Real Life Violence Dataset/NonViolence"

# Target paths
violence_target = r"fight_detection/dataset/violence"
non_violence_target = r"fight_detection/dataset/non_violence"

# Create target directories if they don't exist
os.makedirs(violence_target, exist_ok=True)
os.makedirs(non_violence_target, exist_ok=True)

def extract_frames(source_dir, target_dir, frames_per_video=3):
    videos = glob.glob(os.path.join(source_dir, "*.mp4"))
    print(f"Found {len(videos)} videos in {source_dir}")
    
    for idx, video_path in enumerate(videos):
        cap = cv2.VideoCapture(video_path)
        total_frames = int(cap.get(cv2.CAP_PROP_FRAME_COUNT))
        video_name = os.path.basename(video_path).split('.')[0]
        
        if total_frames <= 0:
            continue
            
        # Select evenly spaced frame indices
        interval = total_frames // (frames_per_video + 1)
        for i in range(1, frames_per_video + 1):
            frame_idx = i * interval
            cap.set(cv2.CAP_PROP_POS_FRAMES, frame_idx)
            ret, frame = cap.read()
            if ret:
                img_name = f"{video_name}_frame{i}.jpg"
                cv2.imwrite(os.path.join(target_dir, img_name), frame)
        
        cap.release()
        if (idx + 1) % 100 == 0:
            print(f"Processed {idx + 1} / {len(videos)} videos")

print("Processing Violence videos...")
extract_frames(violence_src, violence_target)
print("Processing NonViolence videos...")
extract_frames(non_violence_src, non_violence_target)
print("Frame extraction complete!")
