#! /bin/bash

docker network create --driver bridge --subnet 192.168.1.0/24 my_bridge

docker run -it --name lab6zad1 --network my_bridge ubuntu