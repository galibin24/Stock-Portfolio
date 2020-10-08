FROM node:12.7-alpine AS compile-image

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm install

COPY . ./
RUN npm run build -- --prod

FROM nginx:alpine
COPY nginx.conf /etc/nginx/nginx.conf
COPY --from=compile-image /app/dist/Stock-Portfolio /usr/share/nginx/html

