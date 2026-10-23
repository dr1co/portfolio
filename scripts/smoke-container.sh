#!/usr/bin/env bash
# Smoke-tests the production image: waits for a healthy container, checks it doesn't run as
# root, then runs the @smoke Playwright checks against it, expecting the image's own commit.
#
# Usage: scripts/smoke-container.sh [image]
#   Without an image, builds one from the working tree tagged portfolio:smoke.
#   SMOKE_PORT (default 3200) is the host port.
set -euo pipefail

cd "$(dirname "$0")/.."
image="${1:-}"
port="${SMOKE_PORT:-3200}"
name="portfolio-smoke-$$"

if [[ -z "$image" ]]; then
  image="portfolio:smoke"
  echo "Building $image"
  docker build --build-arg COMMIT_SHA="$(git rev-parse HEAD)" -t "$image" .
fi

cleanup() { docker rm -f "$name" >/dev/null 2>&1 || true; }
trap cleanup EXIT

docker run -d --name "$name" -p "$port:3000" "$image" >/dev/null

echo "Waiting for $name to become healthy"
for _ in $(seq 1 30); do
  status="$(docker inspect -f '{{.State.Health.Status}}' "$name")"
  [[ "$status" == "healthy" ]] && break
  if [[ "$status" == "unhealthy" ]] || [[ "$(docker inspect -f '{{.State.Running}}' "$name")" != "true" ]]; then
    docker logs "$name"
    echo "Container is $status" >&2
    exit 1
  fi
  sleep 2
done
if [[ "$status" != "healthy" ]]; then
  docker logs "$name"
  echo "Container did not become healthy in time" >&2
  exit 1
fi

if [[ "$(docker exec "$name" id -u)" == "0" ]]; then
  echo "Container runs as root" >&2
  exit 1
fi

revision="$(docker inspect -f '{{ index .Config.Labels "org.opencontainers.image.revision" }}' "$image")"
BASE_URL="http://localhost:$port" EXPECTED_SHA="$revision" npm run test:smoke
