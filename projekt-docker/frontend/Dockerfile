ARG NODE_VER=18-alpine

# Najpierw instalujemy tylko biblioteki (one rzadko się zmieniają)
# W skutku npm install będzie cache'owany
FROM node:${NODE_VER} AS builder
WORKDIR /app
COPY package*.json ./ 
RUN npm install
COPY . .

FROM node:${NODE_VER}
WORKDIR /app
COPY --from=builder /app ./
EXPOSE 3000