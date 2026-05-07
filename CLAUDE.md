# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## 项目概述

智能需求管理与自动化执行系统，为 Claude Code 提供从需求捕获到测试完成的全流程管理能力。核心特点是类型路由、Skill 调度和自我优化。

**技术栈**：Node.js (ES Modules), no bundler, 使用 js-yaml 处理配置文件

## 开发命令

```bash
# 运行所有测试
npm test

# 代码检查
npm run lint

# 格式化代码
npm run format

# 直接运行模块（ESM）
node .claude/scripts/requirement-manager/index.js
```

## 架构设计

### 系统分层

```
CLI 入口 (.claude/commands/)
    ↓
核心引擎层
    ├── Processor: 需求创建和状态管理
    ├── TypeRouter: 类型识别和 Skill 路由
    ├── Scheduler: 执行计划生成和 Skill 调用
    └── 执行跟踪: 实现中 (core/executor.js 占位)
    ↓
数据存储层 (requirements/)
    ├── 按类型分目录存储
    └── meta.yaml 作为核心元数据
    ↓
功能层
    ├── security: 敏感信息检测和脱敏
    ├── similarity: Fuse.js 模糊搜索查重
    ├── git: Git 集成（分支创建、commit 生成）
    └── optimization: 自我评价和系统升级
```

### 核心数据流

**需求创建流程**：
```
用户输入 → parseType() 识别类型和模式
    ↓
security.filterRequirement() 安全检查
    ↓
Processor.create() 创建需求记录和元数据
    ↓
Scheduler.schedule() 生成执行计划
    ↓
返回 skill 调用提示词
```

**执行模式映射**（关键，index.js 依赖此映射）：
- `full_auto` → `fully` (全自动)
- `semi_auto` → `semi` (半自动，默认)
- `manual` → `manual` (手动)

### 类型路由系统

TypeRouter 是核心，定义了每种需求类型的 skill 调用链和执行阶段：

| 类型 | primarySkill | optionalSkills | phases |
|------|-------------|---------------|--------|
| feature | brainstorming | writing-plans | analysis, planning, implementation, testing |
| bug | systematic-debugging | writing-plans | investigation, diagnosis, fix, verification |
| question | research | - | research, analysis, answer |
| adjustment | brainstorming | writing-plans | review, analysis, planning, implementation |
| refactor | code-explorer | writing-plans | exploration, planning, refactoring, testing |

添加新类型时需要同步更新：
1. `TYPE_PREFIXES` 和 `TYPE_DIRS` (processor.js)
2. `ROUTES` 配置 (router.js)
3. `FLAG_MAPPING` (processor.js，如果需要命令行标志)

## 需求存储结构

```
requirements/
├── features/              # 新功能
│   └── FEAT-0001/
│       ├── meta.yaml     # 核心元数据
│       └── raw.md        # 原始需求描述
├── bugs/                  # Bug 修复
│   └── BUG-0001/
├── questions/             # 技术问题
│   └── QUES-0001/
├── adjustments/           # 需求调整
│   └── ADJU-0001/
└── refactors/             # 重构
    └── REF-0001/
```

**meta.yaml 核心字段**：
- `id`: 唯一标识，格式为 `{TYPE_PREFIX}-{SEQ}`
- `type`: 需求类型
- `status`: open → planning → in_progress → testing → completed
- `mode`: full_auto / semi_auto / manual
- `dependencies`: blocking, blocked_by, related, duplicates, supersedes

## 安全过滤

SecurityFilter 自动检测并脱敏：
- **credentials**: 密码、密钥、token
- **pii**: 邮箱、身份证号、SSN
- **internal**: confidential, secret 等标记
- **apiKeys**: 32+ 字符字符串
- **ips**: IP 地址

严重级别：none < low < medium < high < critical

## 相似度检测

使用 Fuse.js 进行模糊搜索，权重：
- title: 40%
- description: 60%

默认阈值：0.7（可调）

相似度级别：
- ≥0.9: 非常高（高度疑似重复）
- ≥0.8: 高（可能重复）
- ≥0.7: 中等（部分相似）
- ≥0.6: 低
- <0.6: 非常低

## Git 集成

分支命名规则：`{type}/{id}-{shortTitle}`
- example: `feature/FEAT-0001-user-login`

Commit 格式：`[{shortId}] {type}: {message}`
- example: `[FEAT-0001] feat: 实现用户登录功能`

## 自我优化系统

**优化流程**：
1. Collector 收集执行数据
2. Evaluator 评估性能并生成优化建议
3. Upgrader 应用优化决策并创建版本快照
4. 支持回滚到任意历史版本

**危险操作类型**（需要特殊验证）：
- destructive, delete_data, drop_table, force_push

## Hooks 集成

系统配置了两个 hooks（.claude/settings.json）：
- **PostToolUse**: 每次 Edit/Write/Bash 后更新需求记录
- **Stop**: 会话结束时生成需求执行总结

## ID 生成规则

格式：`{TYPE_PREFIX}-{YYYY}{MM}{DD}-{SEQ}`

前缀映射：
- feature → FEAT
- bug → BUG
- question → QUES
- adjustment → ADJU
- refactor → REF

## 扩展指南

### 添加新的需求类型

1. 更新 `processor.js` 中的类型映射
2. 在 `router.js` 的 `ROUTES` 中添加路由配置
3. 在 `scheduler.js` 中添加对应的 skill 提示词模板（可选）
4. 更新 `FLAG_MAPPING` 如果需要命令行快捷方式

### 添加新的 Skill

在 `scheduler.js` 的 `PROMPT_TEMPLATES` 中添加模板，或使用 `addPromptTemplate()` 动态添加。

### 自定义安全模式

修改 `security.js` 中的 `patterns` 对象来调整检测规则。

## 注意事项

- 所有模块使用 ES Modules (`import`/`export`)
- 使用单例模式导出核心类实例
- 异步操作统一使用 `async/await`
- 错误处理要区分业务错误和系统错误
- 元数据修改时记得更新 `updatedAt` 时间戳
- Git 操作前先检查是否在 Git 仓库中
