# ms-kitchen

Microservicio de cocina del proyecto final del diplomado de microservicios.

## Requisitos

- Node.js 22.x
- npm 10+
- Docker y Docker Compose (opcional, para levantar por contenedores)
- PostgreSQL 15 (si levantas local sin Docker para DB)

## Variables de entorno

1. Copia el archivo de ejemplo:

```bash
cp .env.example .env
```

2. Ajusta los valores segun tu entorno.

Variables principales usadas por la app:

- `MS_KITCHEN_APP_PORT`
- `MS_KITCHEN_APP_PORT_EXTERNAL`
- `MS_KITCHEN_APP_NAME`
- `MS_KITCHEN_APP_HOST`
- `MS_KITCHEN_DB_HOST`
- `MS_KITCHEN_DB_PORT`
- `MS_KITCHEN_DB_USER`
- `MS_KITCHEN_DB_PASSWORD`
- `MS_KITCHEN_DB_NAME`
- `RABBITMQ_HOST`
- `RABBITMQ_USERNAME`
- `RABBITMQ_PASSWORD`
- `RABBITMQ_VIRTUAL_HOST`
- `JWT_ISSUER`
- `JWT_AUDIENCE`
- `JWT_SECRET`
- `CONSUL_HOST`
- `CONSUL_PORT`
- `CONSUL_INTERVAL`
- `CONSUL_TIMEOUT`
- `CONSUL_DEREGISTER_AFTER`

## Como levantar la app

### Opcion 1: Local (Node)

1. Instalar dependencias:

```bash
npm install
```

2. Levantar PostgreSQL (si no usas Docker Compose completo).

3. Ejecutar migraciones:

```bash
npm run migration:run
```

4. Levantar la app en modo desarrollo:

```bash
npm run dev
```

5. Verificar healthcheck:

```bash
GET http://localhost:<MS_KITCHEN_APP_PORT>/api/kitchen/health
```

### Opcion 2: Docker Compose

1. Asegurate de tener `.env` configurado.

2. Levantar servicios:

```bash
docker compose up -d --build
```

Esto levanta:

- `ms_kitchen_db` (PostgreSQL)
- `ms_kitchen_api` (API)

Puertos por defecto definidos en `docker-compose.yml`:

- API: `80 -> 3000`
- PostgreSQL: `5030 -> 5432`
