# backend/Dockerfile
FROM node:18-alpine

# Set working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies (including devDependencies for nodemon in case needed)
RUN npm install

# Copy the rest of the application code
COPY . .

# Expose the port your backend listens on
EXPOSE 5001

# Set NODE_ENV to production by default
ENV NODE_ENV=production

# Start the server using the start script (includes instrument.mjs for Sentry)
CMD ["npm", "start"]
