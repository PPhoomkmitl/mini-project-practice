# Use the official Node.js image
FROM node:14-alpine

# Set the working directory
WORKDIR / 

# Copy package.json and package-lock.json
COPY package*.json .

# Install dependencies
RUN npm install

# Copy the application code
COPY . ./

# Expose port 5000 (or the port your application is running on)
EXPOSE 5000

# Start the Express.js application
CMD ["npm", "run" , "dev" , "--localhost" , "0.0.0.0" ]
