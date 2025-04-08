#! /bin/bash

docker run -d \
  --name db \
  --network my_network \
  -e MYSQL_ROOT_PASSWORD=password \
  -e MYSQL_DATABASE=testdb \
  -p 3306:3306 \
  mysql:8

