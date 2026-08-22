# box-newking 定制变更记录 / Upstream PR Notes

> 用于记录相对 [FileCodeBox](https://github.com/vastsa/FileCodeBox) / [FileCodeBoxFronted](https://github.com/vastsa/FileCodeBoxFronted) 的改动，方便日后向上游提 PR 或 cherry-pick。

## 本次变更摘要（2026-08-22）

### 建议提交给官方的改动（3 项，均在 **前端**）

| # | 改动 | 说明 |
|---|------|------|
| 1 | **发件 / 取件记录持久化** | 使用已有 `record-storage.ts`，写入 `localStorage`，刷新后仍可查看取件码与文件名 |
| 2 | **右上角提示（Toast）** | 更紧凑 UI、去掉进度条、自动关闭时间 5s → 2.5s |
| 3 | **终端下载命令** | 发件详情由单一 wget 改为 **curl + wget** 两个复制按钮；修正下载 URL 为 `/share/select/?code=` |

### 仅 box-newking 自用（**不要**原样提交上游）

| 改动 | 文件 |
|------|------|
| 站点默认文案（box-newking） | `backend/core/settings.py` |
| 无 `themes/` 时根路径兜底页（本地 dev） | `backend/main.py` |
| 页面标题 / 品牌 | `frontend/index.html`、`frontend/src/main.ts`、`frontend/src/composables/usePublicConfigBootstrap.ts`、`frontend/src/constants/index.ts`（`APP_NAME`） |

---

## 向上游提 PR 时要动哪些文件

官方是 **前后端两个仓库**。以下路径均相对于各仓库根目录。

### PR 1 → [vastsa/FileCodeBoxFronted](https://github.com/vastsa/FileCodeBoxFronted)（前端）

**功能 1：记录 localStorage**

- `src/constants/index.ts` — 增加 `STORAGE_KEYS.SEND_RECORDS` / `RECEIVE_RECORDS`（上游可改为中性键名，如 `filecodebox:send-records`）
- `src/stores/fileData.ts` — 启动读取、变更时写入 localStorage

**功能 2：Toast**

- `src/constants/index.ts` — `ALERT_DURATION: 2500`，删除仅用于进度条的 `PROGRESS_UPDATE_INTERVAL`
- `src/stores/alertStore.ts` — 去掉进度条定时器逻辑
- `src/types/ui.ts` — `Alert` 类型去掉 `progress` / `duration` / `startTime`
- `src/components/common/AlertComponent.vue` — 紧凑样式

**功能 3：curl + wget**

- `src/utils/share-url.ts` — `buildCurlCommand`、`buildShareSelectUrl`，修正 wget URL
- `src/utils/clipboard.ts` — `copyCurlCommand`
- `src/utils/sent-record-actions.ts` — 暴露 `copyCurlCommand`
- `src/components/common/SentRecordDetailModal.vue` — 双按钮 UI
- `src/composables/useSendFlow.ts` — 导出 `copySentRecordCurlCommand`
- `src/views/SendFileView.vue` — 绑定 `@copy-curl`
- `src/i18n/locales/zh-CN.ts`、`src/i18n/locales/en-US.ts` — `send.terminalDownload.*`

**估计：约 12 个前端文件**（见上列表；以 `git diff` 中 `frontend/` 为准，排除 branding 相关行）。

### PR 2 → [vastsa/FileCodeBox](https://github.com/vastsa/FileCodeBox)（后端）

本次 **3 项功能均不需要改后端**。若单独提「curl 文档示例」类 PR，可参考官方已有 `docs/guide/upload.md` 中的 curl 示例，无需本次代码变更。

---

## 推荐提 PR 流程

1. Fork 官方 **前端** 仓库（后端本次可跳过）。
2. 从 `main` 拉分支，例如 `feat/local-records-toast-terminal-curl`。
3. 只拷贝上表「PR 1」中的文件改动（**不要**带 `APP_NAME`、`box-newking` 键名等自用配置）。
4. 在 fork 上跑：`pnpm install`、`pnpm dev` / `pnpm build`，自测发件记录刷新仍在、Toast、curl/wget 复制。
5. 向上游开 Issue 简述场景（内网自用、记录易丢失等），再开 PR，Description 可粘贴本文件「本次变更摘要」三节。
6. box-newking monorepo 与官方双仓结构不同：提 PR 时需把 `frontend/` 下改动 **按路径对应** 拷到 FileCodeBoxFronted 仓库根目录。

---

## 本仓库提交说明

- monorepo：`box-newking`（含 `backend/` + `frontend/`）。
- 自用 branding 与 dev 兜底与功能改动当前在同一分支；向上游时请 **按上文拆分**。
