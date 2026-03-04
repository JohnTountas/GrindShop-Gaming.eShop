# IMPORTANT FILE: Needs for entire Full Stack App to go LIVE on "Render.com"

FROM node:20-bookworm-slim AS backend-build

WORKDIR /app/backend

COPY backend/package*.json ./
RUN npm ci

COPY backend/. ./
RUN npm run build


FROM node:20-bookworm-slim AS frontend-build

WORKDIR /app/frontend

COPY frontend/package*.json ./
RUN npm ci

COPY frontend/. ./
ARG VITE_API_URL=/api
ARG VITE_STRIPE_PUBLIC_KEY=pk_test_your_stripe_public_key
ENV VITE_API_URL=${VITE_API_URL}
ENV VITE_STRIPE_PUBLIC_KEY=${VITE_STRIPE_PUBLIC_KEY}
RUN npm run build


FROM node:20-bookworm-slim AS runtime

RUN apt-get update \
  && apt-get install -y --no-install-recommends nginx postgresql \
  && rm -rf /var/lib/apt/lists/* \
  && rm -f /etc/nginx/sites-enabled/default /etc/nginx/conf.d/default.conf

WORKDIR /app

COPY --from=backend-build /app/backend /app/backend
COPY --from=frontend-build /app/frontend/dist /usr/share/nginx/html

RUN mkdir -p /app/backend/uploads /var/data/postgres

RUN cat <<'EOF' > /app/start.sh
#!/bin/sh
set -e

: "${PORT:=10000}"
: "${POSTGRES_USER:=grindspot}"
: "${POSTGRES_PASSWORD:=grindspot_password}"
: "${POSTGRES_DB:=grindspot}"
: "${POSTGRES_PORT:=5432}"
: "${POSTGRES_DATA_DIR:=/var/data/postgres}"
: "${RUN_MIGRATIONS:=true}"
: "${AUTO_SEED:=false}"

if [ -z "${DATABASE_URL}" ]; then
  export DATABASE_URL="postgresql://${POSTGRES_USER}:${POSTGRES_PASSWORD}@127.0.0.1:${POSTGRES_PORT}/${POSTGRES_DB}"
fi

PG_BIN_DIR="$(dirname "$(find /usr/lib/postgresql -maxdepth 2 -type f -name pg_ctl | sort -V | tail -n 1)")"
if [ -z "${PG_BIN_DIR}" ] || [ ! -x "${PG_BIN_DIR}/pg_ctl" ]; then
  echo "PostgreSQL binaries not found."
  exit 1
fi

mkdir -p "${POSTGRES_DATA_DIR}"
chown -R postgres:postgres "${POSTGRES_DATA_DIR}"

if [ ! -f "${POSTGRES_DATA_DIR}/PG_VERSION" ]; then
  runuser -u postgres -- "${PG_BIN_DIR}/initdb" -D "${POSTGRES_DATA_DIR}" --encoding=UTF8 --locale=C
fi

runuser -u postgres -- "${PG_BIN_DIR}/pg_ctl" -D "${POSTGRES_DATA_DIR}" -o "-c listen_addresses=127.0.0.1 -p ${POSTGRES_PORT}" -w start

runuser -u postgres -- "${PG_BIN_DIR}/psql" -v ON_ERROR_STOP=1 postgres <<SQL
DO \$\$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_roles WHERE rolname = '${POSTGRES_USER}') THEN
    CREATE ROLE "${POSTGRES_USER}" LOGIN PASSWORD '${POSTGRES_PASSWORD}';
  ELSE
    ALTER ROLE "${POSTGRES_USER}" WITH LOGIN PASSWORD '${POSTGRES_PASSWORD}';
  END IF;
END
\$\$;
SELECT 'CREATE DATABASE "${POSTGRES_DB}" OWNER "${POSTGRES_USER}"'
WHERE NOT EXISTS (SELECT FROM pg_database WHERE datname = '${POSTGRES_DB}') \gexec
GRANT ALL PRIVILEGES ON DATABASE "${POSTGRES_DB}" TO "${POSTGRES_USER}";
SQL

cd /app/backend
if [ "${RUN_MIGRATIONS}" = "true" ]; then
  npx prisma migrate deploy
fi

if [ "${AUTO_SEED}" = "true" ]; then
  npm run database
fi

PORT=5000 node dist/server.js &

cat > /etc/nginx/conf.d/default.conf <<NGINX
server {
  listen ${PORT};
  listen [::]:${PORT};
  server_name _;

  root /usr/share/nginx/html;
  index index.html;

  location /api {
    proxy_pass http://127.0.0.1:5000;
    proxy_http_version 1.1;
    proxy_set_header Host \$host;
    proxy_set_header X-Real-IP \$remote_addr;
    proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
    proxy_set_header X-Forwarded-Proto \$scheme;
  }

  location /docs {
    proxy_pass http://127.0.0.1:5000;
    proxy_http_version 1.1;
    proxy_set_header Host \$host;
    proxy_set_header X-Real-IP \$remote_addr;
    proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
    proxy_set_header X-Forwarded-Proto \$scheme;
  }

  location /health {
    proxy_pass http://127.0.0.1:5000;
    proxy_http_version 1.1;
    proxy_set_header Host \$host;
    proxy_set_header X-Real-IP \$remote_addr;
    proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
    proxy_set_header X-Forwarded-Proto \$scheme;
  }

  location /uploads {
    proxy_pass http://127.0.0.1:5000;
    proxy_http_version 1.1;
    proxy_set_header Host \$host;
    proxy_set_header X-Real-IP \$remote_addr;
    proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
    proxy_set_header X-Forwarded-Proto \$scheme;
  }

  location / {
    try_files \$uri \$uri/ /index.html;
  }
}
NGINX

exec nginx -g 'daemon off;'
EOF
RUN chmod +x /app/start.sh

ENV NODE_ENV=production
EXPOSE 10000

CMD ["/app/start.sh"]
