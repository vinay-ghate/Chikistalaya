# Dockerfile for Chikistalaya (Monorepo Deployment)

# -----------------------------------------------------------------------------
# Stage 1: Build the Frontend
# -----------------------------------------------------------------------------
# -----------------------------------------------------------------------------
# Stage 1: Build the Frontend
# -----------------------------------------------------------------------------
# -----------------------------------------------------------------------------
# Stage 1: Build the Frontend
# -----------------------------------------------------------------------------
FROM node:20-slim AS frontend-builder

WORKDIR /app/frontend

# Copy frontend package files
COPY chikistalaya-frontend/package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the frontend source code
COPY chikistalaya-frontend/ .

# Build the frontend (Vite produces 'dist' folder)
RUN npm run build

# -----------------------------------------------------------------------------
# Stage 2: Setup the Backend & Serve Frontend
# -----------------------------------------------------------------------------
FROM node:20-slim

WORKDIR /app

# Install dependencies required for onnxruntime or other native modules if needed
# (Debian-based images usually have better compatibility out of the box than Alpine)
# RUN apt-get update && apt-get install -y ...

# Copy backend package files
COPY backend/package*.json ./backend/

# Install backend dependencies
WORKDIR /app/backend
RUN npm install --production --legacy-peer-deps

# Copy the rest of the backend source code
COPY backend/ .

# Copy the built frontend assets from Stage 1 into the backend's public folder
# We'll need to configure the backend to serve these static files.
COPY --from=frontend-builder /app/frontend/dist ./public

# Expose the port the app runs on
EXPOSE 3000

# Start the server
CMD ["node", "index.js"]
