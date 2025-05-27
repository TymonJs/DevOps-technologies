#!/bin/bash

info(){
    echo -e "\n\033[1;34m[$1]\033[0m $2"
}

NODE_VERSION="14"
info "KONFIGURACJA" "Używam Node.js wersji $NODE_VERSION"

info "KONTENER" "Tworzę i uruchamiam kontener Docker z Node.js $NODE_VERSION"
CONTAINER_ID=$(docker run -d -p 8080:8080 --name lab2zad1 -it node:$NODE_VERSION-alpine tail -f /dev/null)
echo "Utworzono kontener o ID: $CONTAINER_ID"

info "SPRZĄTANIE" "Aby zatrzymać i usunąć kontener, wykonaj:"
echo "docker stop $CONTAINER_ID"
echo "docker rm $CONTAINER_ID"

