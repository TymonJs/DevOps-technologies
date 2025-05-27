ARG NODE_VER=18-alpine

FROM node:${NODE_VER} AS builder
WORKDIR /app
COPY ./package*.json .
RUN npm install
COPY . .

FROM node:${NODE_VER}
WORKDIR /app
COPY --from=builder /app ./
EXPOSE 3001
