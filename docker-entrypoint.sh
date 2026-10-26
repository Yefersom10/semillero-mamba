#!/bin/sh
# Arranca backend y frontend; si uno cae, el contenedor termina.

cd /app/back
if [ -f dist/main.js ]; then
  node dist/main.js &
else
  node dist/src/main.js &
fi

cd /app/front
PORT=3001 HOSTNAME=0.0.0.0 node server.js &

wait -n
exit $?
