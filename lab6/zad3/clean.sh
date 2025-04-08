#! /bin/bash
docker container stop database backend frontend
docker container rm database backend frontend
docker network rm backend_network frontend_network
