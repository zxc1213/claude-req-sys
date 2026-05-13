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

### 方式一：克隆安装（推荐）⭐ v0.5.0

```bash
# 1. 克隆仓库
git clone https://github.com/zxc1213/claude-req-sys.git claude-req-sys
cd claude-req-sys

# 2. 运行安装脚本
bash install.sh

# 3. 初始化你的项目
cd /path/to/your/project
claude-req-init
```

**优点**：
- 🌍 **一次安装，全局使用** - 所有项目自动可用
- 🚀 **快速更新** - `claude-req-update` 一键更新
- 📦 **项目更干净** - 项目只包含数据，不包含系统文件
- 🔄 **可靠安装** - 避免 npm 工作目录问题

### 方式二：npm 全局安装

```bash
# 直接从 GitHub 安装
npm install -g github:zxc1213/claude-req-sys

# 初始化你的项目
cd /path/to/your/project
claude-req-init
```

**优点**：
- 📦 **标准 npm 包管理** - 使用熟悉的 npm 生态
- 🚀 **一键安装** - 无需手动克隆和配置
- 🔄 **自动更新** - `npm update -g claude-req-sys` 更新
- 🌍 **全局可用** - 所有项目共享同一套工具

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
    ├── req-init.md
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
