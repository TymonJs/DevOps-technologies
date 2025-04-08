#! /bin/bash
docker container rm lab4_zad2
docker volume rm all_volumes nodejs_data
docker volume create nodejs_data

docker run -dit \
    --name lab4_zad2 \
    -v nodejs_data:/app \
    node:14-alpine \
    sh -c "echo 'Hello node' > /app/main.js"

docker volume create all_volumes

docker container run --rm -it \
    -v nginx_data:/usr/share/nginx/html \
    -v nodejs_data:/app \
    -v all_volumes:/all_volumes \
    ubuntu sh -c "cp -r /usr/share/nginx/html/. /all_volumes && cp -r /app/. /all_volumes"