FROM node:22.21.1-alpine3.21

LABEL OWNER="Bladimir Baptista Gonzales"
LABEL PROJECT="Catering Produccion"
LABEL DESCRIPTION="Proyecto del diplomado de microservicios"
LABEL MAINTAINER="bladibap"

WORKDIR /app

COPY package.json package.json

RUN npm install

COPY . .

RUN npm run build

EXPOSE 3000

HEALTHCHECK --interval=30s CMD curl http://localhost:3000/hello-world || exit 1

WORKDIR /app/dist
CMD ["node", "index.js"]
