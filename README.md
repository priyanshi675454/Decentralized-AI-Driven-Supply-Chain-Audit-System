# 🔗 DeTrust — Decentralized AI-Driven Supply Chain Audit System

![Tech Stack](https://img.shields.io/badge/Stack-MERN%20%2B%20Solana%20%2B%20AI-00ff88)
![License](https://img.shields.io/badge/License-MIT-blue)

## 🌟 What is DeTrust?

A platform where manufacturers, suppliers, and consumers can track the full lifecycle of a product using **AI anomaly detection** + **blockchain verification**.

Most supply chain data is centralized and easily tampered with. DeTrust solves this by combining:
- **AI/ML** to detect anomalies in real-time (temperature spikes, shipping delays)
- **Solana blockchain** for immutable, permanent records
- **QR codes** for consumers to verify product authenticity

---

## 🏗️ Architecture
---

## ⚡ Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React + Vite + TailwindCSS |
| Backend | Node.js + Express |
| Database | MongoDB Atlas |
| AI/ML | Python + FastAPI + scikit-learn (Isolation Forest) |
| Blockchain | Solana (Devnet) + Anchor |
| Cloud | Google Cloud Run |
| Hosting | Vercel + Render |

---

## 🚀 Features

- ✅ JWT Authentication (Manufacturer / Supplier / Logistics roles)
- ✅ Product registration with unique ID + QR code
- ✅ Real-time AI anomaly detection on shipment data
- ✅ Trust Score system (0-100) updated by AI
- ✅ Blockchain transaction recording on Solana Devnet
- ✅ Consumer-facing product verification page
- ✅ Live demo simulator

---

## 🛠️ Local Setup

### Prerequisites
- Node.js v20+
- Python 3.11+
- MongoDB Atlas account
- Solana CLI

### 1. Clone the repo
```bash
git clone https://github.com/priyanshi675454/Decentralized-AI-Driven-Supply-Chain-Audit-System.git
cd Decentralized-AI-Driven-Supply-Chain-Audit-System
```

### 2. Setup Server
```bash
cd server
npm install
# Create .env file with your values (see .env.example)
npm run dev
```

### 3. Setup AI Service
```bash
cd ai-service
pip install -r requirements.txt
python model/train.py
python -m uvicorn main:app --reload --port 8000
```

### 4. Setup Client
```bash
cd client
npm install
npm run dev
```

---

## 🔑 Environment Variables

Create `server/.env`:

## 📁 Project Structure
detrust/
├── client/          # React frontend
├── server/          # Node.js + Express API
├── ai-service/      # Python FastAPI + ML model
└── blockchain/      # Solana Anchor program

---

## 👩‍💻 Built By

**Priyanshi Gajjar** 
Email: priyanshigajjar46@gmail.com

[![LinkedIn](https://img.shields.io/badge/LinkedIn-Connect-blue)](https://linkedin.com/in/priyanshigajjar)

---

