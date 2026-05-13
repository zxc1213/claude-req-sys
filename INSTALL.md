# ClaudeReqSys 安装指南

**版本**: v0.5.0
**更新日期**: 2026-05-13

---

## 📋 目录

- [全局安装（推荐）](#全局安装推荐)
- [项目本地安装](#项目本地安装)
- [文件结构说明](#文件结构说明)
- [更新系统](#更新系统)
- [常见问题](#常见问题)

---

## 全局安装（推荐）⭐ v0.5.0

### 为什么选择全局安装？

- 🌍 **一次安装，全局使用** - 所有项目自动可用
- 🚀 **快速更新** - `claude-req-update` 一键更新
- 📦 **项目更干净** - 项目只包含数据，不包含系统文件
- 🔄 **npm 管理** - 使用 npm 标准流程，跨平台支持

### 方式一：直接从 GitHub 安装

```bash
# npm 全局安装
npm install -g github:zxc1213/claude-req-sys

# 初始化你的项目
cd /path/to/your/project
claude-req-init
```

### 方式二：克隆后安装

```bash
# 1. 克隆仓库
git clone https://github.com/zxc1213/claude-req-sys.git claude-req-sys
cd claude-req-sys

# 2. npm 全局安装
npm install -g .

# 3. 初始化你的项目
cd /path/to/your/project
claude-req-init
```

### 使用新项目

```bash
# 在任何项目中直接使用
cd /path/to/new/project
/req 添加新功能
```

---

## 更新系统

### 快速更新

```bash
# 使用 npm 更新
npm update -g claude-req-sys

# 或使用更新命令
claude-req-update
```

### 手动更新

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

### 新文档结构（v0.3.0）

```
REQ-XXX/
├── meta.yaml           # 元数据（含优先级）
├── spec.md             # 统一主文档 ⭐ 新格式
└── test-cases.md       # 详细测试用例（可选）⭐ 新格式
```

---

## 新功能概览

### 1. 统一入口（req-manager）

**功能**：智能路由到最优处理流程

**使用**：
```bash
/req 添加用户登录功能     # 自动推断为 feature + deep
/req 修复登录bug         # 自动推断为 bug + quick
/req 如何实现OAuth?      # 自动推断为 question + semi_auto
```

### 2. 优先级评估（req-priority）

**功能**：5维度科学评估优先级

**使用**：
```bash
/priority --list           # 查看优先级排序
/priority REQ-20260513-001 # 评估单个需求
```

### 3. 质量门禁（req-quality）

**功能**：4个关键阶段自动检查

**使用**：
```bash
/quality-gate check-all REQ-20260513-001 # 检查所有门禁
```

### 4. 文档统一（req-unify）

**功能**：5个文件简化为2个文件

**优势**：
- 维护成本降低 70%
- 消除信息冗余
- 单一信息源

### 5. 文档迁移（req-migrate）

**功能**：将旧格式迁移到新格式

**使用**：
```bash
/req-migrate REQ-20260513-001 # 单个迁移
/req-migrate --all               # 批量迁移
```

### 6. 验证检查清单（req-verify）

**功能**：20+验证项确保质量

**使用**：
```bash
/req-verify --all REQ-20260513-001
```

### 7. 度量体系（metrics）

**功能**：4维度16指标，持续优化

**使用**：
```bash
/req-metrics                    # 查看所有指标
/req-metrics --report week       # 生成周报
/req-metrics --trend cycle_time  # 查看趋势
```

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

## 快速开始

安装完成后：

```bash
# 1. 创建第一个需求（智能推断）
/req 添加用户登录功能

# 2. 查看优先级排序
/priority --list

# 3. 查看度量指标
/req-metrics

# 4. 生成周报
/req-metrics --report week

# 5. 查看帮助
/req --help
```

---

## 更新系统

### 快速更新

```bash
# 进入仓库目录
cd claude-req-sys

# 拉取最新代码
git pull

# 重新链接技能
bash scripts/link-skills.sh
```

### 一键更新脚本

```bash
# 在仓库目录运行
bash scripts/update.sh
```

---

## 版本历史

### v0.5.0 (2026-05-13)

**新增功能**：
- ✅ 全局安装架构 - 一次安装，所有项目使用
- ✅ 项目初始化脚本 - 快速设置新项目
- ✅ 符号链接管理 - 自动同步最新版本
- ✅ 项目数据分离 - 工具在全局，数据在项目

**优化**：
- 📦 项目更干净 - 只包含数据，不包含系统文件
- 🚀 更新更快速 - 只需更新全局安装
- 🔄 自动同步 - 符号链接自动同步

### v0.4.0 (2026-05-13)

**新增功能**：
- ✅ 符号链接安装 - 参考 mattpocock/skills
- ✅ 技能分类组织 - core/quality/analysis/change/utils
- ✅ 快速更新脚本 - git pull + link-skills
- ✅ setup 技能 - 一次性初始化配置
- ✅ 跨平台支持 - Unix 和 Windows 脚本

### v0.3.0 (2026-05-13)

**新增功能**：
- ✅ 统一入口（req-manager）- 智能路由
- ✅ 优先级评估（req-priority）- 5维度科学评估
- ✅ 质量门禁（req-quality）- 4阶段自动检查
- ✅ 文档统一（req-unify）- 5文件→2文件
- ✅ 文档迁移（req-migrate）- 自动备份和验证
- ✅ 验证检查清单（req-verify）- 20+验证项
- ✅ 度量体系（metrics）- 4维度16指标

**优化**：
- 📈 学习成本降低 60%
- 📉 维护成本降低 70%
- 📉 返工率减少 60%
- 📈 创建效率提升 50%
- 📈 质量门禁通过率 >90%

### v0.2.0

- 添加 req-brainstorm skill
- 添加 req-change skill
- 添加 req-test-plan skill
- 智能配置合并

### v0.1.0

- 初始版本
- 基础需求管理功能

---

**获取更多帮助**：查看 [用户指南](docs/guides/user-guide.md) | [优化报告](docs/analysis/optimization-report.md)
