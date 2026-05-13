# ClaudeReqSys Agent Skills 配置

本文档说明 ClaudeReqSys 项目中自定义 Agent Skills 的使用方式和集成关系。

## 核心技能链

### 需求管理技能链

```
用户输入
  ↓
req-manager skill (.claude/skills/req-manager.md) ⭐ 新增统一入口
  ├─ 智能意图识别
  ├─ 自动路由到合适流程
  └─ 简化命令接口
  ↓
/req 命令 (.claude/commands/req.md)
  ↓
brainstorm-grill skill (.claude/skills/brainstorm-grill.md)
  ├─ 问题探索 (Brainstorming)
  ├─ 方案审查 (Grill-me)
  ├─ 设计展示
  └─ 最终审查
  ↓
priority-estimator skill (.claude/skills/priority-estimator.md) ⭐ 新增
  ├─ 业务价值评估
  ├─ 紧急程度分析
  ├─ 依赖关系检查
  └─ ROI 计算
  ↓
quality-gates skill (.claude/skills/quality-gates.md) ⭐ 新增
  ├─ Gate 1: 设计完成检查
  ├─ Gate 2: 测试策略检查
  ├─ Gate 3: 实施计划检查
  └─ Gate 4: 变更完成检查
  ↓
需求创建
  ├─ meta.yaml (含优先级信息) ⭐ 新增
  ├─ spec.md (统一文档) ⭐ 新格式
  └─ test-cases.md (可选详细用例) ⭐ 新格式
  ↓
执行计划 (executing-plans)
  ↓
[执行中遇到需求变更]
  ↓
handle-req-change skill (.claude/skills/handle-req-change.md)
  ├─ 变更分类
  ├─ 影响评估
  └─ 调整执行
  ↓
quality-gates Gate 4 检查 ⭐ 新增
```

## 自定义 Skills

### 1. req-manager ⭐ 新增

**用途**：需求管理统一入口，智能路由到相应的处理流程

**何时使用**：
- 用户通过 `/req` 命令输入需求时（自动触发）
- 需要简化命令输入时
- 不确定应该使用哪个 skill 时

**触发方式**：
- 自动：`/req` 命令执行时自动调用
- 手动：`/req-manager`

**功能**：
- 智能意图识别（创建/修改/查询/分析）
- 自动推断需求类型（feature/bug/question/refactor）
- 自动选择模式（quick/deep/semi_auto）
- 路由到相应的处理流程

**输出**：
- 意图识别结果
- 路由目标 skill
- 流程启动反馈

### 2. brainstorm-grill

**用途**：深度需求分析，结合头脑风暴与无情审查

**何时使用**：
- 用户通过 `/req` 创建新需求时（自动触发）
- 需要深度分析复杂需求时
- 需要审查设计方案时

**触发方式**：
- 自动：`/req` 命令创建需求时
- 手动：`/brainstorm-grill` 或在对话中描述需求

**输出**：
- 完整的设计文档
- 决策摘要
- 开放问题列表

### 3. handle-req-change

**用途**：处理任务执行过程中的需求变更

**何时使用**：
- 用户在执行中说"等等，我想要..."
- 用户提出与当前计划偏离的修改
- 发现原计划有重大缺陷

**触发方式**：
- 自动：在 `executing-plans` 执行过程中，当用户提出变更时
- 手动：`/handle-req-change`

**变更分类**：
| 类型 | 特征 | 处理方式 |
|------|------|----------|
| 小调整 | 文案、样式微调，<5分钟 | 直接执行并记录 |
| 中等变更 | 影响1-2个任务 | Grill-me 快速审查 |
| 重大变更 | 改变架构，影响多个任务 | 完整 brainstorm-grill |

**输出**：
- 变更分类
- 影响分析
- 调整后的执行计划
- CHANGELOG.md 更新

### 4. test-plan-generator

**用途**：基于设计文档自动生成完整的测试计划和测试用例

**何时使用**：
- 设计文档完成后自动触发
- 需要详细测试计划时
- 准备执行测试前

**触发方式**：
- 自动：设计文档完成后自动调用
- 手动：`/test-plan-generator`

**生成的测试类型**：
| 测试类型 | 覆盖内容 |
|----------|----------|
| 功能测试 | 正常场景、边界值、异常场景 |
| API 测试 | 参数验证、响应格式、错误码 |
| UI 测试 | 页面元素、交互流程、响应式 |
| 性能测试 | 响应时间、并发、负载 |
| 安全测试 | 输入验证、权限控制、常见漏洞 |

**输出**：
- 完整的测试计划文档
- 详细的测试用例清单
- 测试数据准备说明
- 测试执行计划

### 5. priority-estimator ⭐ 新增

**用途**：需求优先级科学评估，多维度量化分析

