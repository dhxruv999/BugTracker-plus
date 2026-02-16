FROM node:18-slim

WORKDIR /app

RUN apt-get update && apt-get install -y curl

COPY package*.json ./
RUN npm install --production

COPY . .

EXPOSE 4000

CMD ["node", "src/server.js"]
