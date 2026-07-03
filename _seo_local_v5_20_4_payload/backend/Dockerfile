FROM node:22-alpine

WORKDIR /app

COPY package*.json ./
RUN if [ -f package-lock.json ]; then npm ci --omit=dev --no-audit --no-fund || npm install --omit=dev --no-audit --no-fund; else npm install --omit=dev --no-audit --no-fund; fi

COPY src ./src
COPY migrations ./migrations

EXPOSE 4000

CMD ["sh", "-c", "node src/migrate.js && node src/server.js"]
