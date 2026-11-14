# 日常工作插件商店（DSH 插件索引）

这是一份符合 DeepSeek Harness「插件市场索引格式 1」的索引文件，用 GitHub Pages 托管后，
可以直接在 DSH 的 **插件 → Discover（发现）→ 索引源** 里添加使用。

- 线上索引：<https://hubayi45.github.io/dsh-plugin-market/index.json>
- 代码仓库：<https://github.com/hubayi45/dsh-plugin-market>

- `index.json` — 商店本体：索引标题、分类、标签，以及每个插件的版本与安装来源（npm / git）。
- `icons/` — 卡片图标（相对路径，按索引 URL 解析）。
- `scripts/validate.mjs` — 用官方校验器验证索引格式。
- `scripts/serve.mjs` — 本地零依赖静态服务器，用于上线前预览。

## 在 DSH 里使用

1. 打开 DSH 侧边栏的 **插件（Plugins）** → **Discover（发现）** 标签。
2. 点 **添加索引源 / Index sources**，填入索引地址：
   - 线上：`https://hubayi45.github.io/dsh-plugin-market/index.json`
   - 本地预览：`http://127.0.0.1:8899/index.json`
3. 选中该索引后即可按分类、标签浏览条目，打开详情页安装。

> 索引内容与安装来源都是第三方声明，DSH 不会验证其真实性；安装插件会执行插件代码，请只添加你信任的索引。

## 本地校验与预览

```powershell
npm install
npm run validate -- index.json https://hubayi45.github.io/dsh-plugin-market/index.json
npm run serve          # http://127.0.0.1:8899/index.json
```

`validate` 会打印每个条目的安装参数（npm 为 `包名@版本`，git 为固定 commit 的 `git+https` 地址），
并在格式违规时给出具体 JSON 路径。

## 目录里现在有什么

商店首批收录 DeepSeek Harness 官方可选插件：

- **可安装**（npm，商店里直接装）：Claude Code 子代理、Codex 子代理。
- **内置可选**（DSH 已自带，条目页会显示「由 DSH 提供」）：持久终端、会话搜索、Ralph 循环、DSH 徽章技能、
  随对话更新的标题、开发者工具、变更请求与工作树、语音输入、思考过程机器翻译、自动授权审查、LiveShare 会话分享、Git 工作树。

「内置可选」条目用于在商店里集中查看这些功能的用途；开启它们在 **插件** 页对应的开关里完成。

## 添加自己的插件

在 `index.json` 的 `plugins` 数组里追加一个对象：

```json
{
  "name": "@your-scope/your-bundle",
  "title": { "en": "Your plugin", "zh": "你的插件" },
  "description": { "en": "What it does.", "zh": "它做什么。" },
  "icon": "icons/your-plugin.svg",
  "author": "your-name",
  "metadata": { "category": "installable", "labels": ["tools"], "keywords": ["..."] },
  "versions": [
    {
      "version": "1.0.0",
      "publishTimestamp": 1760000000,
      "source": { "type": "npm" }
    }
  ]
}
```

- npm 发布：`source` 用 `{ "type": "npm" }`，可选 `registry` 指定优先仓库。
- Git 发布：`source` 用 `{ "type": "git", "url": "https://github.com/你/仓库", "commit": "<40 位小写 SHA>", "path": "packages/子目录" }`；
  commit 必须是完整 40 位 SHA，`path` 为该包在仓库中的目录（仓库根目录则省略）。
- `version` 必须是精确 SemVer；`publishTimestamp` 是 Unix 秒；`engines.dsh` 可写兼容的 DSH 版本范围（如 `^0.2.2-rc.3`）。
- 新分类/标签需先在 `metadata.categories` / `metadata.labels` 里声明，否则校验失败。

改完跑一遍 `npm run validate` 再提交。

## 部署到 GitHub Pages

1. 建一个公开仓库（例如 `dsh-plugin-market`），把本目录推上去（默认分支 `main`）。
2. 仓库 **Settings → Pages**：Source 选 **Deploy from a branch**，分支 `main`、目录 `/ (root)`，保存。
3. 一两分钟后访问 `https://hubayi45.github.io/dsh-plugin-market/index.json`，能返回本文件即成功。
4. 仓库根目录已有 `.nojekyll`，可避免 Pages 的 Jekyll 处理忽略以下划线开头的文件。

## 更新内容

- 改 `index.json` → `npm run validate` → 提交推送，Pages 自动重新构建。
- 索引端有 10 分钟缓存（`cacheTtlMs`）；改完在 Discover 里点刷新即可看到新内容。
