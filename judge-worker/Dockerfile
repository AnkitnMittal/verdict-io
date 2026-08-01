FROM node:20-alpine

RUN apk add --no-cache docker-cli bash coreutils

WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .

CMD ["npm", "run", "dev"]