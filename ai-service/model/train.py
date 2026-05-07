import numpy as np
import pandas as pd
from sklearn.ensemble import IsolationForest
from sklearn.preprocessing import StandardScaler
import joblib
import os

def generate_training_data():
    np.random.seed(42)
    n_normal = 1000

    # Normal shipment data
    normal_data = pd.DataFrame({
        'temperature': np.random.normal(4, 1.5, n_normal),      # Cold chain ~4°C
        'humidity': np.random.normal(60, 10, n_normal),          # Normal humidity
        'shippingTime': np.random.normal(24, 6, n_normal),       # ~24 hours
    })

    # Anomalous data (fraud/spoilage scenarios)
    n_anomaly = 100
    anomaly_data = pd.DataFrame({
        'temperature': np.random.uniform(15, 35, n_anomaly),     # Too hot
        'humidity': np.random.uniform(90, 100, n_anomaly),       # Too humid
        'shippingTime': np.random.uniform(72, 200, n_anomaly),   # Too slow
    })

    return pd.concat([normal_data, anomaly_data], ignore_index=True)

def train_model():
    print("Generating training data...")
    data = generate_training_data()

    # Scale features
    scaler = StandardScaler()
    scaled_data = scaler.fit_transform(data)

    # Train Isolation Forest
    print("Training Isolation Forest model...")
    model = IsolationForest(
        contamination=0.1,
        random_state=42,
        n_estimators=100
    )
    model.fit(scaled_data)

    # Save model and scaler
    os.makedirs('model', exist_ok=True)
    joblib.dump(model, 'model/anomaly_model.pkl')
    joblib.dump(scaler, 'model/scaler.pkl')

    print("Model trained and saved successfully!")
    print(f"Training samples: {len(data)}")
    return model, scaler

if __name__ == "__main__":
    train_model()