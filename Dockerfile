#syntax=docker/dockerfile:1.2

FROM node:17.7.0

ENV NODE_ENV=production

WORKDIR /src

COPY ["package.json", "package-lock.json", "yarn.lock", "./"]

#RUN yarn install #
RUN yarn install --immutable

COPY . .

CMD ["node", "."]