# box-newking 定制变更记录 / Upstream PR Notes

> 用于记录相对 [FileCodeBox](https://github.com/vastsa/FileCodeBox) / [FileCodeBoxFronted](https://github.com/vastsa/FileCodeBoxFronted) 的改动，方便日后向上游提 PR 或 cherry-pick。

---

## 本次变更摘要（2026-08-23 ~ 2026-08-24）

### 本地提交（`main` 上 4 个 commit，另有 1 项未提交）

| Commit | 说明 |
|--------|------|
| `70e92d3` | 深色模式色板对齐 newking（`#242426` 页面 / `#2c2c2e` 卡片 / `#343436` 外壳） |
| `27616db` | 发件页文件/文本切换：右上角圆形按钮 + 动态标题（「发送文件」↔「发送文本」） |
| `9bbccca` | 发件/取件记录移至顶部全局 History 图标；抽屉内可切换两种记录；底部去掉记录按钮 |
| `bbd34bc` | PageHeader 取件/发送图标 hover 变形（[morphicons](https://github.com/guillermolg00/morphicons)） |
| *(工作区)* | 发件页文件/文本切换按钮：`File` ↔ `Type`（T）变形动画（`SendFileView.vue`，待提交） |

### 功能说明

| # | 改动 | 说明 |
|---|------|------|
| 1 | **深色模式色板** | 公共页、弹窗、表单组件统一暖灰阶梯，替代原先偏黑的 `zinc-900` 叠层；`tailwind.config.js` 增加 `newking` 色阶 token |
| 2 | **发件类型切换 UI** | 去掉独立 `SendTypeSelector` 条；上传区右上角圆形按钮切换文件/文本；`PageHeader` 标题随模式变化；去掉发件页 `PageHeader` 多余 subtitle |
| 3 | **全局历史记录抽屉** | `App.vue` 顶部（语言切换左侧）仅 History 图标；`HistoryRecordsDrawer` 内 Tab 切换「取件记录 / 发件记录」；在发件页打开默认发件记录，取件页默认取件记录；`PageFooter` 仅保留跳转链接 |
| 4 | **图标变形动画（morphicons）** | 新增依赖 `morphicons` + `lucide`（图标**数据**，与 `lucide-vue-next` 组件并存）；PageHeader：`CloudDownload` ↔ `Send`；发件切换：`File` ↔ `Type` |

### 建议提交给官方的改动（前端，可拆成 2~3 个 PR）

| # | 改动 | 上游价值 | 备注 |
|---|------|----------|------|
| A | **全局历史记录抽屉** | 高 | 发件/取件页可交叉查看记录，减少底部重复入口 |
| B | **发件页类型切换 UI** | 高 | 更紧凑，上传区面积不变 |
| C | **morphicons 图标变形** | 中 | 需新增 `morphicons`、`lucide` 依赖（约 +8KB gzip）；上游若不愿加依赖可只合 A+B |
| D | **深色模式色板** | 低~中 | 视觉改进，但色值绑定 newking 品牌；提 PR 时可改为中性命名（如 `surface-page`）或让上游自选色值 |

### 仅 box-newking 自用（**不要**原样提交上游）

| 改动 | 说明 |
|------|------|
| newking 具体 hex 色值 | `#242426` / `#2c2c2e` / `#343436` 等为 newking 站点 token |
| 站点默认文案、品牌 | 见下方 2026-08-22 节 |

### 涉及文件（2026-08-23 ~ 24，相对 `frontend/`）

**功能 1：深色模式**

- `src/assets/style/main.css`
- `tailwind.config.js`
- `src/App.vue`
- 公共组件与视图内硬编码暗色 class（约 25 个文件，见 commit `70e92d3`）

**功能 2：发件类型切换**

- `src/views/SendFileView.vue`

**功能 3：全局历史记录**

- `src/App.vue`
- `src/components/common/HistoryRecordsDrawer.vue` *(新增)*
- `src/components/common/SideDrawer.vue` — 支持 `#header` 插槽
- `src/components/common/PageFooter.vue` — `drawerText` 可选；`linkDirection` 区分取件/发件链接图标
- `src/composables/useHistoryRecordsDrawer.ts` *(新增)*
- `src/composables/index.ts`
- `src/composables/useSendFlow.ts` — 移除页内 drawer 状态
- `src/composables/useRetrieveFlow.ts` — 移除页内 drawer 状态
- `src/views/SendFileView.vue`、`src/views/RetrievewFileView.vue`
- `src/i18n/locales/zh-CN.ts`、`en-US.ts` — `common.historyRecords`
- `scripts/check-architecture.mjs`

**功能 4：morphicons**

- `package.json`、`pnpm-lock.yaml` — `morphicons`、`lucide`
- `src/components/common/PageHeader.vue` — `MorphIcon` + `CloudDownload` / `Send`
- `src/views/SendFileView.vue` — 切换按钮 `MorphIcon` + `File` / `Type` *(含未提交改动)*

### 向上游提 PR 时的拆分建议

1. **PR：`feat/global-history-drawer`** — 功能 3 整包；自测：两页底部无记录按钮、顶部 History 可切换 Tab、详情/删除/下载仍可用。
2. **PR：`feat/send-mode-corner-toggle`** — 功能 2；自测：文件/文本切换、标题联动、提交逻辑不变。
3. **PR（可选）：`feat/morphing-header-icons`** — 功能 4；Description 注明新依赖与 [morphicons](https://www.morphicons.com) 演示链接。
4. **PR（可选）：`style/dark-theme-surfaces`** — 功能 1；建议将色值提取为 CSS 变量或 Tailwind 语义名，避免 `newking` 命名。

**估计新增/重点改动：约 35 个前端文件**（含 dark mode 批量 touch）；核心逻辑新增约 2 个 composable + 1 个 drawer 组件。

---

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
- **2026-08-24 本地 `main` 领先 `origin/main` 4 个 commit**（`70e92d3` … `bbd34bc`）；发件页 `File`/`Type` morph 切换尚在工作区，提交前请 `git add frontend/src/views/SendFileView.vue`。
