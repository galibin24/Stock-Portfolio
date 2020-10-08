# FROM node:12.7-alpine AS compile-image

# WORKDIR /app

# COPY package.json package-lock.json ./
# RUN npm install

# COPY . ./
# RUN npm run build -- --prod

FROM nginx:alpine

COPY ../letsencrypt/live/nikitagalibinstocks.tk /etc/nginx/certs
COPY ../Stock-Portfolio/nginx.conf /etc/nginx/nginx.conf
COPY ../Stock-Portfolio/dist/Stock-Portfolio /usr/share/nginx/html

EXPOSE 443
EXPOSE 80