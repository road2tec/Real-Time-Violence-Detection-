import smtplib
import os
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from email.mime.image import MIMEImage

# --- Email Configuration ---
# Note: Use your actual email and an APP PASSWORD for Gmail
# Do NOT use your regular login password.
SMTP_SERVER = "smtp.gmail.com"
SMTP_PORT = 587
SENDER_EMAIL = "punamchanne51@gmail.com" 
SENDER_PASSWORD = "urus fula zdtv pfjv" # Get this from Google Account Settings -> Security -> App Passwords
def send_alert_email(threat_type, threat_level, receiver_email, screenshot_path=None):
    """
    Sends an email alert with optional screenshot attached.
    """
    if not receiver_email:
        print(f"Skipping email send: No receiver email provided for {threat_type}")
        return

    try:
        # 1. Setup the message
        msg = MIMEMultipart()
        msg['From'] = SENDER_EMAIL
        msg['To'] = receiver_email
        msg['Subject'] = f"🚨 SECURITY ALERT: {threat_type} Detected!"

        body = f"""
        <html>
        <body style="font-family: Arial, sans-serif;">
            <h2 style="color: #e11d48;">SafeGuard Security Alert</h2>
            <p>A high-risk event has been detected on your premises.</p>
            <table border="0" cellpadding="10">
                <tr>
                    <td><strong>Event:</strong></td>
                    <td style="color: #e11d48; font-weight: bold;">{threat_type}</td>
                </tr>
                <tr>
                    <td><strong>Danger Level:</strong></td>
                    <td>{threat_level}</td>
                </tr>
                <tr>
                    <td><strong>Time:</strong></td>
                    <td>{os.path.basename(screenshot_path).split('_')[1] if screenshot_path else 'Just now'}</td>
                </tr>
            </table>
            <p>Please check your dashboard immediately.</p>
        </body>
        </html>
        """
        msg.attach(MIMEText(body, 'html'))

        # 2. Attach Screenshot
        if screenshot_path and os.path.exists(screenshot_path):
            with open(screenshot_path, 'rb') as f:
                img_data = f.read()
            image = MIMEImage(img_data, name=os.path.basename(screenshot_path))
            msg.attach(image)

        # 3. Send Email
        # Skip sending if password is placeholder
        if "your-app-password" in SENDER_PASSWORD:
            print(f"Skipping email send: SMTP credentials not configured. (Detected: {threat_type})")
            return

        with smtplib.SMTP(SMTP_SERVER, SMTP_PORT) as server:
            server.starttls()
            server.login(SENDER_EMAIL, SENDER_PASSWORD)
            server.send_message(msg)
            print(f"✅ Email Alert Sent for {threat_type}")

    except Exception as e:
        print(f"❌ Failed to send email alert: {e}")
