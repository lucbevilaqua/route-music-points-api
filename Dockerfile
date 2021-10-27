FROM node:12

WORKDIR /usr/src/app

COPY package*.json ./

RUN yarn

COPY . .

EXPOSE 8888
CMD [ "yarn", "start:devwithswagger" ]