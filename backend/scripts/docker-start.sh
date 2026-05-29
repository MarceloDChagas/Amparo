#!/bin/sh
set -eu

MAX_RETRIES=20
RETRY_DELAY=3

attempt=1
until prisma db push; do
  if [ "$attempt" -ge "$MAX_RETRIES" ]; then
    echo "[bootstrap] Database initialization failed after $MAX_RETRIES attempts"
    exit 1
  fi

  echo "[bootstrap] Waiting for database... ($attempt/$MAX_RETRIES)"
  attempt=$((attempt + 1))
  sleep "$RETRY_DELAY"
done

node prisma/seed-admin.js
exec node dist/main
