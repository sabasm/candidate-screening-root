FROM node:18-alpine

WORKDIR /app

COPY app/package*.json ./app/
RUN cd app && npm install

COPY app ./app

EXPOSE 3000

WORKDIR /app/app
CMD ["npm", "run", "dev"]


