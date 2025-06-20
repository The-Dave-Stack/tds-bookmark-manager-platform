#!/bin/sh
# migrate.sh

# Exit immediately if a command exits with a non-zero status.
set -e

# Wait for the database to be ready.
# We use a loop and 'nc' (netcat) to check if the port is open.
# The POSTGRES_HOST and POSTGRES_PORT variables will be available from the Docker environment.
echo "Migration container: Waiting for postgres..."
while ! nc -z $POSTGRES_HOST $POSTGRES_PORT; do
  sleep 0.1
done
echo "Migration container: PostgreSQL started."

# Run database migrations.
# TypeORM will connect to the database and apply any pending migrations.
echo "Migration container: Running database migrations..."
npm run typeorm:docker migration:run

echo "Migration container: Migrations finished successfully."