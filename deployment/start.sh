#!/bin/bash

cd apps/traefik
docker-compose up -d --remove-orphans

cd ../mongo
docker-compose up -d --remove-orphans

cd ../shlong
docker-compose up -d --remove-orphans