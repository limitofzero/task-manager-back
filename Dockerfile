FROM node:14.16.0-alpine3.10

RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app
COPY package.json .
COPY package-lock.json .

RUN npm ci

COPY . .
