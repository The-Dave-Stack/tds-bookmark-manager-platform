# Stage 1: Build the React application
FROM node:22-alpine AS builder

WORKDIR /app

# Copy root package files and install all dependencies
COPY package.json package-lock.json ./
COPY nx.json ./
COPY tsconfig.base.json ./
RUN npm install

# Copy the entire monorepo source code
COPY . .

# Build the tds-bookmark-manager-ui application
RUN VITE_USE_MOCK_API=false npx nx run @tds/tds-bookmark-manager-ui:build

# Stage 2: Serve the application with Nginx
FROM nginx:1.27-alpine

# Copy the built static files from the builder stage
COPY --from=builder /app/apps/ui/tds-bookmark-manager-ui/dist /usr/share/nginx/html

# Copy the Nginx entrypoint script
COPY apps/ui/tds-bookmark-manager-ui/docker/entrypoint.sh /docker-entrypoint.sh
RUN chmod +x /docker-entrypoint.sh

# When the container starts, it will first run the entrypoint script
ENTRYPOINT ["/docker-entrypoint.sh"]

# The command passed to the entrypoint script is to start nginx
CMD ["nginx", "-g", "daemon off;"]