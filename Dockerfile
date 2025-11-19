FROM node:18-alpine

WORKDIR /app

COPY package*.json ./

RUN npm ci --only=production && \
    apk add --no-cache ca-certificates

COPY . .

EXPOSE 3000

CMD ["npm", "start"]