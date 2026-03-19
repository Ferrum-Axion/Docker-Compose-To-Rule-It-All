FROM node:20-alpine
WORKDIR /app
RUN npm install pg
COPY src/ .
CMD ["node", "server.js"]
