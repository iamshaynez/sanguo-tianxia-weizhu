# 构建期把核心代码、按需章节和样式输出为内容哈希文件;运行期仍只是静态 Nginx。
FROM node:24-alpine AS build
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci
COPY index.html style.css ./
COPY src/ src/
COPY assets/ assets/
COPY scripts/build.mjs scripts/build.mjs
RUN npm run build

FROM nginx:alpine
ARG APP_VERSION=1.0.0
ARG APP_COMMIT=unknown
ENV APP_VERSION=$APP_VERSION APP_COMMIT=$APP_COMMIT

COPY docker/nginx.conf /etc/nginx/conf.d/default.conf
COPY docker/entrypoint.sh /usr/local/bin/entrypoint.sh
RUN chmod +x /usr/local/bin/entrypoint.sh
COPY --from=build /app/dist/ /usr/share/nginx/html/

EXPOSE 80
ENTRYPOINT ["/usr/local/bin/entrypoint.sh"]
