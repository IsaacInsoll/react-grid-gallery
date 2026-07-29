#!/usr/bin/env sh

set -eu

image='mcr.microsoft.com/playwright:v1.62.0-noble@sha256:baed2032d533817f3dbe6425de795788430ba345e819a1201337009ba17c9d07'
npm_script="${1:-test:browser}"

docker run \
  --rm \
  --init \
  --ipc=host \
  --env CI \
  --user "$(id -u):$(id -g)" \
  --volume "$PWD:/work" \
  --workdir /work \
  "$image" \
  npm run "$npm_script"
