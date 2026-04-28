# 🗳️ Chunav Mitra (चुनाव मित्र)
### *Agentic Election Education Companion for the World's Largest Democracy*

[![Gemini](https://img.shields.io/badge/Powered%20By-Gemini-blue?logo=google-gemini)](https://deepmind.google/technologies/gemini/)
[![React](https://img.shields.io/badge/Frontend-React%2018-61DAFB?logo=react)](https://react.dev/)
[![Flask](https://img.shields.io/badge/Backend-Flask-white?logo=flask)](https://flask.palletsprojects.com/)
[![Tailwind](https://img.shields.io/badge/Styling-Tailwind%20CSS-38B2AC?logo=tailwind-css)](https://tailwindcss.com/)

**Chunav Mitra** is a state-of-the-art, agentic platform designed to bridge the civic knowledge gap in India. It combines advanced Generative AI with interactive visual simulations to make election education engaging, accessible, and high-fidelity.

---

## ✨ Key Features

### 🤖 Agentic Chat Interface
- **Bilingual Conversations**: Seamlessly switches between Hindi and English (Hinglish) for maximum inclusivity.
- **Fact-Checked Accuracy**: Trained with official ECI guidelines to provide reliable information.
- **Context-Aware Assistance**: Remembers conversation history to guide users through complex voting steps.

### 🎨 Interactive Visual Canvas
- **Polling Booth Simulator**: A 5-step interactive journey through a polling station (Entry -> ID Check -> Inking -> EVM -> VVPAT).
- **Interactive Election Map**: Visualizes the 7 phases of the Indian General Elections with geographic precision.
- **EVM & VVPAT Explainer**: 3D-styled exploded view of voting machines with technical breakdowns.
- **Dynamic Timeline**: Real-time rendering of election schedules and critical deadlines.

### 🔍 Utility Tools
- **Booth Finder**: Integrated Google Maps to locate the nearest polling station based on PIN codes.
- **Myth Buster**: Real-time fact-checking widget that debunked common election rumors.
- **Calendar Integration**: One-click addition of voting dates to Google Calendar.

---

## 🛠️ Technical Architecture

Chunav Mitra follows a modern **Agent-Canvas architecture**:
1. **Frontend**: React 18 with Vite for lightning-fast performance. Uses **Framer Motion** for premium micro-animations and **Tailwind CSS** for a tricolor-themed glassmorphic UI.
2. **Backend**: Python Flask API managing state and tool orchestration.
3. **AI Engine**: **Gemini 2.0 Flash** utilizing **Native Function Calling** to trigger 7 specialized canvas tools based on user intent.

---

## 🚀 Getting Started

### Prerequisites
- Node.js v18+
- Python 3.11+
- Google Cloud Project with Gemini API and Maps Embed API enabled.

### 1. Clone & Install
```bash
# Clone the repository
git clone https://github.com/your-username/chunav-mitra.git
cd chunav-mitra

# Setup Backend
cd backend
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt

# Setup Frontend
cd ../frontend
npm install
```

### 2. Environment Variables
Create a `.env` file in the `backend/` directory:
```env
GEMINI_API_KEY=your_gemini_key
MAPS_API_KEY=your_maps_key
FLASK_ENV=development
```

### 3. Run Locally
**Terminal 1 (Backend):**
```bash
cd backend
python run.py
```
**Terminal 2 (Frontend):**
```bash
cd frontend
npm run dev
```

---

## ☁️ Deployment Guide (Google Cloud Run)

### Backend Deployment
1. Build the Docker image:
   `gcloud builds submit --tag gcr.io/[PROJECT_ID]/chunav-backend`
2. Deploy to Cloud Run:
   `gcloud run deploy chunav-backend --image gcr.io/[PROJECT_ID]/chunav-backend --platform managed --set-env-vars="GEMINI_API_KEY=...,MAPS_API_KEY=..."`

### Frontend Deployment
1. Update `VITE_API_URL` in your frontend build to point to the Cloud Run backend URL.
2. Build the app: `npm run build`
3. Deploy to Firebase Hosting or Google Cloud Storage.

---

## 🏆 Hackathon Evaluation Areas

- **Google Services**: Deep integration of Gemini 2.0 Flash (Agentic Logic), Google Maps Platform, and Cloud Run.
- **Accessibility**: ARIA-compliant components, bilingual support, and high-contrast tricolor design.
- **Security**: Robust Pydantic validation and secure handling of API keys via server-side orchestration.
- **Testing**: 19+ integration and unit tests ensuring tool reliability.

---

Developed with ❤️ for the Indian Voter.
