#! /bin/bash

CONTAINER_NAME="nginx-zad1"
WEBSITE_PATH="index.html"
WEBSITE_CONTENT="Hello nginx!"
PORT=80

echo $WEBSITE_CONTENT > $WEBSITE_PATH

docker run --name $CONTAINER_NAME -p $PORT:$PORT -d nginx
docker cp $WEBSITE_PATH $CONTAINER_NAME:/usr/share/nginx/html/$WEBSITE_PATH

isRunning=$(docker ps | grep $CONTAINER_NAME | wc -l)

if [ $isRunning == 1 ]; then
    echo "Test 1 przeszedł"
else
    echo "Test 1 nie przeszedł"
fi

res=$(curl -s http://localhost:$PORT)

if [ "$res" == "$WEBSITE_CONTENT" ]; then
    echo "Test 2 przeszedł"
else
    echo "Test 2 nie przeszedł"
fi