#! /bin/bash

docker network create --driver bridge backend_network

docker run -d \
  --name database \
  --network backend_network \
  -e MYSQL_ROOT_PASSWORD=password \
  -e MYSQL_DATABASE=testdb \
  -p 3306:3306 \
  mysql

until docker exec database mysql -uroot -ppassword -e "SELECT 1" &> /dev/null; do
  sleep 1
done

docker exec -i database mysql -uroot -ppassword testdb -e "CREATE TABLE users (id INT AUTO_INCREMENT PRIMARY KEY, name VARCHAR(255)); INSERT INTO users (name) VALUES ('Kamil'), ('Kacper');"
docker network create --driver bridge frontend_network

docker run -itd --name backend -p 5000:5000 --network backend_network node
docker network connect frontend_network backend
docker exec backend mkdir /app
docker cp server.js backend:/app
docker exec -w /app backend npm install express mysql2
docker exec -w /app backend node server.js &

docker run -itd --name frontend -p 3000:3000 --network frontend_network node
docker exec frontend mkdir /app
docker cp front.js frontend:/app
docker exec -w /app frontend node front.js &