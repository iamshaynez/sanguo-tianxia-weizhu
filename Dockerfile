# 构建期产出内容哈希静态资源;运行期用 node 同进程托管静态 + /ws 网战网关。
# 单人模式仍是纯静态 dist:任何静态服务器都能跑;本镜像只是"静态 + 网战"的并集。
FROM node:24-alpine AS build
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci
COPY index.html style.css manifest.webmanifest sw.js ./
COPY src/ src/
COPY assets/ assets/
COPY scripts/build.mjs scripts/build.mjs
RUN npm run build

FROM node:24-alpine
ARG APP_VERSION=1.0.0
ARG APP_COMMIT=unknown
ENV NODE_ENV=production APP_VERSION=$APP_VERSION APP_COMMIT=$APP_COMMIT PORT=80
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci --omit=dev && npm cache clean --force
COPY --from=build /app/dist/ ./dist/
COPY server/ ./server/
COPY src/ ./src/
# 网战房间快照(可选):挂 /data 即获得重启恢复能力;不挂则纯内存运行
ENV ONLINE_DATA=/data/rooms.json
VOLUME ["/data"]
EXPOSE 80
HEALTHCHECK --interval=30s --timeout=3s CMD wget -qO- http://127.0.0.1:80/healthz || exit 1
CMD ["node", "server/index.mjs"]
