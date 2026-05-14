# ClaudeReqSys 安装指南

**版本**: v0.6.0
**更新日期**: 2026-05-13

---

## 📋 目录

- [全局安装（推荐）](#全局安装推荐)
- [项目本地安装](#项目本地安装)
- [文件结构说明](#文件结构说明)
- [更新系统](#更新系统)
- [常见问题](#常见问题)

---

## 安装方式

### 方式一：npm 全局安装（推荐）

**为什么选择 npm 安装？**

- 🌍 **一次安装，全局使用** - 所有项目自动可用
- 🚀 **快速更新** - 重新安装即可更新
- 📦 **项目更干净** - 项目只包含数据，不包含系统文件
- 🔄 **npm 管理** - 使用 npm 标准流程，跨平台支持

```bash
# 直接从 GitHub 安装
npm install -g github:zxc1213/claude-req-sys

# 安装后直接使用
cd /path/to/your/project
/req 添加新功能
```

**安装说明**：

- ✅ **自动配置** - npm install 时自动安装所有 skills、hooks 和 commands
- ✅ **开箱即用** - 无需手动运行 claude-req-init
- ✅ **全局可用** - 所有项目自动共享同一套工具
- ✅ **自动更新** - 重新安装即可更新所有配置

### 方式二：克隆安装

**为什么选择克隆安装？**

- 🛠️ **方便开发** - 可以修改源码和本地测试
- 📥 **完整源代码** - 访问完整的项目文件
- 🔧 **适合贡献** - 方便开发者提交 PR

```bash
# 1. 克隆仓库
git clone https://github.com/zxc1213/claude-req-sys.git claude-req-sys
cd claude-req-sys

# 2. npm 全局安装
npm install -g .

# 安装后直接使用
cd /path/to/your/project
/req 添加新功能
```

### 使用新项目

```bash
# 在任何项目中直接使用
cd /path/to/new/project
/req 添加新功能
```

---

## 更新系统

### npm 安装更新

```bash
# 重新安装即可更新
npm install -g github:zxc1213/claude-req-sys
```

### 克隆安装更新

```bash
# 进入仓库目录
cd claude-req-sys

# 拉取最新代码
git pull

# 重新安装
npm install -g .
```

---

## 文件结构说明

### 全局安装目录 (~/.claude/)

```
~/.claude/
├── commands/                   # 全局命令
│   ├── req.md                  # 需求管理命令
│   └── metrics.md              # 度量命令
├── scripts/                    # 全局脚本
│   ├── hooks/                  # 自动化钩子
│   ├── metrics/                # 度量脚本
│   └── requirement-manager/    # 需求管理器
├── skills/                     # 符号链接（指向 src/claude/skills/）
│   ├── req-manager.md          # → src/claude/skills/core/
│   ├── req-brainstorm.md
│   ├── req-init.md
│   └── ...                     # 其他 req- 技能
└── hooks.json                  # hooks 配置
```

### 项目本地目录

```
your-project/
├── .requirements/              # 需求数据（项目本地）
│   ├── features/               # 新功能
│   ├── bugs/                   # Bug 修复
│   ├── questions/              # 技术问题
│   ├── adjustments/            # 需求调整
│   └── refactorings/           # 重构任务
└── docs/                       # 项目文档（可选）
    ├── specs/                  # 需求规格
    └── guides/                 # 使用指南
```

### 仓库结构（开发）

```
claude-req-sys/
├── src/                        # 源文件目录
│   ├── claude/                 # Claude Code 集成
│   │   ├── commands/           # 命令定义
│   │   └── skills/             # 技能集合
│   │       ├── core/           # 核心需求管理
│   │       ├── quality/        # 质量保证
│   │       ├── analysis/       # 分析评估
│   │       ├── change/         # 变更处理
│   │       └── utils/          # 辅助工具
│   ├── scripts/                # 脚本工具
│   │   ├── hooks/              # 自动化钩子
│   │   ├── metrics/            # 度量收集
│   │   └── requirement-manager/  # 需求管理器
│   └── config/                 # 配置文件
│       ├── hooks.json          # hooks 配置
│       └── req-system-hooks.example.json
├── bin/                        # CLI 命令
│   ├── claude-req-init.js      # 初始化命令
│   └── claude-req-update.js    # 更新命令
├── scripts/                    # 管理脚本
│   ├── npm-install.js          # npm 安装脚本
│   ├── link-skills.sh          # 技能链接脚本
│   └── update.sh               # 更新脚本
├── tests/                      # 测试文件
├── docs/                       # 文档
├── package.json
└── README.md
```

---

## 🔧 配置说明

### 自动化功能（可选）

安装时会自动创建 `req-system-hooks.example.json`，其中包含自动化 Hooks 配置。

**如需启用自动化功能**，请手动将示例文件中的 hooks 配置合并到你的 `settings.json`：

```json
{
  "hooks": {
    "PostToolUse": [
      {
        "matcher": "Edit|Write|Bash",
        "hooks": [
          {
            "type": "command",
            "command": "node \".claude/scripts/hooks/post-req-update.js\"",
            "timeout": 10
          }
        ],
        "description": "更新需求记录",
        "id": "post:req:update"
      }
    ],
    "Stop": [
      {
        "matcher": "*",
        "hooks": [
          {
            "type": "command",
            "command": "node \".claude/scripts/hooks/stop-req-summary.js\"",
            "timeout": 10
          }
        ],
        "description": "生成需求执行总结",
        "id": "stop:req:summary"
      }
    ]
  }
}
```

### 基础使用（无需 Hooks）

即使不配置 Hooks，`/req` 命令也可以正常使用：

- ✅ 创建需求
- ✅ 查看仪表板
- ✅ 管理需求状态
- ❌ 自动跟踪文件变更（需要 Hooks）
- ❌ 自动生成会话总结（需要 Hooks）

---

## 常见问题

### Q: 安装脚本会覆盖我的 settings.json 吗？

**A**: 不会。v0.3.0 版本实现了智能配置合并：

- ✅ 自动检测现有 `.claude/settings.json`
- ✅ 使用深度合并算法，保留所有现有配置
- ✅ Hooks 配置会智能合并，不会覆盖现有 hooks
- ✅ 如果没有找到 hooks 模板，会创建示例文件供手动合并

### Q: 命令不生效？

**检查项**：

1. 确认在正确的项目目录
2. 检查 `.claude/commands/` 目录是否存在
3. 确认文件格式正确（只有 description，没有 name 字段）
4. 重启 Claude Code

### Q: 如何使用新功能？

**A**: v0.3.0 新增了多个命令和 skills：

```bash
# 统一入口（智能推断）
/req 添加用户登录功能

# 优先级管理
/priority --list

# 质量检查
/quality-gate check-all REQ-20260513-001

# 度量分析
/req-metrics --report week

# 文档迁移
/req-migrate --all
```

详细使用方法请参考 [用户指南](docs/guides/user-guide.md)

### Q: 旧需求文档怎么办？

**A**: 使用文档迁移工具：

```bash
# 迁移单个需求
/req-migrate REQ-20260507-001

# 批量迁移所有需求
/req-migrate --all

# 预览迁移（不实际修改）
/req-migrate REQ-20260507-001 --dry-run
```

迁移工具会：

- ✅ 自动备份旧文件
- ✅ 验证生成的文档
- ✅ 支持回滚

### Q: 如何卸载？

```bash
# 删除系统文件
rm -rf .claude/commands/req.md
rm -rf .claude/commands/req-metrics.md
rm -rf .claude/skills/
rm -rf .claude/scripts/req-metrics/
rm -rf .requirements/req-metrics/

# 手动从 settings.json 中删除 hooks 配置（可选）
# 查找与需求管理相关的 hooks
```

---

**获取更多帮助**：查看 [用户指南](docs/guides/user-guide.md) | [README](../README.md)
