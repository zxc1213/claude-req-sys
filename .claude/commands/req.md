---
description: 智能需求管理系统 - 从需求到测试的全流程自动化，集成深度需求分析
---

# 需求管理系统命令

智能需求管理系统，为 Claude Code 提供从需求捕获到测试完成的全流程管理能力。

**核心特性**：集成 `brainstorm-grill` 深度分析模式，确保每个需求都经过完整的探索和审查。

## 用法

```bash
/req [选项] <描述>
```

## 选项

### 类型选项
- `--feature`, `-f` : 新功能（默认）
- `--bug`, `-b` : Bug 修复
- `--question`, `-q` : 技术问题
- `--adjust`, `-a` : 需求调整
- `--refactor`, `-r` : 重构

### 分析选项
- `--quick` : 快速模式，跳过深度分析
- `--deep`, `-d` : 深度分析模式（默认，使用 brainstorm-grill）

### 执行选项
- `--auto` : 全自动模式
- `--conservative` : 保守模式

### 查询选项
- `--list` : 列出所有需求
- `--active` : 当前活跃需求
- `--status <id>` : 需求状态
- `--dashboard` : 显示仪表板

## 命令行为

### 查询命令

**当用户使用查询选项时**：
1. 运行对应的查询脚本
2. 格式化并显示结果
3. 不创建任何需求文件

**`--dashboard`**：
- 运行 `node .claude/scripts/requirement-manager/index.js --dashboard`
- 显示需求统计、活跃需求、最近需求列表

**`--list`**：
- 运行 `node .claude/scripts/requirement-manager/index.js --list`
- 列出所有需求及其状态

**`--active`**：
- 运行 `node .claude/scripts/requirement-manager/index.js --active`
- 显示当前活跃（in_progress）的需求

### 创建需求（集成深度分析）

**核心流程**：当用户提供描述时，自动启动 `brainstorm-grill` 深度分析流程。

```
需求输入
  ↓
[阶段1] 需求解析
  → 识别需求类型
  → 检测敏感信息
  → 查找相似需求
  ↓
[阶段2] 深度分析（brainstorm-grill）
  → 问题探索（Brainstorming）
  → 方案审查（Grill-me）
  → 设计展示
  → 最终审查
  ↓
[阶段3] 需求创建
  → 生成唯一 ID
  → 创建需求目录
  → 生成设计文档
  → 创建 meta.yaml
  ↓
[阶段4] 执行计划
  → 调用 writing-plans
  → 生成实现计划
```

#### 阶段1: 需求解析

**自动执行**：
1. 解析需求类型（从选项或描述推断）
2. **安全检查**：
   - 调用 SecurityFilter 检测敏感信息
   - 发现敏感信息时显示警告并提供脱敏建议
   - 等待用户确认后继续

3. **相似度检测**：
   - 调用 SimilarityDetector 查找相似需求
   - 显示相似需求列表
   - 询问是否继续创建新需求

#### 阶段2: 深度分析（brainstorm-grill）

**除非使用 `--quick` 选项，否则自动启动**：

**触发 `brainstorm-grill` skill**，执行四阶段分析：

1. **问题探索**（Brainstorming 主导）
   - 探索项目上下文
   - 一次一个问题地理解需求
   - 提出 2-3 个备选方案

2. **方案审查**（Grill-me 主导）
   - 逐分支深度提问
   - 遍历决策树
   - 挑战假设，提供推荐答案

3. **设计展示**（Brainstorming 主导）
   - 分段展示设计
   - 逐段确认

4. **最终审查**（Grill-me 主导）
   - 完整性检查
   - 生成决策摘要

**输出**：完整的设计文档

#### 阶段3: 需求创建

**分析完成后自动执行**：

1. 生成唯一的需求 ID（格式：REQ-YYYYMMDD-XXX）
2. 在 `.requirements/<type>/REQ-XXX/` 创建目录
3. 创建以下文件：

   ```
   .requirements/<type>/REQ-XXX/
   ├── meta.yaml              # 需求元数据
   ├── design.md              # 设计文档（来自 brainstorm-grill）
   ├── test-plan.md           # 测试计划（来自 test-plan-generator）⭐ 新增
   ├── plan.md                # 实现计划（来自 writing-plans）
   └── analysis-report.md     # 分析报告
   ```

4. **meta.yaml 结构**：
   ```yaml
   id: REQ-20260513-001
   type: feature
   title: 需求标题
   description: 需求描述
   status: planning
   created_at: 2026-05-13T10:00:00Z
   updated_at: 2026-05-13T10:00:00Z
   analysis_method: brainstorm-grill
   design_decisions:
     - decision: "决策1"
       rationale: "理由"
     - decision: "决策2"
       rationale: "理由"
   open_questions: []
   dependencies: []
   related_requirements: []
   ```

