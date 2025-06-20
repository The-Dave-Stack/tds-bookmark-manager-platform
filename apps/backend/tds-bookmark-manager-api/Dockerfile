# Stage 1: Build the application
FROM node:22-alpine AS builder

WORKDIR /app

# Copy root package files and install all dependencies (npm workspaces)
COPY package.json package-lock.json ./
COPY nx.json ./
COPY tsconfig.base.json ./
RUN npm install

# Copy the entire monorepo source code
COPY . .

# Build the tds-bookmark-manager-api application
RUN npx nx run @tds/tds-bookmark-manager-api:build:docker

# Stage 2: Create the final production image
FROM node:22-alpine

WORKDIR /app

# Install netcat (nc) for health checks/wait scripts
RUN apk add --no-cache netcat-openbsd

# Copy only the necessary build artifacts from the builder stage
COPY --from=builder /app/apps/backend/tds-bookmark-manager-api/dist ./dist
COPY package.json package-lock.json ./
COPY nx.json ./

# Install only production dependencies
RUN npm install --omit=dev

ENV NODE_ENV=docker

# Expose the application port
EXPOSE 3000

# MODIFIED: Set the entrypoint directly to the node process.
# The command's arguments are specified in the CMD instruction.
ENTRYPOINT ["node"]

# The default command arguments to run when the container starts
CMD ["dist/main.js"]