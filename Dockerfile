# IMPORTANT FILE: Needs for entire Full Stack App to go LIVE on "Render.com"

FROM node:20-bookworm-slim AS backend-build

WORKDIR /app/backend

COPY backend/package*.json ./
RUN npm ci

COPY backend/. ./
RUN npx prisma generate
RUN npm run build


FROM node:20-bookworm-slim AS frontend-build

WORKDIR /app/frontend

COPY frontend/package*.json ./
RUN npm ci

COPY frontend/. ./
ARG VITE_API_URL=/api
ARG VITE_STRIPE_PUBLIC_KEY=pk_test_grindspot_publishable_key_change_me
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
: "${USE_EMBEDDED_POSTGRES:=true}"

if [ "${USE_EMBEDDED_POSTGRES}" = "true" ]; then
  ENC_POSTGRES_USER="$(node -e 'process.stdout.write(encodeURIComponent(process.argv[1] ?? ""))' "${POSTGRES_USER}")"
  ENC_POSTGRES_PASSWORD="$(node -e 'process.stdout.write(encodeURIComponent(process.argv[1] ?? ""))' "${POSTGRES_PASSWORD}")"
  export DATABASE_URL="postgresql://${ENC_POSTGRES_USER}:${ENC_POSTGRES_PASSWORD}@127.0.0.1:${POSTGRES_PORT}/${POSTGRES_DB}"
elif [ -z "${DATABASE_URL}" ]; then
  echo "DATABASE_URL is required when USE_EMBEDDED_POSTGRES is false."
  exit 1
fi

PG_BIN_DIR="$(dirname "$(find /usr/lib/postgresql -maxdepth 4 -type f -name pg_ctl | sort -V | tail -n 1)")"
if [ -z "${PG_BIN_DIR}" ] \
  || [ ! -x "${PG_BIN_DIR}/pg_ctl" ] \
  || [ ! -x "${PG_BIN_DIR}/initdb" ] \
  || [ ! -x "${PG_BIN_DIR}/psql" ]; then
  echo "PostgreSQL binaries not found."
  exit 1
fi

mkdir -p "${POSTGRES_DATA_DIR}"
chown -R postgres:postgres "${POSTGRES_DATA_DIR}"

if [ ! -f "${POSTGRES_DATA_DIR}/PG_VERSION" ]; then
  runuser -u postgres -- "${PG_BIN_DIR}/initdb" -D "${POSTGRES_DATA_DIR}" --encoding=UTF8 --locale=C
fi

runuser -u postgres -- "${PG_BIN_DIR}/pg_ctl" -D "${POSTGRES_DATA_DIR}" -o "-c listen_addresses=127.0.0.1 -p ${POSTGRES_PORT}" -w start

SQL_POSTGRES_USER_IDENT="$(printf "%s" "${POSTGRES_USER}" | sed 's/"/""/g')"
SQL_POSTGRES_USER_LIT="$(printf "%s" "${POSTGRES_USER}" | sed "s/'/''/g")"
SQL_POSTGRES_PASSWORD_LIT="$(printf "%s" "${POSTGRES_PASSWORD}" | sed "s/'/''/g")"
SQL_POSTGRES_DB_IDENT="$(printf "%s" "${POSTGRES_DB}" | sed 's/"/""/g')"
SQL_POSTGRES_DB_LIT="$(printf "%s" "${POSTGRES_DB}" | sed "s/'/''/g")"

runuser -u postgres -- "${PG_BIN_DIR}/psql" -v ON_ERROR_STOP=1 postgres <<SQL
DO \$\$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_roles WHERE rolname = '${SQL_POSTGRES_USER_LIT}') THEN
    CREATE ROLE "${SQL_POSTGRES_USER_IDENT}" LOGIN PASSWORD '${SQL_POSTGRES_PASSWORD_LIT}';
  ELSE
    ALTER ROLE "${SQL_POSTGRES_USER_IDENT}" WITH LOGIN PASSWORD '${SQL_POSTGRES_PASSWORD_LIT}';
  END IF;
END
\$\$;
SELECT 'CREATE DATABASE "${SQL_POSTGRES_DB_IDENT}" OWNER "${SQL_POSTGRES_USER_IDENT}"'
WHERE NOT EXISTS (SELECT FROM pg_database WHERE datname = '${SQL_POSTGRES_DB_LIT}') \gexec
GRANT ALL PRIVILEGES ON DATABASE "${SQL_POSTGRES_DB_IDENT}" TO "${SQL_POSTGRES_USER_IDENT}";
SQL

cd /app/backend
if [ "${RUN_MIGRATIONS}" = "true" ]; then
  npx prisma migrate deploy
fi

if [ "${AUTO_SEED}" = "true" ]; then
  npm run database
fi

PORT=5000 node dist/server.js &
BACKEND_PID=$!
sleep 3
if ! kill -0 "${BACKEND_PID}" 2>/dev/null; then
  echo "Backend failed to start. Check logs above for startup errors."
  exit 1
fi

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
