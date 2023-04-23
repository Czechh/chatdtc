FROM --platform=linux/amd64 node:18-bullseye-slim

WORKDIR /app

COPY ["package.json", "package-lock.json*", "./"]

RUN npm install && mv node_modules ../

COPY . .

EXPOSE 8080

RUN npm install -g nodemon

CMD npm start
