#!/bin/sh
# entrypoint.sh for UI container

# Exit immediately if a command exits with a non-zero status.
set -e

# Get the root directory for Nginx
ROOT_DIR=/usr/share/nginx/html

# Replace the placeholder __API_URL__ with the value of the
# environment variable API_URL in the config.js file.
# The 'g' flag ensures all occurrences are replaced.
# The default value "http://localhost:3000/api/v1" is used if API_URL is not set.
sed -i "s|__API_URL__|${API_URL:-http://localhost:3000/api/v1}|g" $ROOT_DIR/config.js

# Print the replaced value for debugging purposes
echo "UI Entrypoint: Set API_URL to ${API_URL:-http://localhost:3000/api/v1}"

# Start Nginx in the foreground
exec nginx -g 'daemon off;'