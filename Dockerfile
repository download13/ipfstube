FROM nginx:1.10.3-alpine

RUN mkdir /etc/nginx/certs
COPY nginx.conf /etc/nginx/nginx.conf
COPY public/ /etc/nginx/public/
