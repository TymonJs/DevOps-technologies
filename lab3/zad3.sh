#!/bin/bash

node_container="my-node-app"
nginx_container="nginx-zad3"

docker network create my-network

docker run --name $node_container -p 3000:3000 --network my-network -d node tail -f /dev/null
docker exec $node_container mkdir -p /app
docker cp server.js $node_container:/app/
docker exec -w /app $node_container node server.js &

docker run --name $nginx_container -d -p 80:80 -p 443:443 --network my-network nginx

openssl req -x509 -nodes -days 365 -newkey rsa:2048 \
    -keyout "./nginx-selfsigned.key" \
    -out "./nginx-selfsigned.crt" \
    -subj "/C=US/ST=Test/L=Test/O=Test/OU=IT Department/CN=localhost"

docker cp nginx-selfsigned.crt $nginx_container:/etc/ssl/
docker cp nginx-selfsigned.key $nginx_container:/etc/ssl/
docker cp default.conf $nginx_container:/etc/nginx/conf.d/
docker cp nginx.conf $nginx_container:/etc/nginx
docker exec $nginx_container nginx -s reload

