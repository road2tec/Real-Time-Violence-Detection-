# SafeGuard: AI-Powered Real-Time Surveillance System 🛡️🔥

SafeGuard is a cutting-edge, full-stack AI surveillance system designed to detect **violence, weapons, and fire** in real-time. Using state-of-the-art computer vision models, it provides instant alerts via email (with screenshots) and a dynamic dashboard for live monitoring and reporting.

## ✨ Key Features
- **Real-Time Detection**: Monitors live camera feeds for Physical Fights, Weapons (Guns/Knives), and Fire/Smoke.
- **Dynamic Dashboard**: Premium UI with live video streaming, real-time threat scores, and system health monitoring.
- **Instant Alerts**: Sends email notifications with event screenshots immediately upon threat detection.
- **Comprehensive Reports**: Automated activity charts and alert distribution analytics.
- **Secure Storage**: All incidents are logged in MongoDB with high-priority events saved for review.

## 🏗️ Technology Stack
- **Frontend**: React + Tailwind CSS + Lucide Icons + Vite
- **Backend**: FastAPI (Python) + OpenCV + YOLOv11/v8 + TensorFlow
- **Database**: MongoDB
- **Security**: JWT Authentication + Bcrypt Encryption

---

## 🚀 Installation & Setup

### 1. Prerequisites
- **Python 3.8+**
- **Node.js 18+**
- **MongoDB** (Local or Atlas)

### 2. Backend Setup
Navigate to the `backend` folder:
```bash
cd backend
python -m venv venv
# Windows
.\venv\Scripts\activate
# Linux/Mac
source venv/bin/activate
pip install -r requirements.txt
```
Create a `.env` file based on `.env.example` and add your credentials.

### 3. Frontend Setup
Navigate to the `frontend` folder:
```bash
cd frontend
npm install
npm run dev
```

### 4. Running the System
1. Start the backend: `python main.py`
2. Open the frontend URL (usually `http://localhost:5173`)
3. Login/Register and click **"Start Monitoring"** on the Dashboard.

---

## 📸 Project Structure
```text
├── backend/            # FastAPI Server & AI Logic
│   ├── detection/      # Core Detector (YOLO & TensorFlow)
│   ├── static/         # Alert Screenshots
│   ├── utils/          # Email & Auth Utilities
│   └── main.py         # Entry Point
├── frontend/           # React Application
│   ├── src/pages/      # Dashboard, Reports, Alert History
│   └── src/context/    # Auth Management
├── weapon_model/       # Pre-trained YOLO weights for weapons
├── fire_model/         # Pre-trained weights for fire/smoke
└── fight_detection/    # TensorFlow models for violence detection
```

## 📜 License
This project is licensed under the MIT License.

---
*Developed by Road2Tec - Empowering Security with AI.*
