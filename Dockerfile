FROM node:13.2-alpine

RUN apk add --no-cache --update \
  python \
  build-base

WORKDIR /var/usr/app

ADD ./package.json yarn.lock ./

RUN yarn install --frozen-lockfile

ADD .env tsconfig.json ./
ADD ./src ./src

RUN yarn build

CMD ["node", "./build/bot.js"]