5. 更新系统指标

#### 阶段4: 执行计划

**自动调用 `writing-plans` skill**：
- 基于设计文档生成详细实现计划
- 保存为 `plan.md`
- 返回下一步操作建议

**需求目录结构**：
```
.requirements/
├── features/          # 新功能
├── bugs/             # Bug 修复
├── questions/        # 技术问题
├── adjustments/      # 需求调整
└── refactorings/     # 重构
```

## 执行模式

### 默认模式（半自动 + 深度分析）
- 启动 brainstorm-grill 深度分析
- 生成设计文档和实现计划
- 返回下一步操作建议

### 快速模式（`--quick`）
- 跳过深度分析
- 直接创建需求文件
- 生成基础执行计划

### 全自动模式（`--auto`）
- 深度分析 + 自动实现
- 自动调用相应 skill
- 创建完整的规范文档

### 保守模式（`--conservative`）
- 深度分析 + 每步确认
- 需要用户确认后继续

## 安全检查

系统会自动检测并警告：
- 敏感信息（密钥、密码、个人信息）
- API 密钥泄露
- IP 地址暴露

检测到敏感信息时会：
1. 显示警告
2. 提供脱敏建议
3. 等待用户确认后继续

## 示例

### 创建新功能（默认深度分析）
```bash
/req 添加用户登录功能
/req -f 实现文件上传功能
```

**流程**：
1. 安全检查
2. 查找相似需求
3. 启动 brainstorm-grill 深度分析
4. 生成设计文档
5. 创建需求文件
6. 生成实现计划

### 快速创建（跳过深度分析）
```bash
/req --quick 修复登录页面样式
```

### Bug 报告
```bash
/req --bug 登录页面崩溃
/req -b 支付超时问题
```

### 查看仪表板
```bash
/req --dashboard
```

### 查看活跃需求
```bash
/req --active
```

## 重要说明

**DO:**
- ✅ 默认使用 brainstorm-grill 进行深度分析
- ✅ 生成有意义的需求 ID 和描述
- ✅ 检查相似需求，避免重复
- ✅ 更新系统指标
- ✅ 保存完整的设计文档和决策记录

**DON'T:**
- ❌ 除非使用 `--quick`，否则跳过深度分析
- ❌ 不经过分析直接创建需求
- ❌ 忽略安全检查警告
- ❌ 创建重复的需求
- ❌ 跳过元数据创建

---

## 工作流示例

```bash
# 用户输入
/req 添加用户头像上传功能

# 系统响应
[1/7] 安全检查... ✓ 无敏感信息
[2/7] 相似度检测... 发现 1 个相似需求
      → REQ-20260510-003: 用户资料管理
      是否继续? [Y/n]

[3/7] 启动深度分析...
      # 进入 brainstorm-grill 流程
      - 阶段1: 问题探索
      - 阶段2: 方案审查
      - 阶段3: 设计展示
      - 阶段4: 最终审查

[4/7] 生成测试计划... ⭐ 新增
      # 调用 test-plan-generator
      - 功能测试用例: 8 个
      - API 测试用例: 12 个
      - 性能测试用例: 3 个
      - 安全测试用例: 5 个

[5/7] 创建需求...
      → ID: REQ-20260513-001
      → 路径: .requirements/features/REQ-20260513-001/

[6/7] 生成设计文档... ✓
[7/7] 生成实现计划... ✓

✓ 需求创建完成！
  设计文档: .requirements/features/REQ-20260513-001/design.md
  测试计划: .requirements/features/REQ-20260513-001/test-plan.md ⭐ 新增
  实现计划: .requirements/features/REQ-20260513-001/plan.md

下一步: 开始实现或查看计划详情
```

---

## 集成说明

此命令集成了以下功能模块：

**核心模块**：
- **Processor**: 需求创建和状态管理
- **SecurityFilter**: 敏感信息检测和脱敏
- **SimilarityDetector**: 相似需求检测
- **Scheduler**: 执行计划生成和 Skill 调用
- **Dashboard**: 需求可视化和统计

**Skills 集成**：
- **brainstorm-grill**: 深度需求分析（默认启用）
- **test-plan-generator**: 测试计划生成（自动触发）⭐ 新增
- **writing-plans**: 实现计划生成
- **类型特定 skills**: 根据需求类型自动调用

**需要 Node.js 环境支持**（用于查询命令）。
