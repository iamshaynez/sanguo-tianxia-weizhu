# 单体部署：纯静态前端（原生 ESM，无构建步骤），nginx 直出。
# 镜像构建推送在服务器侧完成（见 docker/build-remote.sh），CI 只传 commit sha。
FROM nginx:alpine

ARG APP_VERSION=1.0.0
ARG APP_COMMIT=unknown
ENV APP_VERSION=$APP_VERSION APP_COMMIT=$APP_COMMIT

COPY docker/nginx.conf /etc/nginx/conf.d/default.conf
COPY docker/entrypoint.sh /usr/local/bin/entrypoint.sh
RUN chmod +x /usr/local/bin/entrypoint.sh
COPY index.html style.css /usr/share/nginx/html/
COPY src/ /usr/share/nginx/html/src/
COPY assets/ /usr/share/nginx/html/assets/

EXPOSE 80
ENTRYPOINT ["/usr/local/bin/entrypoint.sh"]
