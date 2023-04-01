FROM node:19.8
WORKDIR /app
COPY package.json .
RUN npm install
COPY . .
## EXPOSE [Port that is  mentioned in the vite.config file]
EXPOSE 5173
CMD ["npm", "run", "dev"]
