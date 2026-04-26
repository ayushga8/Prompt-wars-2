# Stage 1: Build the frontend
FROM node:20-alpine AS frontend-builder
WORKDIR /app/frontend
COPY frontend/package*.json ./
RUN npm install
COPY frontend/ ./

# Firebase config as build args (these are client-side keys, safe to pass as build args)
ARG VITE_FIREBASE_API_KEY=AIzaSyBQf-onP58YGl0uSMSLhUptEs13hQVYhYw
ARG VITE_FIREBASE_AUTH_DOMAIN=promptwars-2.firebaseapp.com
ARG VITE_FIREBASE_PROJECT_ID=promptwars-2
ARG VITE_FIREBASE_STORAGE_BUCKET=promptwars-2.firebasestorage.app
ARG VITE_FIREBASE_MESSAGING_SENDER_ID=715657935538
ARG VITE_FIREBASE_APP_ID=1:715657935538:web:90b1669b25a08db5a567ab
ARG VITE_FIREBASE_MEASUREMENT_ID=G-RDSCN56FXE

# Set env vars so Vite can read them during build
ENV VITE_FIREBASE_API_KEY=$VITE_FIREBASE_API_KEY
ENV VITE_FIREBASE_AUTH_DOMAIN=$VITE_FIREBASE_AUTH_DOMAIN
ENV VITE_FIREBASE_PROJECT_ID=$VITE_FIREBASE_PROJECT_ID
ENV VITE_FIREBASE_STORAGE_BUCKET=$VITE_FIREBASE_STORAGE_BUCKET
ENV VITE_FIREBASE_MESSAGING_SENDER_ID=$VITE_FIREBASE_MESSAGING_SENDER_ID
ENV VITE_FIREBASE_APP_ID=$VITE_FIREBASE_APP_ID
ENV VITE_FIREBASE_MEASUREMENT_ID=$VITE_FIREBASE_MEASUREMENT_ID

RUN npm run build

# Stage 2: Build the backend and serve the app
FROM node:20-alpine
WORKDIR /app/backend
COPY backend/package*.json ./
RUN npm install --production
COPY backend/ ./

# Copy built frontend to the expected location
COPY --from=frontend-builder /app/frontend/dist /app/frontend/dist

# Expose port (Cloud Run sets PORT automatically, defaulting to 8080)
ENV PORT=8080
EXPOSE 8080

CMD ["node", "index.js"]
