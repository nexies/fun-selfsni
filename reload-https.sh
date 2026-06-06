#!/usr/bin/env sh
set -eu

cd "$(CDPATH= cd -- "$(dirname -- "$0")" && pwd)"

services="$(docker compose ps --services --status running | grep -- '-https$' || true)"

if [ -z "$services" ]; then
  echo "Запущенный HTTPS-контейнер не найден." >&2
  exit 1
fi

for service in $services; do
  echo "Перезагрузка TLS-конфигурации: $service"
  docker compose exec -T "$service" nginx -s reload
done
