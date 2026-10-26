#!/bin/sh
# 容器启动时写入版本信息;时间戳表示本次 Nginx 启动,而非镜像构建。
set -eu
APP_VERSION="${APP_VERSION:-1.0.0}"
APP_COMMIT="${APP_COMMIT:-unknown}"
STARTED_AT="$(date -u +'%Y-%m-%dT%H:%M:%SZ')"
printf '%s\n' "{\"version\":\"${APP_VERSION}\",\"commit\":\"${APP_COMMIT}\",\"startedAt\":\"${STARTED_AT}\"}" > /usr/share/nginx/html/runtime.json

# 入口改写到部署命名空间 /v2/src/(:fixed 与 nginx.conf 的 alias 对应)。
# 目的:绕过 CF 边缘在旧缓存策略时代存下的 /src/* 对象(浏览器 TTL ~186 天,
# 源站改 no-store 救不了已入库的 HIT)。相对导入会跟着落在 /v2/src/ 下,
# 全部模块 URL 从此是"从未被缓存过"的新 URL;旧对象无人访问,自然废弃。
# 再次遇到同类缓存困境时,把 v2 升到 v3 并同步 nginx.conf 的 location。
sed -i 's#\./src/main\.js#./v2/src/main.js#g' /usr/share/nginx/html/index.html

# 样式表带部署版本号:style.css 与 /src/* 同病——no-store 之前的时代可能
# 被 CF 边缘/浏览器按 ~186 天 TTL 存了旧对象。URL 注入 ?v=commit 后每次
# 部署都是全新 URL,任何层压着的旧副本立即作废(手机 Chrome 也不例外)。
sed -i "s#\./style\.css#./style.css?v=${APP_COMMIT}#g" /usr/share/nginx/html/index.html

exec nginx -g 'daemon off;'
