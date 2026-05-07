# Claude Code 需求管理系统

智能需求管理与自动化执行系统，为 Claude Code 提供从需求到测试的全流程管理能力。

## 特性

- 📋 **多类型支持**：新功能、Bug 修复、技术问题、需求调整、重构
- 🤖 **智能自动化**：集成 brainstorming、systematic-debugging 等 skills
- 📊 **可视化仪表板**：实时查看项目状态和进度
- 🔗 **关系图谱**：管理需求间的依赖和关联
- 🧠 **智能去重**：自动检测相似需求，避免重复工作
- 🔒 **安全过滤**：自动检测和脱敏敏感信息
- 🌳 **Git 集成**：自动创建分支、生成 commit message
- 📈 **持续升级**：自我评价和优化系统性能
- 👥 **团队协作**：支持多人协作和权限管理
- 💰 **成本优化**：智能控制 Token 使用
- ⚠️ **非侵入式安装**：不覆盖现有配置

## 快速开始

```bash
# 安装到当前项目
git clone https://github.com/zxc1213/claude-req-sys.git
cd claude-req-sys
node install.js

# 创建新需求
/req 添加用户登录功能

# Bug 报告
/req --bug 登录页面在移动端显示异常

# 技术问题
/req --question 如何优化数据库查询性能

# 查看仪表板
/req --dashboard
```

## 安装

### 方式一：自动安装（推荐）

```bash
# 进入目标项目目录
cd /path/to/your/project

# 运行安装脚本
node /path/to/claude-req-sys/install.js
```

### 方式二：手动安装

1. 复制 `.claude/commands/` 和 `.claude/scripts/` 到你的项目
2. 安装依赖：`npm install js-yaml fuse.js chalk cli-table3 ora`
3. 重启 Claude Code

**详细安装指南**：[INSTALL.md](INSTALL.md) | [MANUAL.md](MANUAL.md)

## 使用

```bash
/req 添加用户登录功能           # 创建新功能需求
/req --bug 登录页面异常        # Bug 报告
/req --question 性能优化       # 技术问题
/req --dashboard               # 查看仪表板
/req --list                    # 列出所有需求
```

## 项目结构

```
.claude/
├── commands/
│   └── requirement.md          # 自定义命令定义
├── scripts/
│   ├── hooks/                  # 自动化钩子（可选）
│   └── requirement-manager/    # 核心逻辑
└── req-system-hooks.example.json  # Hooks 配置示例
```

## 文档

- [安装指南](INSTALL.md) — 详细安装说明
- [使用手册](MANUAL.md) — 完整使用文档
- [用户指南](docs/guides/user-guide.md) — 功能使用说明
- [设计文档](docs/specs/2026-05-07-design.md) — 系统设计

## 版本

v0.1.0 - 初始版本
- ✅ 多类型需求管理
- ✅ 智能 Skill 集成
- ✅ 可选自动化 Hooks
- ✅ 非侵入式安装
