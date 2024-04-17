# Stage 1: Build the React app
FROM node:latest as build-stage

# Set working directory
WORKDIR /app

# Copy package.json and package-lock.json (if available)
COPY package*.json ./

# Install dependencies
RUN yarn install --frozen-lockfile

# Copy the rest of the application code
COPY . .

# Build the React app
RUN yarn run build

# Stage 2: Serve the built React app using NGINX
FROM nginx:latest

# Copy the built React app from the build stage to the NGINX html directory
COPY --from=build-stage /public /usr/share/nginx/html

# Expose port 80
EXPOSE 80

# Start NGINX when the container starts
CMD ["nginx", "-g", "daemon off;"]