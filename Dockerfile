FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci --legacy-peer-deps
COPY . .
ENV MONGODB_URI=mongodb://localhost:27017/dummy
RUN npm run build

FROM node:20-alpine
WORKDIR /app
COPY --from=builder /app .
EXPOSE 3000
CMD ["npm", "start"]