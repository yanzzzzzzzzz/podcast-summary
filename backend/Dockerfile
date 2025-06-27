FROM node:20

WORKDIR /app

COPY package.json package-lock.json ./

RUN npm install

RUN apt-get update && apt-get install -y ffmpeg

COPY . .

RUN npm run build

RUN mkdir -p uploads

EXPOSE 3456

CMD ["npm", "start"] 