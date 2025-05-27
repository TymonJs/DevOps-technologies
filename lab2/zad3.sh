#!/bin/bash

info(){
    echo -e "\n\033[1;34m[$1]\033[0m $2"
}

NODE_VERSION="16"
info "KONFIGURACJA" "Używam Node.js wersji $NODE_VERSION"

info "KONTENER" "Tworzę i uruchamiam kontener Docker z Node.js $NODE_VERSION"
CONTAINER_ID=$(docker run -d -p 8080:27017 --name lab2zad3 -it mongo:latest tail -f /dev/null)
echo "Utworzono kontener o ID: $CONTAINER_ID"

info "STRUKTURA" "Tworzenie katalogu /app w kontenerze"
docker exec $CONTAINER_ID mkdir -p /app

info "KOPIOWANIE" "Kopiowanie plików aplikacji do kontenera za pomocą docker cp"
docker cp package.json $CONTAINER_ID:/app/
docker cp serv.js $CONTAINER_ID:/app/

info "ZALEŻNOŚCI" "Instalacja zależności Node.js wewnątrz kontenera:"
docker exec -w /app $CONTAINER_ID npm install

info "SPRZĄTANIE" "Aby zatrzymać i usunąć kontener, wykonaj:"
echo "docker stop $CONTAINER_ID"
echo "docker rm $CONTAINER_ID"

