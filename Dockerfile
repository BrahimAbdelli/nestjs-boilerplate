# Base image
FROM node:14-alpine

# Set the working directory
WORKDIR /app

# Copy package.json and package-lock.json to the working directory
COPY package*.json ./

# Install dependencies
RUN npm ci --only=production

# Copy the rest of the application code
COPY . .

# Set environment variables (if necessary)
# ENV PORT=3000

# Expose the port (if necessary)
# EXPOSE 3000

# Run the tests
# RUN npm test

# Start the application
CMD [ "npm", "start" ]