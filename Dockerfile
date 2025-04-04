# Use an official Node.js runtime as a parent image
FROM node:16-alpine

# Set the working directory in the container
WORKDIR /app

# Install dependencies
COPY ./pipeline_management_system/package*.json ./

# Ensure you are using npm 8.19.4
RUN npm install -g npm@8.19.4

# Install project dependencies
RUN npm install --legacy-peer-deps

# Copy the rest of the application code
COPY ./pipeline_management_system/ .
COPY .env /app/

# Expose the app on a specific port
EXPOSE 32001

# Start the React app
CMD ["npm", "start"]