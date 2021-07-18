#!/bin/bash

cd ../api

docker rmi -f shlong-api
docker build -t shlong-api .

cd ../web

docker rmi -f shlong-web
docker build -t shlong-web .

