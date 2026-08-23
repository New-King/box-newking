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

## Docker 部署（生产，单容器）

官方 [`lanol/filecodebox`](https://hub.docker.com/r/lanol/filecodebox) 是上游预构建镜像；本仓库通过 [`.github/workflows/docker-image.yml`](.github/workflows/docker-image.yml) 自动 build 并推送到 **你自己的 Docker Hub**（镜像名 `你的用户名/box-newking`）。

> **注意**：GitHub Actions 只认仓库根目录的 `.github/workflows/`。`backend/.github/workflows/` 是上游遗留副本，**不会自动运行**。

### 首次配置 CI（一次性）

1. 注册 [Docker Hub](https://hub.docker.com/)，创建 Access Token
2. 打开 GitHub 仓库 **Settings → Secrets and variables → Actions**，添加：
   - `DOCKER_USERNAME`：Docker Hub 用户名
   - `DOCKER_PASSWORD`：Access Token
3. push 到 `main`，或打 tag `v2.5.4`（需与 `backend/VERSION` 一致）

打正式 tag 后，镜像会带上版本号 + `latest`，之后服务器可像官方一样一条命令部署。

### 一条命令启动（推荐，需 CI 已发布镜像）

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
