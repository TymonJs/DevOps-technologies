#! /bin/bash

res=$(curl -s http://localhost:3000)
expected="Message from backend: id: 1, name: Kamil id: 2, name: Kacper"
if [ "$res"=="$expected" ]; then
    echo "Test przeszedł"
else
    echo "Test nie przeszedł"
fi