# 单体部署：纯静态前端（原生 ESM，无构建步骤），nginx 直出。
# 镜像构建推送在服务器侧完成（见 docker/build-remote.sh），CI 只传 commit sha。
FROM nginx:alpine

COPY docker/nginx.conf /etc/nginx/conf.d/default.conf
COPY index.html style.css /usr/share/nginx/html/
COPY src/ /usr/share/nginx/html/src/
COPY assets/ /usr/share/nginx/html/assets/

EXPOSE 80
