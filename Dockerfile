#syntax=docker/dockerfile:1.2

FROM node:18.0.0

ENV NODE_ENV=production

WORKDIR /home/container

# copy config files #
COPY ["package.json", "package-lock.json", "yarn.lock", "./"]

#RUN yarn install #
RUN yarn install --immutable

# copy other files # 
COPY . .

# change workdir to src #
WORKDIR home/container/src

CMD ["node", "src/index.js"]