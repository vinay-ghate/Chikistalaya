# Dockerfile for Chikistalaya (Monorepo Deployment)

# -----------------------------------------------------------------------------
# Stage 1: Build the Frontend
# -----------------------------------------------------------------------------
# -----------------------------------------------------------------------------
# Stage 1: Build the Frontend
# -----------------------------------------------------------------------------
FROM node:20-alpine AS frontend-builder

WORKDIR /app/frontend

# Copy frontend package files
COPY chikistalaya-frontend/package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the frontend source code
COPY chikistalaya-frontend/ .

# Build the frontend (Vite produces 'dist' folder)
# Note: We use a placeholder for VITE_BACKEND_URL because environment variables
# are baked in at build time. For a Docker setup, we often serve the frontend
# from the same origin as the backend, so a relative path or runtime injection is better.
# However, for simplicity here, we assume the backend serves the frontend.
RUN npm run build

# -----------------------------------------------------------------------------
# Stage 2: Setup the Backend & Serve Frontend
# -----------------------------------------------------------------------------
FROM node:20-alpine

WORKDIR /app

# Install gcompat for onnxruntime (required for Alpine Linux)
RUN apk add --no-cache gcompat

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
