#!/bin/bash
cd "$(dirname "$0")"
echo "🚀 Iniciando MaxChat..."

# Build client if needed
if [ ! -d "client/dist" ]; then
  echo "📦 Building client..."
  cd client && npm install && npm run build && cd ..
fi

# Start server
node server/index.js