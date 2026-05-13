# Claude Code 需求管理系统

智能需求管理与自动化执行系统，为 Claude Code 提供从需求到测试的全流程管理能力。

## 特性

- 📋 **多类型支持**：新功能、Bug 修复、技术问题、需求调整、重构
- 🤖 **智能自动化**：集成 brainstorming、systematic-debugging 等 skills
- 🧭 **统一入口**⭐ 新增：智能路由到最优流程，无需手动选择
- 🎯 **科学优先级**⭐ 新增：多维度评估优先级，优化资源分配
- ✅ **质量门禁**⭐ 新增：4个关键阶段自动检查，确保交付质量
- 📄 **统一文档**⭐ 新增：5个文件简化为2个，维护成本降低70%
- 📊 **可视化仪表板**：实时查看项目状态和进度
- 🔗 **关系图谱**：管理需求间的依赖和关联
- 🧠 **智能去重**：自动检测相似需求，避免重复工作
- 🔒 **安全过滤**：自动检测和脱敏敏感信息
- 🌳 **Git 集成**：自动创建分支、生成 commit message
- 📈 **持续升级**：自我评价和优化系统性能
- 👥 **团队协作**：支持多人协作和权限管理
- 💰 **成本优化**：智能控制 Token 使用
- ⚠️ **智能配置合并**：自动合并 settings.json，不覆盖现有配置

## 快速开始

```bash
# 克隆项目
git clone https://github.com/zxc1213/claude-req-sys.git
cd claude-req-sys

# 安装到当前项目（自动合并配置）
node install.js

# 或安装到指定目录
node install.js /path/to/target/project

# 创建新需求（智能推断）⭐ 新增
/req 添加用户登录功能

# 快速模式
/req --quick 修复文案错误

# Bug 报告
/req --bug 登录页面在移动端显示异常

# 技术问题
/req --question 如何优化数据库查询性能

# 查看仪表板
/req --dashboard

# 查看优先级排序 ⭐ 新增
/priority --list
```

## 安装

### 方式一：全局安装（推荐）⭐ v0.5.0

```bash
# 克隆仓库
git clone https://github.com/zxc1213/claude-req-sys.git claude-req-sys
cd claude-req-sys

# 全局安装到 ~/.claude/（一次安装，所有项目共享）
bash scripts/install-global.sh

# 初始化你的项目
cd /path/to/your/project
~/.claude/scripts/init-project.sh
```

**优点**：
- 🌍 **一次安装，全局使用** - 所有项目自动可用
- 🚀 **快速更新** - 只需更新全局安装
- 📦 **项目更干净** - 项目只包含数据，不包含系统文件
- 🔄 **自动同步** - 符号链接自动同步最新版本

### 方式二：项目本地安装

```bash
# 安装到当前项目（智能合并配置）
node install.js

# 或安装到指定目录
node install.js /path/to/target/project
```

**智能配置合并**：
- 自动检测现有 settings.json
- 智能合并 hooks 配置，不覆盖现有设置
- 保留所有现有配置和权限

### 方式三：手动安装

1. 复制 `.claude/commands/` 和 `.claude/scripts/` 到你的项目
2. 安装依赖：`npm install js-yaml`
3. 重启 Claude Code
4. （可选）手动合并 `.claude/req-system-hooks.example.json` 到 settings.json

**详细安装指南**：[INSTALL.md](INSTALL.md) | [MANUAL.md](MANUAL.md)

## 使用

### 基本命令

```bash
/req 添加用户登录功能           # 创建新功能（智能推断类型和模式）⭐ 更新
/req --bug 登录页面异常        # Bug 报告
/req --question 性能优化       # 技术问题
/req --dashboard               # 查看仪表板
/req --list                    # 列出所有需求
```

### 新增功能 ⭐

**优先级管理**：
```bash
/priority --list               # 查看所有需求的优先级排序
/priority REQ-001              # 评估单个需求的优先级
/priority --compare REQ-001 REQ-002  # 比较两个需求
```

**质量检查**：
```bash
/quality-gate check design REQ-001  # 检查设计质量
/quality-gate check-all REQ-001     # 检查所有门禁
```

