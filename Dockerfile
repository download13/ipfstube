FROM nginx:alpine

COPY nginx.conf /etc/nginx/nginx.conf
COPY certs/ /etc/nginx/certs/
COPY public/ /etc/nginx/public/
