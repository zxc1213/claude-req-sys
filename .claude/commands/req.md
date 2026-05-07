---
description: 智能需求管理系统 - 从需求到测试的全流程自动化
---

# 需求管理系统命令

智能需求管理系统，为 Claude Code 提供从需求捕获到测试完成的全流程管理能力。

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

### 自动化选项
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

### 创建需求

**当用户提供描述时**：
1. 解析需求类型和模式
2. 生成唯一的需求 ID（格式：REQ-YYYYMMDD-XXX）
3. 在 `.requirements/<type>/REQ-XXX/` 创建目录
4. 创建 `meta.yaml` 元数据文件和需求文档
5. 更新系统指标
6. 返回需求 ID 和路径

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

### 默认模式（半自动）
- 分析需求
- 生成执行计划
- 返回下一步操作建议

### 全自动模式（`--auto`）
- 自动调用相应 skill 分析需求
- 生成详细的实现计划
- 创建完整的规范文档

### 保守模式（`--conservative`）
- 手动执行每个步骤
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

### 创建新功能
```bash
/req 添加用户登录功能
/req -f 实现文件上传功能
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
- ✅ 先分析用户需求，再创建需求文件
- ✅ 生成有意义的需求 ID 和描述
- ✅ 检查相似需求，避免重复
- ✅ 更新系统指标

**DON'T:**
- ❌ 不经过分析直接创建需求
- ❌ 忽略安全检查警告
- ❌ 创建重复的需求
- ❌ 跳过元数据创建

## 集成说明

此命令集成了以下功能模块：
- **Processor**: 需求创建和状态管理
- **SecurityFilter**: 敏感信息检测和脱敏
- **Scheduler**: 执行计划生成和 Skill 调用
- **Dashboard**: 需求可视化和统计

需要 Node.js 环境支持（用于查询命令）。
