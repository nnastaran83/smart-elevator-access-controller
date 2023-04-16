FROM node:19.8
WORKDIR /app
# Copy package.json and package-lock.json (if available) into the working directory
COPY package*.json ./
# Install dependencies
RUN npm ci
COPY . .
# Build the Vite React app
RUN npm run build
## EXPOSE [Port that is  mentioned in the vite.config file]
EXPOSE 5173
# Start the Vite production server
CMD ["npm", "run", "dev"]
