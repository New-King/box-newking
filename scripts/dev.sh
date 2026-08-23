#!/usr/bin/env bash
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"

if [[ ! -x "$ROOT/backend/.venv/bin/python" ]]; then
  echo "未找到 backend/.venv，请先按 README 初始化后端虚拟环境。" >&2
  exit 1
fi

trap 'kill 0' INT TERM EXIT

echo "启动后端 http://localhost:12345"
(cd "$ROOT/backend" && .venv/bin/python main.py) &

echo "启动前端 http://localhost:5173"
(cd "$ROOT/frontend" && pnpm dev) &

wait
