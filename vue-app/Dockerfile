FROM node:lts-alpine

# install a simple server to serve some basic static content
RUN npm install -g http-server

# set "app" folder as working directory
RUN mkdir /app
WORKDIR /app

# copy project files and directories in the corking directory (eg: 'app' directory)
COPY . .

# install project dependencies
RUN npm install

# Build app for production (with minification)
RUN npm run build

EXPOSE 8080
CMD [ "http-server", "dist", "-S", "-C", "cert.pem", "-o" ]