**何时使用**：
- brainstorm-grill 完成后（自动触发）
- 需要重新评估优先级时
- 需要生成优先级排序报告时

**触发方式**：
- 自动：设计文档完成后自动评估
- 手动：`/priority <req-id>`

**评估维度**：
| 维度 | 权重 | 说明 |
|------|------|------|
| 业务价值 | 40% | 对业务的贡献程度 |
| 紧急程度 | 30% | 时间敏感性 |
| 依赖关系 | 15% | 前置依赖和对其他需求的影响 |
| 实现成本 | 10% | 工作量和技术难度 |
| 风险评估 | 5% | 技术风险和不确定性 |

**输出**：
- meta.yaml 中的 priority 字段
- 优先级排序报告
- ROI 评估结果

### 6. quality-gates ⭐ 新增

**用途**：质量门禁系统，在关键阶段自动检查质量标准

**何时使用**：
- brainstorm-grill 完成后（Gate 1）
- test-plan-generator 完成后（Gate 2）
- writing-plans 完成后（Gate 3）
- handle-req-change 完成后（Gate 4）

**触发方式**：
- 自动：在各个阶段完成后自动触发
- 手动：`/quality-gate check <gate> <req-id>`

**检查点**：
- **Gate 1: 设计完成** - 无占位符、无矛盾、决策理由完整、架构完整
- **Gate 2: 测试策略完成** - 测试类型覆盖、关键路径测试、性能指标、安全测试
- **Gate 3: 实施计划完成** - 任务可执行、依赖清晰、时间合理、风险预案
- **Gate 4: 变更完成** - 影响评估、文档更新、测试调整、干系人通知

**输出**：
- 质量检查报告
- 通过/失败状态
- 改进建议
- 例外申请记录

### 7. doc-unifier ⭐ 新增

**用途**：统一文档结构，将5个文件简化为2个文件

**何时使用**：
- 创建新需求时（自动使用新格式）
- 需要迁移旧需求时
- 需要批量统一文档格式时

**触发方式**：
- 自动：新需求创建时使用新格式
- 手动：`/doc-unifier <req-id>` 或 `/doc-unifier --all`

**优化**：
- **旧格式**（5个文件）：design.md, test-plan.md, plan.md, analysis-report.md, CHANGELOG.md
- **新格式**（2个文件）：
  - `spec.md` - 统一主文档（包含需求分析、设计方案、测试策略、实施计划、变更历史）
  - `test-cases.md` - 可选的详细测试用例

**优势**：
- 维护成本降低 70%
- 消除信息冗余
- 单一信息源，避免不一致
- 集中式文档，减少跳转

### 8. migrate-docs ⭐ 新增

**用途**：文档迁移工具，将旧格式需求文档迁移到新的统一格式

**何时使用**：
- 需要将旧格式需求迁移到新格式时
- 批量统一现有需求文档时
- 需要回滚迁移时

**触发方式**：
- 手动：`/migrate-docs <req-id>` 或 `/migrate-docs --all`

**迁移功能**：
- 单个需求迁移：`/migrate-docs REQ-20260513-001`
- 批量迁移：`/migrate-docs --all`
- 预览迁移：`/migrate-docs REQ-20260513-001 --dry-run`
- 交互式迁移：`/migrate-docs --all --interactive`
- 查看状态：`/migrate-docs --status`
- 生成报告：`/migrate-docs --report`

**安全特性**：
- 自动备份：迁移前自动创建 `.backup/` 目录
- 验证检查：验证生成的文档完整性
- 回滚机制：支持回滚到迁移前状态
- 交互确认：重要操作需要用户确认

**迁移流程**：
1. 检查和备份（创建 .backup 目录）
2. 读取现有文档（design.md, test-plan.md, plan.md 等）
3. 提取和整合内容（提取各部分内容到统一结构）
4. 生成新格式文档（spec.md + test-cases.md）
5. 验证和清理（验证完整性，删除旧文件）

**输出**：
- spec.md: 统一的主文档
- test-cases.md: 可选的详细测试用例
- .backup/: 备份目录
- 迁移报告

### 9. verification-checklist ⭐ 新增

**用途**：验证检查清单，在关键阶段提供系统性的验证项

**何时使用**：
- brainstorm-grill 完成后（设计验证）
- 代码实现完成后（实现验证）
- 准备部署前（部署验证）

**触发方式**：
- 自动：在各个阶段完成后自动触发
- 手动：`/verification-checklist <checkpoint> <req-id>`

**检查点**：
- **Checkpoint 1: 设计验证** - 技术可行性、架构完整性、安全风险、对比分析
- **Checkpoint 2: 实现验证** - 代码质量、测试覆盖、性能验证、安全验证
- **Checkpoint 3: 部署验证** - 部署准备、上线验证

**验证项**：
- 20+ 验证项覆盖技术可行性、架构完整性、安全风险等
- 自动检查：代码风格、测试覆盖率、类型检查
- 手动确认：架构评审、性能测试、安全评估

