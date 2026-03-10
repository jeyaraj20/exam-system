FROM node:18

WORKDIR /app

COPY package*.json /app/

RUN npm install

COPY . /app

EXPOSE 10000

CMD ["node","index.js"]