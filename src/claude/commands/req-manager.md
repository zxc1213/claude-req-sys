---
description: 需求管理统一入口 - 智能路由到最优处理流程
---

# 需求管理器命令

需求管理的统一入口，智能识别用户意图并路由到最优处理流程。

## 用法

\`\`\`bash
/req <描述>
/req-manager --analyze "<输入>"
\`\`\`

## 功能

### 智能意图识别

- 创建需求
- 修改需求
- 查询需求
- 分析需求

### 自动推断

- 需求类型（feature/bug/question/refactor）
- 处理模式（quick/deep/semi_auto）
- 优先处理流程

### 路由目标

- req-brainstorm - 深度分析
- req-priority - 优先级评估
- req-quality - 质量检查
- req-test-plan - 测试生成

## 自动触发

此命令通常由 \`/req\` 命令自动调用，无需手动执行。

## 手动使用场景

- 需要重新路由需求
- 需要查看路由决策
- 调试意图识别

## 相关命令

- \`/req\` - 创建需求（主入口）
- \`/req:brainstorm\` - 深度分析
- \`/req:priority\` - 优先级评估

## 版本历史

v0.6.0 - 初始版本