**输出**：
- 验证检查清单
- 验证报告（通过率、未通过项、风险项、建议）
- 验证状态（通过/未通过/部分通过）

### 10. metrics ⭐ 新增

**用途**：度量体系，收集和分析项目关键指标

**何时使用**：
- 需要查看项目指标时
- 生成周报/月报时
- 导出度量数据时

**触发方式**：
- 手动：`/metrics [选项]`
- 自动：定期收集数据（通过 collect.js 脚本）

**度量维度**：
- **效率指标**：需求交付周期、创建时间、实现时间、流程效率
- **质量指标**：返工率、质量门禁通过率、Bug密度、验证通过率
- **变更指标**：变更频率、重大变更占比、变更响应时间、影响评估准确率
- **价值指标**：完成率、优先级准确率、ROI达成率、用户满意度

**功能**：
- 查看指标：`/metrics --efficiency` / `--quality` / `--changes` / `--value`
- 趋势分析：`/metrics --trend <metric>`
- 生成报告：`/metrics --report week` / `month`
- 导出数据：`/metrics --export json` / `csv` / `markdown`
- 数据收集：`/metrics --collect`

**输出**：
- 度量数据文件（.requirements/metrics/data.yaml）
- 度量报告（Markdown）
- 趋势图表（ASCII）
- 告警通知（当指标异常时）

## 执行流程规范

### 标准执行流程

```bash
# 1. 创建需求
/req 添加用户头像上传功能
  → 自动启动 brainstorm-grill
  → 生成设计文档
  → 自动生成测试计划 ⭐ 新增
  → 创建需求文件

# 2. 执行计划
[自动进入 executing-plans]
  → 按任务列表执行

# 3. 处理变更（如需要）
[用户提出变更]
  → 自动调用 handle-req-change
  → 评估影响
  → 调整计划

# 4. 完成开发
[所有任务完成]
  → 调用 finishing-a-development-branch
  → 提交、测试、合并
```

### 执行中变更处理规范

当用户在执行过程中提出变更时：

1. **立即暂停当前任务**
2. **确认变更内容**
3. **调用 handle-req-change**：
   - 自动分类变更
   - 小调整：直接执行
   - 中等变更：快速审查后调整
   - 重大变更：启动 brainstorm-grill 重新分析
4. **更新相关文档**
5. **确认后继续执行**

## Superpowers Skills 集成

本项目集成了以下 Superpowers 官方 skills：

| Skill | 用途 | 触发时机 |
|-------|------|----------|
| `superpowers:brainstorming` | 头脑风暴设计 | brainstorm-grill 内部调用 |
| `superpowers:executing-plans` | 执行实现计划 | 需求创建后自动进入 |
| `superpowers:writing-plans` | 生成实现计划 | 测试计划生成后调用 |
| `superpowers:finishing-a-development-branch` | 完成开发分支 | 所有任务完成后调用 |

## 配置说明

### 自动触发机制

以下操作会自动触发相应 skills：

1. **`/req` 命令** → 自动调用 `req-manager` ⭐ 新增
   - `req-manager` 分析意图并路由到相应流程

2. **需求创建流程** → 按顺序自动调用：
   - `brainstorm-grill` → 深度需求分析
   - `priority-estimator` → 优先级评估 ⭐ 新增
   - `quality-gates` (Gate 1) → 设计质量检查 ⭐ 新增
   - `test-plan-generator` → 生成测试策略
   - `quality-gates` (Gate 2) → 测试质量检查 ⭐ 新增
   - `writing-plans` → 生成实施计划
   - `quality-gates` (Gate 3) → 计划质量检查 ⭐ 新增

3. **文档生成** → 自动使用 `doc-unifier` 新格式 ⭐ 新增
   - 新需求：自动生成 spec.md + test-cases.md（可选）
   - 旧需求：可手动调用迁移

4. **计划创建完成** → 自动调用 `executing-plans`

5. **执行中用户提出变更** → 自动调用 `handle-req-change`
   - 变更完成后自动调用 `quality-gates` (Gate 4) ⭐ 新增

6. **所有任务完成** → 自动调用 `finishing-a-development-branch`

### Hooks 配置

在 `.claude/hooks.json` 中配置了以下 hooks：

```json
{
  "pre:command:executing-plans": "检查是否有活跃的需求分支",
  "post:task:complete": "更新需求进度",
  "on:req-change": "自动调用 handle-req-change"
}
```

## 使用建议

### 对于新需求

