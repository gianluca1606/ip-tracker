# Stage 1: Build the React app
FROM node:16-alpine as build-stage

# Install dependencies
RUN npm install

# Copy the rest of the application code
COPY . .

# Build the React app
RUN npm run build

# Stage 2: Serve the built React app using NGINX
FROM nginx:latest

# Copy the built React app from the build stage to the NGINX html directory
COPY --from=build-stage /build/ /usr/share/nginx/html

# Expose port 80
EXPOSE 80

# Start NGINX when the container starts
CMD ["nginx", "-g", "daemon off;"]