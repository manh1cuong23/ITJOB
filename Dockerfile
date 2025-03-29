# 2. For Nginx setup
FROM nginx:alpine
WORKDIR /usr/share/nginx/html
RUN rm -rf ./*
# Copy config nginx
COPY ./dist .
COPY ./nginx.conf /etc/nginx/conf.d/default.conf

# Containers run nginx with global directives and daemon off
ENTRYPOINT ["nginx", "-g", "daemon off;"]