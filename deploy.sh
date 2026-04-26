#!/bin/bash

set -e

cd /root/ms-kitchen

git pull origin main

if [ ! -f .env ]; then
    echo "ERROR: El archivo .env no existe en /root/ms-kitchen"
    exit 1
fi

docker compose -f docker-compose.yml down

docker compose -f docker-compose.yml up -d --build

docker exec ms_kitchen_api npm run migration:generate

docker exec ms_kitchen_api npm run migration:run
