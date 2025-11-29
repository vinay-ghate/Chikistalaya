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
