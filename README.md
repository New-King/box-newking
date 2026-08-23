# box-newking

基于 [FileCodeBox](https://github.com/vastsa/FileCodeBox) 的自托管文件快传服务，计划部署于 `box.new-king.com`。

像取快递一样取文件：无需注册，上传后获得取件码，对方输入即可下载。

## 致谢 / Acknowledgments

This project is based on the excellent work of
[vastsa/FileCodeBox](https://github.com/vastsa/FileCodeBox).
Special thanks to the original author for creating such a useful tool.

前端基于 [vastsa/FileCodeBoxFronted](https://github.com/vastsa/FileCodeBoxFronted)。

### Differences from the original

- UI redesign and optimization
- Additional features (e.g., ...)
- Bug fixes

## 项目结构

```
box-newking/
├── backend/    # FastAPI 后端（源自 FileCodeBox）
├── frontend/   # Vue 3 前端（源自 FileCodeBoxFronted）
└── scripts/    # 开发辅助脚本（不含业务依赖）
```

开发时前后端分离启动；生产部署可将前端 build 产物打包进后端镜像（与官方 Docker 方式一致）。

## 环境要求

- Python **3.12+**
- Node.js **20+**
- pnpm **9+**
- Docker（可选，用于生产部署）

## 本地启动

### 方式 A：一条命令（推荐）

首次请先完成依赖安装：

```bash
# 后端虚拟环境（仅首次）
cd backend
python3.12 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
cd ..

# 前端依赖（仅首次）
cd frontend && pnpm install && cd ..
```

之后在仓库根目录：

```bash
./scripts/dev.sh
```

会同时启动：
- 后端 `http://localhost:12345`
- 前端 `http://localhost:5173`（开发模式，API 走 `frontend/.env.development`）

`scripts/dev.sh` 只是启动脚本，**不引入新的 package 依赖**，前后端依赖仍分别在 `backend/` 和 `frontend/` 里管理。

### 方式 B：分开两个终端

#### 1. 后端

```bash
cd backend
python3.12 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
python main.py
```

后端默认监听 `http://localhost:12345`。

**首次运行**请访问 [http://localhost:12345/setup](http://localhost:12345/setup) 完成管理员初始化。

#### 2. 前端

另开一个终端：

```bash
cd frontend
pnpm install
pnpm dev
```

前端默认监听 `http://localhost:5173`，开发环境 API 地址见 `frontend/.env.development`（默认 `http://localhost:12345`）。

`frontend/.npmrc` 已配置允许 `esbuild` 安装脚本（pnpm 11 需要），clone 后执行 `pnpm install` 即可正常 `pnpm dev`。

### 访问

| 地址 | 说明 |
|------|------|
| http://localhost:5173 | 用户端（发件 / 取件，开发模式） |
| http://localhost:5173/#/admin | 管理端（开发模式） |
| http://localhost:12345 | 后端 API |

## 部署方案（三条流水线）

| 流水线 | 文件 | 触发 | 作用 | 谁用 |
|--------|------|------|------|------|
| **发布镜像** | `docker-image.yml` | push / tag | build 镜像 → 推 Docker Hub | 别人 `docker run`、发版 |
| **镜像部署** | `deploy.yml` | 镜像 build 成功后 | SSH → `docker pull` → 重启 | 用 Hub 镜像更新服务器 |
| **快速部署** | `deploy-fast.yml` | push `main` | GitHub build 前端 → rsync → 服务器只 build 后端 | **日常自用（像 newking）** |

```
学习 / 发版：docker-image → Docker Hub → deploy（慢，标准）
日常自用：  deploy-fast（快，push 即上线）
```

**跑通快速部署后**，建议在 Actions 里 **Disable** 前两条，只留「快速部署」，避免一次 push 触发三套流程。

## Docker 部署（生产，单容器）

官方 [`lanol/filecodebox`](https://hub.docker.com/r/lanol/filecodebox) 是上游预构建镜像；本仓库通过 [`.github/workflows/docker-image.yml`](.github/workflows/docker-image.yml) 自动 build 并推送到 **你自己的 Docker Hub**（镜像名 `你的用户名/box-newking`）。

> **注意**：GitHub Actions 只认仓库根目录的 `.github/workflows/`。`backend/.github/workflows/` 是上游遗留副本，**不会自动运行**。

### 首次配置（一次性）

**A. Docker Hub（给别人 / 标准部署用）**

1. 注册 [Docker Hub](https://hub.docker.com/)，创建 Access Token
2. GitHub → **Settings → Secrets → Actions**，添加：
   - `DOCKER_USERNAME`：Docker Hub 用户名
   - `DOCKER_PASSWORD`：Access Token

**B. 自动部署到你自己的服务器（像 newking）**

在 GitHub Secrets 中再添加（可与 newking 共用同一台服务器）：

| Secret | 说明 |
|--------|------|
| `DEPLOY_KEY` | SSH 私钥（与 newking 相同即可） |
| `SERVER_HOST` | 服务器 IP 或域名 |
| `SERVER_PORT` | SSH 端口，通常 `22` |
| `SERVER_USER` | SSH 用户，如 `root` |

服务器需已存在 Docker 网络 `1panel-network`（1Panel 默认有）。首次部署前在 1Panel 为 `box.new-king.com` 配置反代到 `http://127.0.0.1:12345`。

配置完成后 push 到 `main`：先 build 镜像，再自动部署。也可在 Actions 里手动 **Run workflow** 部署指定 tag。

打正式 tag（需与 `backend/VERSION` 一致）：

```bash
git tag v2.5.4 && git push origin v2.5.4
```

会发布 `你的用户名/box-newking:2.5.4` 和 `:latest`。

### 别人 / 手动：一条命令启动（Docker Hub 镜像）

将 `YOUR_DOCKER_USERNAME` 换成你的 Docker Hub 用户名：

```bash
docker run -d --restart unless-stopped \
  -p 12345:12345 \
  -v ./data:/app/data \
  --name box-newking \
  YOUR_DOCKER_USERNAME/box-newking:2.5.4
```

访问 `http://服务器IP:12345`，完成首次 `/setup` 初始化。

或用 compose（1Panel 编排也可直接贴）：

```bash
BOX_NEWKING_IMAGE=YOUR_DOCKER_USERNAME/box-newking:2.5.4 \
  docker compose -f backend/docker-compose.prod.yml up -d
```

### 在服务器上本地 build（无预构建镜像时）

```bash
git clone https://github.com/New-King/box-newking.git
cd box-newking
docker compose -f backend/docker-compose.yml up -d --build
```

### 访问

| 地址 | 说明 |
|------|------|
| http://localhost:12345 | 用户端 + API（生产模式，前后端同端口） |
| http://localhost:12345/#/admin | 管理端 |
| http://localhost:12345/setup | 首次初始化 |

数据持久化在 Docker volume `box-newking-data`（`docker-compose.yml` 中配置）。


## License

上游项目采用 MIT License。本仓库的个性化改动部分同样遵循上游许可，详见各子目录中的 `LICENSE`。
