# Deployment Guide for Chikistalaya

Since your project consists of a separate **Frontend** (Vite/React) and **Backend** (Node.js/Express), the best practice is to host them separately to leverage the strengths of different platforms.

## 1. Frontend Hosting (Netlify)
Netlify is excellent for hosting static sites like your Vite React app.

### Steps:
1.  **Push to GitHub**: Ensure your latest code is pushed to your GitHub repository.
2.  **Log in to Netlify**: Go to [netlify.com](https://www.netlify.com/) and log in.
3.  **Add New Site**: Click "Add new site" -> "Import from Git".
4.  **Connect GitHub**: Authorize GitHub and select your `Chikistalaya` repository.
5.  **Configure Build Settings**:
    *   **Base directory**: `chikistalaya-frontend` (Important! Since your frontend is in a subdirectory)
    *   **Build command**: `npm run build`
    *   **Publish directory**: `dist`
6.  **Environment Variables**:
    *   Click on "Show advanced" or go to "Site Settings" -> "Environment Variables" after setup.
    *   Add all variables from your `chikistalaya-frontend/.env` file:
        *   `VITE_FIREBASE_API_KEY`
        *   `VITE_FIREBASE_AUTH_DOMAIN`
        *   `VITE_BACKEND_URL` (Initially, you can leave this blank or put a placeholder. **You will update this after deploying the backend**).
        *   `VITE_GOOGLE_MAPS_API_KEY`
        *   etc.
7.  **Deploy**: Click "Deploy site".

## 2. Backend Hosting (Render)
Render is a great platform for hosting Node.js web services. It offers a free tier that is perfect for development.

### Steps:
1.  **Log in to Render**: Go to [render.com](https://render.com/).
2.  **New Web Service**: Click "New" -> "Web Service".
3.  **Connect GitHub**: Connect your repository.
4.  **Configure Settings**:
    *   **Root Directory**: `backend` (Important!)
    *   **Build Command**: `npm install`
    *   **Start Command**: `npm start`
5.  **Environment Variables**:
    *   Scroll down to "Environment Variables".
    *   Add all variables from your `backend/.env` file:
        *   `SUPABASE_URL`
        *   `SUPABASE_SERVICE_KEY`
        *   `FIREBASE_...` (all firebase admin keys)
        *   `FRONTEND_URL` (Set this to your **Netlify URL** once you have it, e.g., `https://your-site.netlify.app`. This fixes CORS).
6.  **Deploy**: Click "Create Web Service".

## 3. Final Connection
1.  Once the **Backend** is deployed on Render, copy its URL (e.g., `https://chikistalaya-backend.onrender.com`).
2.  Go back to **Netlify** (Frontend settings).
3.  Update the `VITE_BACKEND_URL` environment variable to your new Render Backend URL.
4.  **Trigger a new deploy** on Netlify (or it might auto-deploy) so the frontend picks up the new backend URL.

## Summary
*   **Frontend** lives on Netlify.
*   **Backend** lives on Render.
*   They talk to each other via the URLs you configure in the Environment Variables.
