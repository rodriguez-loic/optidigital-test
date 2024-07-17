FROM node:lts-alpine

# install a simple server to serve some basic static content
RUN npm install -g http-server

# set "app" folder as working directory
WORKDIR /app

# copy 'package.json' and 'package-lock.json' (if available)
COPY package*.json ./

# install project dependencies
RUN npm install

# copy project files and directories in the corking directory (eg: 'app' directory)
COPY . .

# Build app for production (with minification)
RUN npm run build

RUN chown -R node:node node_modules
RUN chown -R node:node dist

EXPOSE 8080
CMD [ "http-server", "dist", "-S", "-C", "cert.pem", "-o" ]
