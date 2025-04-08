#! /bin/bash
VOL_NAME="nginx_data"

docker volume create $VOL_NAME
docker run --name lab4_zad1 -p 80:80 -d -v $VOL_NAME:/usr/share/nginx/html nginx