#!/bin/sh
set -e
ROOT_DIR=/usr/share/nginx/html
TARGET_FILE=$ROOT_DIR/index.html
# This sed command finds the __API_URL__ placeholder injected by the Vite plugin
# during the production build and replaces it with the real environment variable.
sed -i "s|__API_URL__|${API_URL:-http://localhost:3000/api/v1}|g" $TARGET_FILE
echo "UI Entrypoint: Set API_URL to ${API_URL:-http://localhost:3000/api/v1} in $TARGET_FILE"
exec nginx -g 'daemon off;'