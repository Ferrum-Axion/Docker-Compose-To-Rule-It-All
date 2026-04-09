## Stage 1
FROM node:20-alpine as builder
WORKDIR /app
RUN npm init -y && npm install pg redis

## Stage 2
FROM node:20-alpine
WORKDIR /app
COPY --from=builder /app/node_modules ./node_modules
COPY src/ ./src/
EXPOSE 3000
CMD ["node", "src/server.js"]