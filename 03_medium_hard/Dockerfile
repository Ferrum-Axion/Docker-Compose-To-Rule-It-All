FROM node:20-alpine AS deps
WORKDIR /app
RUN npm init -y && npm install pg redis

FROM node:20-alpine
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY src/ .
EXPOSE 3000
CMD ["node", "server.js"]
