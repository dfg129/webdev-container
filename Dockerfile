#DOCKER_VERSION 1.1.2

FROM ubuntu:14.04

RUN apt-get update

RUN apt-get install -y nodejs npm git git-core

ADD package.json /tmp/package.json

ADD gulpfile.js /tmp/gulpfile.js

RUN cd /tmp && npm install

RUN sudo npm install -g gulp

RUN ln -s /usr/bin/nodejs /usr/bin/node

EXPOSE 3000

WORKDIR /tmp

CMD ["gulp"]

