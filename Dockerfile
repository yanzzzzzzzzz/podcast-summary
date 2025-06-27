FROM node:20 AS backend-builder
WORKDIR /app/backend
COPY backend/package.json backend/package-lock.json ./
RUN npm install --production=false
COPY backend .
RUN npm run build

FROM node:20 AS frontend-builder
WORKDIR /app/frontend
COPY frontend/package.json frontend/package-lock.json ./
RUN npm install --production=false
COPY frontend .
RUN npm run build

FROM node:20-slim AS prod
WORKDIR /app
COPY --from=backend-builder /app/backend/package.json ./backend/package.json
COPY --from=backend-builder /app/backend/package-lock.json ./backend/package-lock.json
COPY --from=backend-builder /app/backend/dist ./backend/dist
COPY --from=backend-builder /app/backend/uploads ./backend/uploads
COPY --from=backend-builder /app/backend/.env ./backend/.env
COPY --from=frontend-builder /app/frontend/dist ./frontend-dist
WORKDIR /app/backend
RUN npm install --production
WORKDIR /app
RUN apt-get update && apt-get install -y nginx && rm -rf /var/lib/apt/lists/*
COPY nginx.conf /etc/nginx/nginx.conf
COPY start.sh ./start.sh
RUN chmod +x ./start.sh
EXPOSE 3000 80
CMD ["./start.sh"] 