#syntax=docker/dockerfile:2

FROM node:17.6.0

ENV NODE_ENV=production

WORKDIR home/container/src

COPY ["package.json", "package-lock.json", "./"]

RUN npm install --production

COPY . .

CMD ["node", "."]