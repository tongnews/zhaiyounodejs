FROM node
MAINTAINER SHANG xinshangshangxin@gmail.com

# Build app
RUN mkdir -p /usr/src/server
WORKDIR /usr/src/server
COPY . /usr/src/server

# RUN npm install --production

EXPOSE 80
CMD [ "node","server.js"]