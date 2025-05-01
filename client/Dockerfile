FROM node:23-alpine

WORKDIR /app

COPY package.json /app

RUN npm install

COPY . /app

EXPOSE 5173

CMD ["npm", "run", "dev"]
