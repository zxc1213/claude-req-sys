# ClaudeReqSys Agent Skills 配置

本文档说明 ClaudeReqSys 项目中自定义 Agent Skills 的使用方式和集成关系。

## 核心技能链

### 需求管理技能链

```
用户输入
  ↓
/req 命令 (.claude/commands/req.md)
  ↓
brainstorm-grill skill (.claude/skills/brainstorm-grill.md)
  ├─ 问题探索 (Brainstorming)
  ├─ 方案审查 (Grill-me)
  ├─ 设计展示
  └─ 最终审查
  ↓
需求创建
  ├─ meta.yaml
  ├─ design.md
  ├─ test-plan.md (通过 test-plan-generator) ⭐ 新增
  └─ plan.md (通过 writing-plans)
  ↓
执行计划 (executing-plans)
  ↓
[执行中遇到需求变更]
  ↓
handle-req-change skill (.claude/skills/handle-req-change.md)
  ├─ 变更分类
  ├─ 影响评估
  └─ 调整执行
```

## 自定义 Skills

### 1. brainstorm-grill

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

### 2. handle-req-change

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

### 3. test-plan-generator

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

1. **`/req` 命令** → 自动调用 `brainstorm-grill`
2. **设计文档完成** → 自动调用 `test-plan-generator` ⭐ 新增
3. **测试计划完成** → 自动调用 `writing-plans` ⭐ 调整
4. **计划创建完成** → 自动调用 `executing-plans`
5. **执行中用户提出变更** → 自动调用 `handle-req-change`
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

**推荐流程**：
```bash
/req --deep 添加复杂功能
# 或
/req 添加简单功能
```

- 复杂需求：使用 `--deep` 确保完整分析
- 简单需求：默认流程已足够
- 快速原型：使用 `--quick` 跳过深度分析

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

```
.requirements/
├── features/          # 新功能
│   └── REQ-20260513-001/
│       ├── meta.yaml          # 元数据
│       ├── design.md          # 设计文档
│       ├── test-plan.md       # 测试计划 ⭐ 新增
│       ├── plan.md            # 执行计划
│       ├── CHANGELOG.md       # 变更日志
│       └── analysis-report.md # 分析报告
├── bugs/             # Bug 修复
├── questions/        # 技术问题
├── adjustments/      # 需求调整
└── refactorings/     # 重构
```

## 重要提示

**DO**:
- ✅ 使用 `/req` 创建所有新需求
- ✅ 让 brainstorm-grill 自动进行深度分析
- ✅ 让 test-plan-generator 自动生成测试计划 ⭐ 新增
- ✅ 执行中提出变更时，让 handle-req-change 自动处理
- ✅ 记录所有变更到 CHANGELOG.md
- ✅ 参考测试计划进行开发 ⭐ 新增

**DON'T**:
- ❌ 跳过深度分析（除非使用 `--quick`）
- ❌ 跳过测试计划生成 ⭐ 新增
- ❌ 执行中未经分析就接受重大变更
- ❌ 忽略变更对已完成任务的影响
- ❌ 跳过变更记录
- ❌ 开发完成后忘记执行测试 ⭐ 新增
