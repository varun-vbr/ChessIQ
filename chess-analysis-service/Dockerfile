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
CMD ["node", "server.js"]
