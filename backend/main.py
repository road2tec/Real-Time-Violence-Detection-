from fastapi import FastAPI, Depends, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import StreamingResponse
from fastapi.staticfiles import StaticFiles
from routes import auth
from detection.detector import detector
from database import alerts_collection
from utils.auth import get_current_user
import uvicorn
import os

app = FastAPI(title="Smart AI Surveillance API")

# Ensure static directory exists
os.makedirs("static/alerts", exist_ok=True)

# Mount static files
app.mount("/static", StaticFiles(directory="static"), name="static")

# CORS Configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include Authentication Routes
app.include_router(auth.router, tags=["Authentication"])

@app.post("/start-detection")
async def start_detection(current_user: dict = Depends(get_current_user)):
    user_email = current_user.get("email")
    if detector.is_running:
        return {"message": "Detection already running"}
    detector.start(user_email=user_email)
    return {"message": f"Detection started for {user_email}"}

@app.post("/stop-detection")
async def stop_detection(current_user: dict = Depends(get_current_user)):
    if not detector.is_running:
        return {"message": "Detection is not running"}
    detector.stop()
    return {"message": "Detection stopped"}

@app.get("/video_feed")
async def video_feed():
    # Note: In a real app, you might want to protect this,
    # but StreamingResponse doesn't easily support JWT header from <img> tag.
    # We'll use a token in query param or allow if simple.
    if not detector.is_running:
        detector.start()
    return StreamingResponse(detector.get_frames(), media_type="multipart/x-mixed-replace; boundary=frame")
@app.get("/alerts")
async def get_alerts(current_user: dict = Depends(get_current_user)):
    alerts = list(alerts_collection.find().sort("timestamp", -1).limit(50))
    for alert in alerts:
        alert["_id"] = str(alert["_id"])
    return alerts

@app.get("/alerts/summary")
async def get_alerts_summary(current_user: dict = Depends(get_current_user)):
    total = alerts_collection.count_documents({})
    critical = alerts_collection.count_documents({"threat_level": "High"})
    return {
        "total": total,
        "critical": critical
    }

@app.get("/status")
async def get_status():
    return detector.current_status

if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
