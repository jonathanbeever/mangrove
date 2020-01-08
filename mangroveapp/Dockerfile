FROM node:10-alpine

WORKDIR /

COPY package*.json /

RUN npm install

COPY . .

CMD ["npm", "run", "start"]