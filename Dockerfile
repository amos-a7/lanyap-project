FROM node:20-alpine

WORKDIR /app

# Install dependencies for backend
COPY backend/package*.json ./backend/
RUN cd backend && npm install --production

# Copy backend and frontend source
COPY backend/ ./backend/
COPY frontend/ ./frontend/

EXPOSE 3000

WORKDIR /app/backend

CMD ["node", "server.js"]
