# ClaudeReqSys 安装手册

## ⚠️ 重要说明

**v0.5.0 采用全局安装架构，一次安装所有项目可用！**

本系统现在推荐安装到全局 `~/.claude/` 目录，项目只包含数据。

**本安装脚本不会覆盖你现有的配置文件。**

---

## 🎯 快速安装（3步）⭐ 推荐

### 全局安装方式

```bash
# 1. 克隆仓库
git clone https://github.com/zxc1213/claude-req-sys.git claude-req-sys
cd claude-req-sys

# 2. 全局安装到 ~/.claude/
bash scripts/install-global.sh

# 3. 初始化你的项目
cd /path/to/your/project
~/.claude/scripts/init-project.sh

# 4. 验证安装
/req --dashboard
```

### 项目本地安装（传统方式）

```bash
# 1. 进入 ClaudeReqSys 目录
cd E:\AI_Project\ClaudeReqSys

# 2. 运行安装脚本（安装到当前目录）
node install.js

# 3. 验证安装
/req --dashboard
```

---

## 📂 安装后目录结构

### 全局安装（推荐）

安装完成后，全局目录会有：

```
~/.claude/
├── commands/                   ← 全局命令（所有项目共享）
│   ├── req.md                  ← 需求管理命令
│   └── metrics.md              ← 度量命令
├── scripts/                    ← 全局脚本
│   └── init-project.sh         ← 项目初始化脚本
└── skills/                     ← 符号链接（指向仓库）
    ├── req-manager.md          → 仓库/skills/core/
    ├── req-brainstorm.md
    └── ...                     ← 其他 req- 技能
```

### 项目本地（你的项目）

```
your-project/
├── .requirements/              ← 需求数据（项目本地）
│   ├── features/               ← 新功能
│   ├── bugs/                   ← Bug 修复
│   ├── questions/              ← 技术问题
│   ├── adjustments/            ← 需求调整
│   └── refactorings/           ← 重构任务
└── docs/                       ← 项目文档（可选）
    ├── specs/                  ← 需求规格
    └── guides/                 ← 使用指南
```

**关键文件**：`~/.claude/commands/req.md` — 这是 `/req` 命令的定义文件（全局共享）。

---

## 🔧 配置说明

### 自动化功能（可选）

安装脚本会创建 `req-system-hooks.example.json`，其中包含自动化 Hooks 配置。

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

## 🌍 多项目使用

如果你想在多个项目中使用：

### 方法一：逐个安装

```bash
# 项目 A
cd /path/to/project-a
node E:\AI_Project\ClaudeReqSys\install.js

# 项目 B
cd /path/to/project-b
node E:\AI_Project\ClaudeReqSys\install.js
```

### 方法二：使用全局模板（高级）

在用户主目录创建全局模板：

```bash
# 1. 复制命令到全局模板
mkdir -p ~/.claude-template/commands
cp E:\AI_Project\ClaudeReqSys/.claude/commands/requirement.md ~/.claude-template/commands/

# 2. 新项目时复制
cp -r ~/.claude-template/* /path/to/new-project/.claude/
```

---

## 🔄 卸载

```bash
# 删除文件
rm -rf .claude/commands/requirement.md
rm -rf .claude/scripts/requirement-manager
rm -rf .claude/scripts/hooks/post-req-update.js
rm -rf .claude/scripts/hooks/stop-req-summary.js
rm -rf .claude/req-system-hooks.example.json
rm -rf .requirements/

# 注意：settings.json 不会被修改，无需恢复
```

---

## 🚀 快速开始

安装完成后：

```bash
# 查看仪表板
/req --dashboard

# 创建需求
/req 添加用户登录功能

# Bug 报告
/req --bug 登录页面样式错误

# 查看所有需求
/req --list
```

---

## ⚠️ 故障排除

### 问题：`/req` 命令没反应

**检查清单**：

1. ✅ **确认当前目录**
```bash
pwd  # 确认在正确的项目目录
```

2. ✅ **确认命令文件存在**
```bash
ls .claude/commands/requirement.md
```

3. ✅ **重启 Claude Code**
```bash
# 完全退出 Claude Code，重新打开
```

### 问题：自动化功能不工作

**解决方案**：

1. 检查是否已配置 Hooks
```bash
cat .claude/settings.json | grep -A 10 '"hooks"'
```

2. 如果没有配置，按照"配置说明"部分手动添加

---

## 📞 获取帮助

- **用户指南**：`docs/guides/user-guide.md`
- **设计文档**：`docs/specs/2026-05-07-design.md`
- **运行测试**：`npm test`

---

**记住**：
- ✅ 安装脚本不会覆盖你的 settings.json
- ✅ 命令立即可用，无需配置 Hooks
- ⚙️ Hooks 是可选的自动化功能
