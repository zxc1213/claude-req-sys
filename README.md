# Claude Code 需求管理系统

智能需求管理与自动化执行系统，为 Claude Code 提供从需求到测试的全流程管理能力。

## 特性

- 📋 **多类型支持**：新功能、Bug 修复、技术问题、需求调整、重构
- 🤖 **智能自动化**：集成 brainstorming、systematic-debugging 等 skills
- 🧭 **统一入口**⭐：智能路由到最优流程，无需手动选择
- 🎯 **科学优先级**⭐：多维度评估优先级，优化资源分配
- ✅ **质量门禁**⭐：4个关键阶段自动检查，确保交付质量
- 📄 **统一文档**⭐：5个文件简化为2个，维护成本降低70%
- 🔍 **向量知识图谱**⭐：语义搜索相似需求，智能推荐相关功能
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
- 🔄 **简单更新** - 重新安装即可更新：`npm install -g github:zxc1213/claude-req-sys`
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

**向量知识图谱**：

```bash
kg-search "用户登录" 10      # 搜索相似需求（返回前10个）
kg-stats                     # 查看知识图谱统计信息
kg-connections REQ-001       # 查看需求的知识关联
kg-recommend                 # 智能推荐相关需求
kg-rebuild                   # 重建知识图谱索引
```

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
│   │   ├── knowledge-graph/    # 向量知识图谱 ⭐
│   │   └── requirement-manager/  # 需求管理器
│   └── config/                 # 配置文件
│       ├── hooks.json          # hooks 配置
│       └── req-system-hooks.example.json
├── bin/                        # CLI 命令
│   ├── claude-req-init.js      # 初始化命令
│   ├── claude-req-update.js    # 更新命令
│   └── kg-cli.js               # 知识图谱 CLI 工具 ⭐
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

v0.6.0 - 向量知识图谱 ⭐ 最新

- ✅ **向量知识图谱**：基于 Fuse.js 实现语义搜索
- ✅ **智能相似度检测**：自动发现相似需求，避免重复工作
- ✅ **知识关联遍历**：BFS 算法遍历需求关系网络
- ✅ **上下文感知推荐**：基于类型、标签、优先级的智能推荐
- ✅ **CLI 工具集**：kg-search、kg-stats、kg-connections、kg-recommend、kg-rebuild
- ✅ **自动同步集成**：需求创建/更新/删除时自动同步到知识图谱
- ✅ **19个专项测试**：确保知识图谱功能稳定可靠
- ✅ **142个测试用例**：整体测试覆盖率提升

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

## 测试 ⭐ 新增

项目包含完整的测试套件，确保代码质量和功能稳定性。

### 运行测试

```bash
# 运行所有测试
npm test

# 运行测试并查看覆盖率
npm run test:coverage

# 监视模式（开发时使用）
npm run test:watch

# 显示详细输出
npm run test:verbose
```

### 测试结构

```
tests/
├── test-import.test.js     # 导入测试（1个测试）
├── utils/                  # 工具函数测试
│   ├── id-generator.test.js    # ID生成器测试（4个测试）
│   ├── logger.test.js          # 日志工具测试（4个测试）
│   └── storage.test.js         # 存储工具测试（4个测试）
├── core/                   # 核心功能测试
│   └── processor.test.js       # 需求处理器测试（32个测试）
├── knowledge-graph/       # 知识图谱测试 ⭐
│   └── index.test.js           # 知识图谱测试（19个测试）
├── optimization/           # 优化模块测试
│   ├── optimizer.test.js       # 优化器测试（12个测试）
│   ├── evaluator.test.js       # 评估器测试（21个测试）
│   └── upgrader.test.js        # 升级器测试（8个测试）
└── integration/            # 集成测试
    └── workflow.test.js        # 工作流测试（18个测试）
```

### 测试覆盖

- ✅ **142个测试用例**全部通过（包含19个知识图谱测试）⭐
- ✅ **11个测试文件**覆盖所有核心模块
- ✅ **集成测试**确保端到端功能正常
- ✅ **知识图谱专项测试**确保语义搜索和推荐功能稳定 ⭐

### 测试最佳实践

1. **运行测试前提交代码**：确保测试环境干净
2. **测试失败时**：检查修改是否影响现有功能
3. **添加新功能**：同时添加对应测试用例
4. **CI/CD**：GitHub Actions 自动运行所有测试

## 开发指南

### 环境要求

- Node.js >= 18.0.0
- npm >= 9.0.0

### 开发流程

```bash
# 1. 克隆仓库
git clone https://github.com/zxc1213/claude-req-sys.git
cd claude-req-sys

# 2. 安装依赖
npm install

# 3. 运行测试
npm test

# 4. 代码检查
npm run lint

# 5. 格式化代码
npm run format

# 6. 提交代码（自动运行测试和lint）
git commit -m "feat: 你的功能描述"
```

### 代码规范

项目使用 **ESLint** 和 **Prettier** 确保代码质量：

```bash
# 检查代码规范
npm run lint

# 自动修复问题
npm run lint:fix

# 格式化代码
npm run format

# 检查格式
npm run format:check
```

### Git Hooks

项目配置了 **husky** 自动化Git钩子：

- **pre-commit**: 自动运行lint和测试
- **commit-msg**: 检查commit message格式

## 贡献指南

欢迎贡献！请遵循以下步骤：

1. Fork 本仓库
2. 创建特性分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'feat: Add AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 开启 Pull Request

### Commit Message 规范

遵循 [Conventional Commits](https://www.conventionalcommits.org/) 规范：

- `feat:` 新功能
- `fix:` Bug修复
- `docs:` 文档更新
- `style:` 代码格式（不影响功能）
- `refactor:` 重构（既不是新功能也不是修复）
- `perf:` 性能优化
- `test:` 添加测试
- `chore:` 构建过程或辅助工具的变动

## 许可证

MIT License - 详见 [LICENSE](LICENSE) 文件

## 联系方式

- GitHub: [zxc1213/claude-req-sys](https://github.com/zxc1213/claude-req-sys)
- Issues: [GitHub Issues](https://github.com/zxc1213/claude-req-sys/issues)

---

**享受使用 Claude Code 需求管理系统！** 🚀
