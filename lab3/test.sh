#! /bin/bash

res80=$(curl -s http://localhost:80)
res3000=$(curl -s http://localhost:3000)

if [[ "$res80" == "Hello node" && "$res3000" == "Hello node" ]]; then
    echo "Testy przeszły"
else
    echo "Testy nie przeszły"
fi
