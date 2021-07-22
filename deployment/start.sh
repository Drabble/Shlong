#!/bin/bash

cd apps/traefik
docker-compose up -d

#cd ../mongo
#docker-compose up -d

cd ../shlong
docker-compose up -d