FROM node:20-slim

# Install Stockfish
RUN apt-get update && apt-get install -y \
    stockfish \
 && rm -rf /var/lib/apt/lists/*

ENV PATH="/usr/games:${PATH}"

WORKDIR /app

COPY package*.json ./
RUN npm install --only=production

COPY  . .

EXPOSE 3000

# Health check (adjust the endpoint as needed)
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
    CMD node -e "require('http').get('http://localhost:3000/api/v1/analysis/health', (r) => {process.exit(r.statusCode === 200 ? 0 : 1)})"

CMD ["node", "server.js"]
