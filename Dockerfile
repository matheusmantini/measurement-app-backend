FROM node:20

WORKDIR /usr/src/app

COPY package*.json ./
COPY .env .env

RUN npm install

COPY tsconfig.json ./
COPY prisma ./prisma
COPY src ./src

RUN npm run build

COPY start.sh /usr/src/app/start.sh
RUN chmod +x /usr/src/app/start.sh

EXPOSE 5000 

CMD ["/usr/src/app/start.sh"]
