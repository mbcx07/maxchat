#!/bin/bash
cd "$(dirname "$0")"
echo "Iniciando MaxChat..."
node server/index.js &
SERVER_PID=$!
sleep 2
echo "MaxChat corriendo en puerto 3002"
echo "PID: $SERVER_PID"
wait $SERVER_PID