**推荐流程**（简化后）⭐ 更新：
```bash
# 智能推断（推荐）
/req 添加用户登录功能
  → req-manager 自动推断为 feature + deep
  → brainstorm-grill 深度分析
  → priority-estimator 自动评估优先级
  → quality-gates 自动检查质量
  → 生成 spec.md 统一文档

# 快速模式
/req --quick 修复文案错误
  → 跳过深度分析
  → 快速创建需求

# 显式指定
/req --feature --deep 添加复杂功能
  → 明确指定类型和模式
```

- **复杂需求**：默认流程已足够（深度分析 + 质量门禁）
- **简单需求**：使用 `--quick` 快速通道
- **不确定**：直接使用 `/req`，系统自动推断最优流程

### 查看优先级 ⭐ 新增

```bash
# 查看所有需求的优先级排序
/priority --list

# 评估单个需求
/priority REQ-20260513-001

# 比较两个需求
/priority --compare REQ-001 REQ-002
```

### 质量检查 ⭐ 新增

```bash
# 检查特定门禁
/quality-gate check design REQ-20260513-001

# 检查所有门禁
/quality-gate check-all REQ-20260513-001
```

### 对于执行中变更

**原则**：
- 小调整：不要打断执行节奏
- 中等变更：局部调整，不影响全局
- 重大变更：重新分析，可能需要重新规划

**示例**：
```bash
# 场景1：文案修改
用户: "把'登录'改成'登录系统'"
AI: [直接修改] ✓ 已记录

# 场景2：添加功能点
用户: "再加一个忘记密码功能"
AI: [暂停] [快速审查] [调整计划] [继续执行]

# 场景3：架构变更
用户: "我想要实时协作而不是表单"
AI: [暂停] [完整 brainstorm-grill] [创建新需求] [重新规划]
```

## 文档结构

需求相关文档保存在 `.requirements/` 目录：

### 新格式（推荐）

```
.requirements/
├── features/          # 新功能
│   └── REQ-20260513-001/
│       ├── meta.yaml          # 元数据（含优先级信息）⭐ 新增
│       ├── spec.md            # 统一主文档 ⭐ 新格式
│       └── test-cases.md      # 详细测试用例（可选）⭐ 新格式
├── bugs/             # Bug 修复
├── questions/        # 技术问题
├── adjustments/      # 需求调整
└── refactorings/     # 重构
```

### 旧格式（已弃用）

```
.requirements/
├── features/          # 新功能
│   └── REQ-20260513-001/
│       ├── meta.yaml          # 元数据
│       ├── design.md          # 设计文档
│       ├── test-plan.md       # 测试计划
│       ├── plan.md            # 执行计划
│       ├── CHANGELOG.md       # 变更日志
│       └── analysis-report.md # 分析报告
```

### spec.md 结构（新格式）

```markdown
# [需求标题]

## 元数据
- **ID**: REQ-20260513-001
- **类型**: feature/bug/refactor/question/adjustment
- **状态**: planning/designing/implementing/testing/completed
- **优先级**: P0/P1/P2/P3/P4 ⭐ 新增
- **优先级评分**: 8.6 ⭐ 新增

## 需求分析
### 背景与目标
### 用户故事
### 验收标准
### 开放问题

## 设计方案
### 系统架构
### 核心组件
### 数据流设计
### 接口定义
### 技术选型
### 决策记录 ⭐ 新增
### 错误处理
### 安全考虑

## 测试策略
### 测试范围
### 测试类型
### 验收标准
### 性能指标

## 实施计划
### 任务分解
### 依赖关系
### 风险与应对

## 变更历史 ⭐ 新增
| 日期 | 变更内容 | 影响分析 |
|------|----------|----------|
```

## 重要提示

**DO**:
- ✅ 使用 `/req` 创建所有新需求（自动触发 req-manager）⭐ 更新
- ✅ 让 req-manager 自动选择最优流程 ⭐ 新增
- ✅ 让 brainstorm-grill 自动进行深度分析
- ✅ 让 priority-estimator 自动评估优先级 ⭐ 新增
- ✅ 让 quality-gates 自动检查质量 ⭐ 新增
- ✅ 使用新文档格式（spec.md + test-cases.md）⭐ 新增
- ✅ 让 test-plan-generator 自动生成测试策略
- ✅ 执行中提出变更时，让 handle-req-change 自动处理
- ✅ 记录所有变更到 spec.md 的变更历史部分 ⭐ 更新
- ✅ 参考测试策略进行开发

**DON'T**:
- ❌ 手动选择流程（让 req-manager 自动选择）⭐ 新增
- ❌ 跳过深度分析（除非使用 `--quick`）
- ❌ 忽略优先级评估结果 ⭐ 新增
- ❌ 跳过质量门禁检查 ⭐ 新增
- ❌ 使用旧文档格式（design.md + test-plan.md + plan.md...）⭐ 新增
- ❌ 跳过测试策略生成
- ❌ 执行中未经分析就接受重大变更
- ❌ 忽略变更对已完成任务的影响
- ❌ 开发完成后忘记执行测试
