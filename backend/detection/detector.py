import cv2
import numpy as np
import os
import tensorflow as tf
from ultralytics import YOLO
from datetime import datetime
import time
from database import alerts_collection
from utils.notifier import send_alert_email

# Ensure alert images directory exists
ALERTS_DIR = os.path.join(os.path.dirname(__file__), "..", "static", "alerts")
if not os.path.exists(ALERTS_DIR):
    os.makedirs(ALERTS_DIR)

class ViolenceDetector:
    def __init__(self):
        # Calculate base directory (root of the project)
        # This file is at root/backend/detection/detector.py
        # We go up two levels to get to the root
        self.base_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", ".."))
        
        # Build absolute paths for models
        weapon_model_path = os.path.join(self.base_dir, "weapon_model", "best.pt")
        fight_model_path = os.path.join(self.base_dir, "fight_detection", "fight_model.h5")
        fire_model_path = os.path.join(self.base_dir, "fire_model", "fire.pt")

        print(f"Loading Weapon Model from: {weapon_model_path}")
        self.weapon_model = YOLO(weapon_model_path)
        
        print(f"Loading Fight Model from: {fight_model_path}")
        self.fight_model = tf.keras.models.load_model(fight_model_path)

        # Fire Detection Model (Optional)
        self.fire_model = None
        if os.path.exists(fire_model_path):
            print(f"Loading Fire Model from: {fire_model_path}")
            self.fire_model = YOLO(fire_model_path)
        else:
            print("Fire Model not found. Skipping fire detection.")
        
        self.is_running = False
        self.camera = None
        self.user_email = None # Email of the user who started the session
        self.fight_threshold = 0.5
        self.last_alert_time = 0
        self.alert_cooldown = 10 # Seconds to wait before sending another email/log
        self.current_status = {
            "threat_score": 0, 
            "is_weapon": False, 
            "is_fight": False, 
            "is_fire": False,
            "detections": []
        }
        
    def process_frame(self, frame):
        threat_score = 0
        detections = []
        is_fight = False
        is_weapon = False
        
        # 1. Weapon Detection (YOLO)
        weapon_results = self.weapon_model(frame, verbose=False)[0]
        for box in weapon_results.boxes:
            label = weapon_results.names[int(box.cls[0])]
            if label.lower() == 'person':
                continue # Skip drawing/listing persons, only focus on weapons
            
            is_weapon = True
            threat_score += 60
            detections.append(f"Weapon ({label})")
            
            # Manually draw box for weapons only
            b = box.xyxy[0].cpu().numpy().astype(int)
            cv2.rectangle(frame, (b[0], b[1]), (b[2], b[3]), (0, 0, 255), 2)
            cv2.putText(frame, f"WEAPON: {label.upper()}", (b[0], b[1]-10), 
                        cv2.FONT_HERSHEY_SIMPLEX, 0.5, (0, 0, 255), 2)

        # 2. Fire Detection (YOLO)
        is_fire = False
        if self.fire_model:
            fire_results = self.fire_model(frame, verbose=False)[0]
            if len(fire_results.boxes) > 0:
                is_fire = True
                threat_score += 100 # High priority
                for box in fire_results.boxes:
                    detections.append("Fire/Smoke")
                frame = fire_results.plot()
                cv2.putText(frame, "!!! FIRE DETECTED !!!", (50, 100), 
                            cv2.FONT_HERSHEY_SIMPLEX, 1, (0, 0, 255), 3)

        # 3. Fight Detection (AI Model)
        img = cv2.resize(frame, (224, 224))
        img = img / 255.0
        img = np.expand_dims(img, axis=0)
        
        fight_pred = self.fight_model.predict(img, verbose=0)[0][0]
        
        if fight_pred > self.fight_threshold:
            is_fight = True
            threat_score += 40
            detections.append("Physical Fight")
            # Visual feedback in RED
            cv2.putText(frame, "!!! PHYSICAL FIGHT DETECTED !!!", (50, 60), 
                        cv2.FONT_HERSHEY_SIMPLEX, 1.2, (0, 0, 255), 4)
            # Add a red border around the frame to indicate danger
            cv2.rectangle(frame, (0,0), (frame.shape[1], frame.shape[0]), (0,0,255), 15)

        # 4. Handle Alerts & Database Logging with Cooldown
        current_time = time.time()
        if threat_score >= 40 and (current_time - self.last_alert_time) > self.alert_cooldown:
            self.last_alert_time = current_time
            
            # Save screenshot
            timestamp_str = datetime.now().strftime("%Y%m%d_%H%M%S")
            screenshot_filename = f"leak_{timestamp_str}.jpg"
            screenshot_path = os.path.join(ALERTS_DIR, screenshot_filename)
            cv2.imwrite(screenshot_path, frame)
            
            # Prepare threat details
            danger_level = "High" if threat_score >= 90 else "Medium"
            threat_type_str = ", ".join(detections)

            # Log to DB
            alert_data = {
                "timestamp": datetime.now(),
                "threat_type": threat_type_str,
                "confidence_score": int(max(fight_pred * 100, 90) if is_weapon or is_fire else fight_pred * 100),
                "camera_id": "cam_01",
                "threat_level": danger_level,
                "screenshot": f"/static/alerts/{screenshot_filename}"
            }
            alerts_collection.insert_one(alert_data)

            # Send Email Alert
            send_alert_email(threat_type_str, danger_level, self.user_email, screenshot_path)

        # Update real-time status for the frontend /status endpoint
        self.current_status = {
            "threat_score": int(min(threat_score, 100)),
            "is_weapon": is_weapon,
            "is_fight": is_fight,
            "is_fire": is_fire,
            "detections": detections
        }

        return frame

    def start(self, user_email=None):
        if not self.is_running:
            self.user_email = user_email
            self.camera = cv2.VideoCapture(0)
            self.is_running = True
            print(f"Detector Started for user: {user_email}")
            
    def stop(self):
        self.is_running = False
        if self.camera:
            self.camera.release()
            print("Detector Stopped.")
            
    def get_frames(self):
        while self.is_running:
            success, frame = self.camera.read()
            if not success:
                break
            
            # Process and calculate threat scores
            processed_frame = self.process_frame(frame)
            
            # Encode for streaming
            _, buffer = cv2.imencode('.jpg', processed_frame)
            yield (b'--frame\r\n'
                   b'Content-Type: image/jpeg\r\n\r\n' + buffer.tobytes() + b'\r\n')
            
        if self.camera:
            self.camera.release()

detector = ViolenceDetector()

