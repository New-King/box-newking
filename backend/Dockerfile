# 构建上下文为仓库根目录：docker compose -f backend/docker-compose.yml up -d --build
# 第一阶段：构建本仓库 frontend → themes/2024
FROM --platform=$BUILDPLATFORM node:20-alpine AS frontend-builder

ARG VITE_GIT_COMMIT=unknown

RUN corepack enable && corepack prepare pnpm@9.15.9 --activate

WORKDIR /build/frontend

COPY frontend/package.json frontend/pnpm-lock.yaml frontend/.npmrc ./
RUN pnpm install --frozen-lockfile --prod=false

COPY frontend/ .
RUN VITE_GIT_COMMIT="${VITE_GIT_COMMIT}" pnpm run build

# 可选：保留官方 2023 主题（管理后台可切换）
FROM --platform=$BUILDPLATFORM node:20-alpine AS frontend-2023-builder

ARG FRONTEND_2023_REF=main

RUN apk add --no-cache git

WORKDIR /build/fronted-2023
RUN git clone --filter=blob:none --no-checkout https://github.com/vastsa/FileCodeBoxFronted2023.git . && \
    git fetch --depth 1 origin "${FRONTEND_2023_REF}" && \
    git checkout --detach FETCH_HEAD && \
    npm install --legacy-peer-deps && \
    npm run build

# 第二阶段：后端镜像
FROM python:3.12-slim-bookworm

ARG APP_VERSION
ARG VCS_REF=unknown

LABEL author="Lan"
LABEL email="xzu@live.com"
LABEL org.opencontainers.image.version="${APP_VERSION}"
LABEL org.opencontainers.image.revision="${VCS_REF}"

WORKDIR /app

COPY backend/ .

ENV APP_VERSION="${APP_VERSION}"

RUN ln -sf /usr/share/zoneinfo/Asia/Shanghai /etc/localtime && \
    echo 'Asia/Shanghai' > /etc/timezone

COPY --from=frontend-builder /build/frontend/dist ./themes/2024
COPY --from=frontend-2023-builder /build/fronted-2023/dist ./themes/2023

RUN apt-get update \
 && apt-get upgrade -y --no-install-recommends \
 && rm -rf /var/lib/apt/lists/* \
 && pip install --no-cache-dir -r requirements.txt \
 && (pip cache purge || true)

ENV HOST="0.0.0.0" \
    PORT=12345 \
    WORKERS=1 \
    LOG_LEVEL="info" \
    FORWARDED_ALLOW_IPS=""

EXPOSE 12345

CMD ["sh", "-c", "exec uvicorn main:app --host \"$HOST\" --port \"$PORT\" --workers \"$WORKERS\" --log-level \"$LOG_LEVEL\" --proxy-headers --forwarded-allow-ips \"${FORWARDED_ALLOW_IPS:-}\""]
