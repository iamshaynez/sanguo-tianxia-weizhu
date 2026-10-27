#!/bin/sh
# 容器启动时写入版本信息;时间戳表示本次 Nginx 启动,而非镜像构建。
set -eu
APP_VERSION="${APP_VERSION:-1.0.0}"
APP_COMMIT="${APP_COMMIT:-unknown}"
STARTED_AT="$(date -u +'%Y-%m-%dT%H:%M:%SZ')"
printf '%s\n' "{\"version\":\"${APP_VERSION}\",\"commit\":\"${APP_COMMIT}\",\"startedAt\":\"${STARTED_AT}\"}" > /usr/share/nginx/html/runtime.json

# HTML 不缓存, hashed JS/CSS 与头像长期缓存;新部署由新 HTML 引用新哈希。
exec nginx -g 'daemon off;'
