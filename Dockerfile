#FROM nginx
#COPY dist/ /usr/source-manage-web/nginx/html
#COPY nginx/default.conf /etc/nginx/conf.d/default.conf

# build stage
FROM node:lts-alpine AS build-stage
WORKDIR /app
COPY package*.json ./
RUN npm config set registry https://registry.npm.taobao.org
RUN yarn
COPY . .
RUN npm run build

# production stage
FROM nginx:stable-alpine AS production-stage
ENV DOLLAR="$"
COPY --from=build-stage /app/dist /usr/share/nginx/html
COPY ./nginx.conf.tmpl /etc/nginx/nginx.conf.tmpl
MAINTAINER lidongming <lidm@cloudream.com>
LABEL description="资源管理中心"
CMD envsubst < /etc/nginx/nginx.conf.tmpl > /etc/nginx/nginx.conf && nginx -g 'daemon off;'
