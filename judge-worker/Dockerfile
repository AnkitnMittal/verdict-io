FROM node:20-alpine

WORKDIR /app

RUN apk add --no-cache docker-cli bash coreutils

COPY . .

RUN npm install

CMD ["npm", "run", "dev"]