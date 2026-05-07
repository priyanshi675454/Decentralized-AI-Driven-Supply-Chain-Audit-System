from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import joblib
import numpy as np
import os
from schemas import ShipmentInput, AnalysisResult

app = FastAPI(title="DeTrust AI Service", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# Load model on startup
model = None
scaler = None

@app.on_event("startup")
async def load_model():
    global model, scaler
    try:
        model = joblib.load("model/anomaly_model.pkl")
        scaler = joblib.load("model/scaler.pkl")
        print("AI Model loaded successfully")
    except Exception as e:
        print(f"Model not found, will use rule-based: {e}")

@app.get("/")
def health():
    return {"status": "DeTrust AI Service running", "model_loaded": model is not None}

@app.post("/analyze", response_model=AnalysisResult)
async def analyze_shipment(data: ShipmentInput):
    try:
        temperature = data.temperature or 4.0
        humidity = data.humidity or 60.0
        shippingTime = data.shippingTime or 24.0

        reasons = []
        riskScore = 0.0

        # Rule-based checks first
        if data.category in ["food", "pharma"]:
            if temperature > 8:
                reasons.append(f"Temperature too high: {temperature}°C (max 8°C)")
                riskScore += 35
            elif temperature < -2:
                reasons.append(f"Temperature too low: {temperature}°C (min -2°C)")
                riskScore += 25

        if shippingTime > 72:
            reasons.append(f"Shipping time excessive: {shippingTime}hrs (max 72hrs)")
            riskScore += 30

        if humidity > 90:
            reasons.append(f"Humidity too high: {humidity}% (max 90%)")
            riskScore += 20

        if humidity < 10:
            reasons.append(f"Humidity too low: {humidity}% (min 10%)")
            riskScore += 15

        # ML model check
        if model is not None and scaler is not None:
            features = np.array([[temperature, humidity, shippingTime]])
            scaled = scaler.transform(features)
            prediction = model.predict(scaled)
            anomaly_score = model.decision_function(scaled)[0]

            if prediction[0] == -1:
                riskScore = max(riskScore, 60)
                if "ML anomaly detected" not in reasons:
                    reasons.append(f"ML anomaly detected (score: {anomaly_score:.3f})")

        riskScore = min(100, riskScore)
        isAnomaly = riskScore >= 40

        return AnalysisResult(
            riskScore=round(riskScore, 2),
            isAnomaly=isAnomaly,
            reasons=reasons if reasons else ["All parameters normal"],
            method="ml+rules" if model is not None else "rules"
        )

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))