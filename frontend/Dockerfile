# frontend/Dockerfile
# Stage 1: Build the React application
FROM node:18-alpine as build

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code
COPY . .

# Accept build arguments for environment variables
ARG VITE_CLERK_PUBLISHABLE_KEY
ARG VITE_STREAM_API_KEY
ARG VITE_SENTRY_DSN
ARG VITE_API_BASE_URL

# Set environment variables for build
ENV VITE_CLERK_PUBLISHABLE_KEY=$VITE_CLERK_PUBLISHABLE_KEY
ENV VITE_STREAM_API_KEY=$VITE_STREAM_API_KEY
ENV VITE_SENTRY_DSN=$VITE_SENTRY_DSN
ENV VITE_API_BASE_URL=$VITE_API_BASE_URL

# Build the static assets with Vite
RUN npm run build

# Stage 2: Serve the static assets with nginx
FROM nginx:alpine

# Copy built assets from build stage to nginx html directory
COPY --from=build /app/dist /usr/share/nginx/html

# Copy custom nginx configuration for React Router support
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expose port 80
EXPOSE 80

# Start nginx
CMD ["nginx", "-g", "daemon off;"]
