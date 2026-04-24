# Stage 1: Build the frontend
FROM node:20-alpine AS frontend-builder
WORKDIR /app/frontend
COPY frontend/package*.json ./
RUN npm install
COPY frontend/ ./
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
