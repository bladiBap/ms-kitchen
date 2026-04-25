#!/bin/bash

set -e

cd /root/ms-kitchen

git pull origin main

DROPLET_IP=$(curl -s --max-time 5 http://159.89.227.37/metadata/v1/interfaces/public/0/ipv4/address)

if [ -z "$DROPLET_IP" ]; then
    echo "ERROR: No se pudo obtener DROPLET_IP"
    exit 1
fi

if [ ! -f .env ]; then
    echo "ERROR: El archivo .env no existe en /root/ms-kitchen"
    exit 1
fi

docker compose -f docker-compose.yml down

docker compose -f docker-compose.yml up -d --build