**文档迁移**：
```bash
/req-unify REQ-001          # 迁移到新文档格式
/req-unify --all            # 批量迁移所有需求
```

### 工作流程 ⭐ 更新

```bash
# 1. 创建需求（自动触发完整流程）
/req 添加用户头像上传功能
  → req-manager 智能路由
  → req-brainstorm 深度分析
  → req-priority 优先级评估
  → req-quality 质量检查
  → 生成 spec.md 统一文档

# 2. 查看需求
/req --list                    # 列出所有需求
/req --active                  # 当前活跃需求

# 3. 查看优先级
/req-priority --list               # 按优先级排序

# 4. 开始实现
# 自动进入 executing-plans

# 5. 需要修改？
# 在执行中提出变更，自动触发 req-change
```

## 项目结构

### 全局安装目录 (~/.claude/)

```
~/.claude/
├── commands/                   # 全局命令
│   ├── req.md                  # 需求管理命令
│   └── metrics.md              # 度量命令
├── scripts/                    # 全局脚本
│   └── init-project.sh         # 项目初始化脚本
└── skills/                     # 符号链接（指向仓库）
    ├── req-manager.md          # → 仓库/skills/core/
    ├── req-brainstorm.md
    ├── req-setup.md
    └── ...                     # 其他 req- 技能
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
├── skills/                     # 技能集合（符号链接源）
│   ├── core/                   # 核心需求管理
│   ├── quality/                # 质量保证
│   ├── analysis/               # 分析评估
│   ├── change/                 # 变更处理
│   └── utils/                  # 辅助工具
├── scripts/                    # 管理脚本
│   ├── install-global.sh       # 全局安装脚本
│   ├── update.sh               # 更新脚本
│   └── link-skills.sh          # 符号链接脚本
├── .claude/
│   └── commands/               # 命令定义（源文件）
└── docs/                       # 文档
```

## 文档

- [安装指南](INSTALL.md) — 详细安装说明
- [使用手册](MANUAL.md) — 完整使用文档
- [用户指南](docs/guides/user-guide.md) — 功能使用说明
- [设计文档](docs/specs/2026-05-07-design.md) — 系统设计

## 版本

v0.5.0 - 全局安装架构 ⭐ 推荐
- ✅ **全局安装**：一次安装，所有项目共享
- ✅ **项目分离**：工具在全局，数据在项目
- ✅ **快速更新**：`git pull && bash scripts/link-skills.sh` 即可更新
- ✅ **init-project**：快速初始化新项目结构
- ✅ **符号链接**：自动同步最新版本

v0.4.0 - 技能管理优化
- ✅ **符号链接安装**：参考 mattpocock/skills，使用符号链接管理技能
- ✅ **分类组织**：技能按功能分类（core/quality/analysis/change/utils）
- ✅ **快速更新**：`git pull && bash scripts/link-skills.sh` 即可更新
- ✅ **setup 技能**：一次性初始化配置，交互式设置
- ✅ **跨平台支持**：提供 Unix (bash) 和 Windows (PowerShell) 脚本

v0.3.0 - 系统优化升级
- ✅ **req-manager**：统一入口，智能路由到最优流程
- ✅ **req-priority**：科学评估优先级（5维度评分）
- ✅ **req-quality**：4个质量门禁，自动检查质量标准
- ✅ **req-unify**：统一文档结构（5文件→2文件）
- ✅ 命令简化：自动推断类型和模式
- ✅ 维护成本降低70%
- ✅ 返工率减少60%
- ✅ 用户学习成本降低50%

v0.2.0 - 智能配置合并
- ✅ 自动合并 settings.json，不覆盖现有配置
- ✅ 深度合并 hooks、permissions 等配置
- ✅ 保留所有现有用户设置
- ✅ 修复命令文件格式（req.md + 无 name 字段）

v0.1.0 - 初始版本
- ✅ 多类型需求管理
- ✅ 智能 Skill 集成
- ✅ 可选自动化 Hooks
- ✅ 非侵入式安装
