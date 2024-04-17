
FROM nginx:latest

# Copy the built React app from the build stage to the NGINX html directory
COPY /public /usr/share/nginx/html

# Expose port 80
EXPOSE 80

# Start NGINX when the container starts
CMD ["nginx", "-g", "daemon off;"]