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
└── frontend/   # Vue 3 前端（源自 FileCodeBoxFronted）
```

开发时前后端分离启动；生产部署可将前端 build 产物打包进后端镜像（与官方 Docker 方式一致）。

## 环境要求

- Python **3.12+**
- Node.js **20+**
- pnpm **9+**

## 本地启动

### 1. 后端

```bash
cd backend
python3.12 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
python main.py
```

后端默认监听 `http://localhost:12345`。

**首次运行**请访问 [http://localhost:12345/setup](http://localhost:12345/setup) 完成管理员初始化。

### 2. 前端

另开一个终端：

```bash
cd frontend
pnpm install
pnpm dev
```

前端默认监听 `http://localhost:5173`，开发环境 API 地址见 `frontend/.env.development`（默认 `http://localhost:12345`）。

若 `pnpm dev` 因 `esbuild` 构建脚本被拦截而失败，可先执行 `pnpm approve-builds` 勾选 `esbuild`，或临时使用：

```bash
./node_modules/.bin/vite
```

### 3. 访问

| 地址 | 说明 |
|------|------|
| http://localhost:5173 | 用户端（发件 / 取件） |
| http://localhost:5173/#/admin | 管理端 |
| http://localhost:12345 | 后端 API |

## License

上游项目采用 MIT License。本仓库的个性化改动部分同样遵循上游许可，详见各子目录中的 `LICENSE`。
