# Chikistalaya

## What is it?
Chikistalaya is a comprehensive healthcare management platform designed to empower users with tools to manage their health effectively. It combines modern web technologies with advanced AI to provide a seamless healthcare experience.

## Why?
Navigating the healthcare system can be fragmented and overwhelming. Chikistalaya aims to bridge this gap by centralizing essential health services—from managing medical records and getting AI-driven health advice to finding nearby services and comparing medicine prices—into a single, user-friendly application.

## How it works
The application is built using a modern tech stack:
- **Frontend**: A responsive web interface built with React, Vite, and Tailwind CSS, featuring a premium dark purple aesthetic.
- **Backend**: A robust Node.js and Express server that handles API requests, manages data, and integrates with various third-party services.
- **AI Integration**: Utilizes LangGraph and Google's Gemini model to power "MediChat," an intelligent AI doctor that can answer health queries based on your medical records (RAG).
- **Data Storage**: Uses Supabase for relational data and file storage, and Pinecone for vector storage to enable semantic search for the AI.
- **Authentication**: Secure user authentication provided by Firebase.

## Key Features
- **MediChat AI Doctor**: Chat with an AI assistant that understands your health context.
- **Health Records**: Securely upload and organize your medical documents.
- **Medicine Reminders**: Set up alerts to never miss a dose.
- **Price Comparison**: Compare medicine prices across major online pharmacies (PharmEasy, 1mg, Apollo).
- **Nearby Services**: Locate hospitals, doctors, labs, and pharmacies near you.
- **Premium Predictor**: Estimate insurance premiums based on health metrics.

## How to Run

### Prerequisites
- Node.js installed.
- Environment variables set up for both frontend and backend (Firebase, Supabase, Google Gemini, Pinecone, etc.).

Links : 
- Frontend : [https://chikistalaya.netlify.app/](https://chikistalaya.netlify.app/)
- Backend : [https://chikistalaya.onrender.com/](https://chikistalaya.onrender.com/)
  
```Note : If frontend not working start the backend by opening the backend link.```

### Quick Start
You can run both the frontend and backend concurrently using the provided batch script:

```bash
./run_app.bat
```

### Manual Start

**Backend:**
```bash
cd backend
npm install
npm run dev
```

**Frontend:**
```bash
cd chikistalaya-frontend
npm install
npm run dev
```

### Frontend .env Example
```env
VITE_FIREBASE_API_KEY=AIzaSyC_uaf-xxxxxxxxxxxxxxxxxxxxxxx
VITE_FIREBASE_AUTH_DOMAIN=qrxxxxxxxxxx.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=qrbxxxxxx1
VITE_FIREBASE_STORAGE_BUCKET=qxxxxxxxxx.firebasestorage.app
VITE_FIREBASE_MESSAGING_SENDER_ID=51211111111
VITE_FIREBASE_APP_ID=1:5100000000:web:d8axxxxxxxxxxxxx7xxa
VITE_GOOGLE_MAPS_API_KEY=AIxxxxxxx_xxxxxxxxxxxxxxxxxxxR6Y
VITE_BACKEND_URL=http://localhost:3000
VITE_APP_NAME=Chikistalaya

```

### Bacnkend .env Example
```env
PORT=3000
FIREBASE_API_KEY="Axxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx-xxxxxxQ"
FIREBASE_AUTH_DOMAIN="fluxxxxxxxxxxxxxx.firebaseapp.com"
FIREBASE_PROJECT_ID="fluxxxxxxxxxxxxxxxxxx"
FIREBASE_STORAGE_BUCKET="fluxxxxxxxxxxxxxx.firebasestorage.app"
FIREBASE_MESSAGING_SENDER_ID="3100000000000"
FIREBASE_APP_ID="1:312381009634:web:4xxxxxxxxxxxxxxxxxxxb"
SUPABASE_URL="https://oqxxxxxxxxxxxxxb.supabase.co"
SUPABASE_SERVICE_KEY="exxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxMH0.Mxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxv0"
GOOGLE_MAPS_API_KEY="AIxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxs"
PINECONE_API_KEY="xxk_5xxxxx6_QMZxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxMp"
PINECONE_INDEX="https://chikxxxxxxxxxxxxxxz.svc.apxxxxxxxxxxx4a.pinecone.io"
GROQ_API_KEY="gsk_90AWxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxXm"
TAVILY_API_KEY="txxxxxxxxx-dev-6xxxxxxxxxxxxxxxxxxxxxxxxu6"
GOOGLE_API_KEY="AIzxxxxxxxxxxxxxxxxxxxxxxxxxxxxxw"
FRONTEND_URL=http://localhost:5173
```
