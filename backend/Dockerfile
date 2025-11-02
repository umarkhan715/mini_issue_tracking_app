# Use Node.js 20 official image
FROM node:20-alpine

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install all dependencies (including dev dependencies for build)
RUN npm ci --ignore-scripts

# Copy source code
COPY . .

# Set a dummy DATABASE_URL for build process
ENV DATABASE_URL="postgresql://user:pass@localhost:5432/db"

# Generate Prisma client
RUN npx prisma generate

# Build the application
RUN npm run build

# Remove dev dependencies after build
RUN npm prune --omit=dev

# Unset the dummy DATABASE_URL
ENV DATABASE_URL=""

# Expose port
EXPOSE 3001

# Start the application
CMD ["npm", "start"]