FROM node
WORKDIR /app
COPY ./app ./
RUN npm install
ENV FAJNA_ZMIENNA="banan"
EXPOSE 8080
CMD ["node", "server.js"]