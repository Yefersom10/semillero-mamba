#!/bin/sh
# Arranca backend y frontend; si uno cae, el contenedor termina.

cd /app/back
if [ -f dist/main.js ]; then
  node dist/main.js &
else
  node dist/src/main.js &
fi

cd /app/front
node node_modules/next/dist/bin/next start -p 3001 -H 0.0.0.0 &

wait -n
exit $?
