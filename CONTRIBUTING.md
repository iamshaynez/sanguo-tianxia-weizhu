# 开发与协作规范

本文件是《三国：天下为注》的开发入口。核心原则：**受保护分支只通过 PR 更新，用户可见行为必须有测试，合并前必须知道改动影响了什么。**

## 1. 环境准备

- Node.js 24（版本见 `.nvmrc`），npm 使用仓库锁定的 `package-lock.json`。
- Python 3：仅用于本地静态服务器与 Playwright 测试服务器。
- 首次安装：

```bash
nvm use
npm ci
npx playwright install chromium
python3 -m http.server 8619
# 打开 http://127.0.0.1:8619/
```

不要提交 `node_modules/`、测试临时结果、个人工具缓存、系统文件或任何密钥。生成物范围见 `.gitignore`。

## 2. 分支模型

| 分支 | 用途 | 更新方式 |
|---|---|---|
| `main` | 稳定、可发布版本 | 通常只接受来自 `dev` 的 PR |
| `dev` | 日常集成，始终可继续开发 | 接受功能、修复、文档等专题分支的 PR |
| 专题分支 | 一个独立、可审查的改动 | 从 `dev` 创建，完成后通过 PR 回到 `dev` |

`main` 与 `dev` 均受保护：禁止直接推送、删除和强制推送；必须创建 PR，所需审核人数为 0。**0 人审核只表示不强制他人审批，不表示可以跳过自审、测试或 CI。**

分支命名使用小写英文和短横线：

- `feat/<主题>`：新功能，如 `feat/multiplayer-seats`
- `fix/<主题>`：缺陷修复
- `docs/<主题>`：文档与协作规范
- `refactor/<主题>`：不改变行为的重构
- `test/<主题>`：测试补充
- `ci/<主题>`：自动化与工作流

## 3. 标准开发流程

```bash
git switch dev
git pull --ff-only origin dev
git switch -c feat/my-change

# 开发；先写或更新相应测试
npm test

git add <明确需要提交的文件>
git diff --cached --check
git diff --cached
git commit -m "feat: describe the user-visible change"
git push -u origin feat/my-change
```

1. 向 `dev` 创建 PR，填写变更原因、影响范围和验证证据。
2. 完成自审，处理 PR 评论，等待 CI 通过。
3. 专题分支合入 `dev` 时优先使用 squash，保持一个专题一个清晰提交。
4. 发布时从 `dev` 向 `main` 创建 PR，使用普通 merge 保留发布节点。
5. 紧急修复可从 `main` 创建 `fix/<主题>`，先 PR 到 `main`，随后必须通过另一个 PR 同步回 `dev`，禁止直接反向推送。

不要在一个 PR 中混入无关重构、格式化、素材替换和玩法改动。确需大规模格式化时单独进行。

## 4. 提交规范

提交信息采用 Conventional Commits：`<type>: <summary>`。

- 类型：`feat` / `fix` / `docs` / `refactor` / `test` / `perf` / `ci` / `chore`。
- 摘要使用简短、可读的现在时，说明结果而不是工作过程。
- 一个提交只表达一个逻辑改动；提交前确保没有临时调试代码、无条件 `console.log` 或注释掉的旧实现。

示例：`feat: add compact seats for multiplayer layouts`、`fix: keep the active seat visible on mobile`。

## 5. 代码与内容规范

### JavaScript 与样式

- 使用原生 ES Modules、2 空格缩进、单引号、分号和既有命名风格；不引入仅用于风格统一的框架或构建层。
- 优先小函数、明确的数据流和可复用组件。注释只解释代码本身无法表达的约束，不写变更流水账。
- 章节、武将、人格和头像映射保持数据驱动；新增内容先查现有数据源，避免复制映射表。
- 对远程玩家名、外部文本等不可信内容使用文本赋值或转义，不直接拼接进 HTML。
- 不添加运行时外部图片依赖、隐蔽遥测、账号令牌或个人绝对路径。

### UI 与武将素材

- 入场卡、观阵录和牌桌统一使用 `src/portrait.js` 的本地头像映射；不要重新引入 SVG 人物傀儡。
- 牌桌状态归属于对应席位。多人布局复用 `setPlayers`，不得为不同人数复制一套牌桌 DOM。
- UI 改动至少检查 1280×720、390px 和 320px；涉及多人时同时检查席位溢出、当前行动者可见性、详情入口和公共牌区。
- UI PR 必须附实际截图；截图用于人工验收，不能代替可执行测试。
- 新素材必须本地保存并记录来源与授权。既有《三国志9》头像归光荣特库摩所有，不把素材当作项目原创成果。

### AI、章节与武将

- 修改 `aiDecide` 前，先在 `tests/ai-eval/` 添加能暴露问题的场景；任何评估失败都不得合入。
- 新人格维度必须同时落地：决策效果、六维映射、统计测试。纯装饰属性不接受。
- 新增章节或武将必须补齐数据契约、合法引用和文案长度校验，不能只让页面“碰巧能跑”。

## 6. 测试门槛

完整说明见 [TESTING.md](TESTING.md)。日常先跑与改动相关的快速检查，提交 PR 前必须完成完整验证：

| 命令 | 用途 | 何时必跑 |
|---|---|---|
| `npm run lint:content` | 章节、武将和引用契约 | 任何内容或映射改动 |
| `npm run eval:ai` | AI 合法性与行为统计 | 任何 AI、人格或规则改动 |
| `npx playwright test <相关套件>` | 开发中的快速回归 | 任何 UI 或流程改动 |
| `npm test` | 内容校验 + AI 评估 + 全部 E2E | 每个 PR 合并前 |

不接受通过删除断言、放宽无关阈值、跳过失败用例或依赖重试来制造“通过”。随机场景使用固定种子，并保留合理统计容差。

## 7. PR 与完成定义

一个 PR 只有在以下条件全部满足后才算完成：

- 范围单一，说明为什么改以及用户会感知到什么。
- 相关测试已更新，完整 `npm test` 和远端 CI 均通过。
- 没有冲突、调试残留、生成物或与任务无关的改动。
- UI 改动附截图；文档、测试、素材来源说明同步更新。
- README、TESTING 或本文件中仍准确描述当前行为。
- 合并后删除已完成专题分支；需要发布时，再通过 PR 将 `dev` 合入 `main`。

PR 模板位于 `.github/pull_request_template.md`。CI 工作流位于 `.github/workflows/ci.yml`。
