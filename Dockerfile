# Stage 1: Build the React app
FROM node:16-alpine as build-stage



# Copy the rest of the application code
COPY . .

# Install dependencies
RUN npm install --force

# Build the React app
RUN npm run build

# Stage 2: Serve the built React app using NGINX
FROM nginx:latest

# Remove default NGINX website
RUN rm -rf /usr/share/nginx/html/*

# Copy the built React app from the build stage to the NGINX html directory
COPY --from=build-stage /app/build/ /usr/share/nginx/html

# Create NGINX configuration to handle React Router routes
RUN echo " \
server { \
    listen 80; \
    server_name localhost; \
    location / { \
        root /usr/share/nginx/html; \
        try_files \$uri /index.html; \
    } \
}" > /etc/nginx/conf.d/default.conf


# Expose port 80
EXPOSE 80

# Start NGINX when the container starts
CMD ["nginx", "-g", "daemon off;"]