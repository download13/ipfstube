FROM nginx:alpine:3.4

RUN mkdir /etc/nginx/certs
COPY nginx.conf /etc/nginx/nginx.conf
COPY public/ /etc/nginx/public/
