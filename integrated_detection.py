from ultralytics import YOLO
import tensorflow as tf
import cv2
import numpy as np

weapon_model = YOLO("weapon_model/best.pt")
fight_model = tf.keras.models.load_model("fight_detection/fight_model.h5")

cap = cv2.VideoCapture(0)

while True:

    ret, frame = cap.read()
    if not ret:
        break

    weapon_results = weapon_model(frame)

    img = cv2.resize(frame,(224,224))
    img = img/255
    img = np.expand_dims(img,0)

    pred = fight_model.predict(img)

    if pred > 0.5:
        cv2.putText(frame,"FIGHT DETECTED",(50,50),
                    cv2.FONT_HERSHEY_SIMPLEX,1,(0,0,255),2)

    annotated = weapon_results[0].plot()

    cv2.imshow("AI Surveillance System",annotated)

    if cv2.waitKey(1) & 0xFF == 27:
        break

cap.release()
cv2.destroyAllWindows()
