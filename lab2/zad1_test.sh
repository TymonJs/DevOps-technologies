#!/bin/bash

res=$(curl -X GET -s http://localhost:8080)

if [ "$res" == "Hello World" ]; then
    echo "Test przeszedł!"
else
    echo "Test nie przeszedł"
fi