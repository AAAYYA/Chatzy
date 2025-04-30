#!/bin/bash

SERVER_USER=nubbly
SERVER_IP=157.180.77.152

echo "➡️ Déploiement de Nubbly en cours..."

ssh -t $SERVER_USER@$SERVER_IP << 'ENDSSH'
  set -e

  echo "🔑 Chargement de l'agent SSH"
  export SSH_AUTH_SOCK=$(find /tmp/ssh-* -name agent.\* | head -n 1 || true)

  echo "📥 Pull du code..."
  cd /home/nubbly/Nubbly
  git reset --hard
  git pull origin main

  echo "🔧 Ajout de Bun au PATH"
  export BUN_INSTALL="$HOME/.bun"
  export PATH="$BUN_INSTALL/bin:$PATH"

  echo "📦 Backend : install & restart"
  cd server
  bun install
  pm2 restart nubbly-backend || pm2 start src/index.ts --name nubbly-backend

  echo "🧱 Frontend : install & build"
  cd ../client
  bun install
  bun run build

  echo "✅ Déploiement terminé."
ENDSSH
