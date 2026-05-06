# 需求管理系统 - 用户指南

**版本**: v0.1.0  
**更新日期**: 2026-05-07

---

## 目录

- [快速开始](#快速开始)
- [基本概念](#基本概念)
- [命令参考](#命令参考)
- [工作流程](#工作流程)
- [高级功能](#高级功能)
- [最佳实践](#最佳实践)
- [故障排除](#故障排除)

---

## 快速开始

### 安装

```bash
# 克隆项目
git clone <repository-url>
cd ClaudeReqSys

# 安装依赖
npm install
```

### 创建第一个需求

```bash
# 使用 /req 命令创建需求
/req 实现用户登录功能
```

系统会：
1. ✅ 检查敏感信息
2. ✅ 解析需求类型
3. ✅ 查找相似需求
4. ✅ 创建需求记录
5. ✅ 生成执行计划

---

## 基本概念

### 需求类型

系统支持五种需求类型：

| 类型 | 前缀 | 说明 | 主要 Skill |
|------|------|------|-----------|
| **新功能** | `REQ-` | 新功能开发 | brainstorming |
| **Bug 修复** | `BUG-` | Bug 修复 | systematic-debugging |
| **技术问题** | `QST-` | 技术咨询 | research |
| **需求调整** | `ADJ-` | 需求变更 | brainstorming |
| **重构** | `REF-` | 代码重构 | code-explorer |

### 需求状态

| 状态 | 说明 |
|------|------|
| `pending` | 待处理 |
| `planning` | 规划中 |
| `in_progress` | 进行中 |
| `testing` | 测试中 |
| `completed` | 已完成 |

### 自动化级别

| 级别 | 说明 | 确认点 |
|------|------|--------|
| **conservative** | 保守模式 | 每步确认 |
| **balanced** | 平衡模式（默认） | 关键决策点确认 |
| **aggressive** | 激进模式 | 仅安全检查确认 |
| **manual** | 手动模式 | 全程手动 |

---

## 命令参考

### 主命令

#### `/req <描述>` - 创建需求（默认为新功能）

```bash
# 创建新功能需求
/req 添加用户注册功能

# 创建 Bug 修复需求
/req --bug 登录页面在移动端显示异常

# 创建技术问题
/req --question 如何优化数据库查询性能

# 创建需求调整
/req --adjust REQ-20260507-001 增加邮箱验证功能

# 创建重构任务
/req --refactor 重构用户认证模块
```

#### `/req --list` - 列出所有需求

显示所有需求及其状态。

#### `/req --active` - 显示当前活跃需求

显示当前正在处理的需求。

#### `/req --status <ID>` - 查看需求状态

```bash
/req --status REQ-20260507-001
```

#### `/req --dashboard` - 显示仪表板

显示系统统计信息和最近需求列表。

### 系统命令

#### `/req --suggestions` - 查看优化建议

基于系统评价生成的改进建议。

#### `/req --evaluate` - 自我评价

执行系统性能评价。

#### `/req --upgrade <ID>` - 应用优化

应用指定的优化方案。

---

## 工作流程

### 标准工作流

```
1. 创建需求
   ↓
2. 系统自动分析（相似度检测、类型识别）
   ↓
3. 生成执行计划
   ↓
4. 执行计划（半自动）
   ↓
5. 完成并标记
```

### 详细步骤

#### 步骤 1：创建需求

```bash
/req 实现用户头像上传功能
```

**系统响应**：
```
📋 需求管理系统

✓ 需求已创建: REQ-20260507-001

类型: feature
模式: semi_auto
描述: 实现用户头像上传功能

执行计划:
  总步骤数: 3
  检查点数: 1

下一步:
  1. 调用 skill: brainstorming
     使用 brainstorming skill 分析需求
```

#### 步骤 2：使用 Skill 分析

系统会推荐使用 `brainstorming` skill 来分析需求。

#### 步骤 3：执行实现计划

根据执行计划的步骤进行开发，系统会在关键检查点请求确认。

#### 步骤 4：完成需求

```bash
/req --status REQ-2026507-001 completed
```

---

## 高级功能

### 相似度检测

系统自动检测相似需求，避免重复工作：

```bash
/req 用户登录功能
# 系统提示：发现相似需求 REQ-20260506-001
```

### 安全过滤

系统自动检测敏感信息：

- ✅ 密码和密钥
- ✅ 个人身份信息
- ✅ 内部机密信息
- ✅ API 密钥

### Git 集成

#### 创建分支

```bash
# 系统自动为新需求创建分支
feature/REQ-20260507-001-用户头像
```

#### 生成 Commit Message

```bash
# 系统自动生成符合规范的 commit message
[REQ-001] feature: 实现用户头像上传功能
```

### 持续优化

#### 数据收集

系统自动收集：
- 需求完成率
- Skill 使用效果
- Token 使用情况
- 缓存命中率

#### 自我评价

```bash
/req --evaluate
```

输出系统健康报告和改进建议。

#### 应用优化

```bash
/req --suggestions
```

查看并应用优化方案。

---

## 最佳实践

### 需求描述

**好的描述**：
```
/req 实现基于邮箱和密码的用户登录功能，
支持记住我状态和密码重置
```

**不好的描述**：
```
/req 登录
```

### 需求类型选择

| 场景 | 推荐类型 |
|------|----------|
| 新功能开发 | `--feature` |
| 修复 Bug | `--bug` |
| 技术咨询 | `--question` |
| 修改已有需求 | `--adjust` |
| 代码重构 | `--refactor` |

### 需求跟踪

1. **定期更新状态**
   ```bash
   /req --status REQ-001 in_progress
   ```

2. **查看仪表板**
   ```bash
   /req --dashboard
   ```

3. **完成总结**
   ```bash
   /req --status REQ-001 completed
   ```

### 团队协作

- 使用清晰的描述
- 定期更新状态
- 完成后总结经验
- 利用相似度检测避免重复

---

## 故障排除

### 常见问题

#### Q: 需求创建失败？

**A**: 检查以下几点：
- 是否包含敏感信息
- 描述是否清晰
- 文件系统权限是否正常

#### Q: 相似需求误报？

**A**: 系统使用模糊匹配，可以：
- 确认是否真的相似
- 如果不相似，继续创建
- 联系管理员调整阈值

#### Q: 执行计划生成失败？

**A**: 可能原因：
- Skill 不可用
- 配置文件损坏
- 重新运行 `/req --evaluate` 诊断

### 错误码

| 错误码 | 说明 | 解决方案 |
|--------|------|----------|
| `security_check_failed` | 敏感信息检测 | 移除敏感信息后重试 |
| `similar_requirement_found` | 发现相似需求 | 确认是否继续 |
| `skill_not_available` | Skill 不可用 | 检查 Skill 配置 |
| `config_error` | 配置错误 | 检查 settings.json |

---

## 示例场景

### 场景 1：开发新功能

```bash
# 1. 创建需求
/req --feature 添加用户评论功能

# 2. 更新状态
/req --status REQ-20260507-001 in_progress

# 3. 完成需求
/req --status REQ-20260507-001 completed
```

### 场景 2：修复 Bug

```bash
# 1. 报告 Bug
/req --bug 支付页面在 Safari 下无法加载

# 2. 系统推荐 systematic-debugging skill

# 3. 完成修复
/req --status BUG-20260507-001 completed
```

### 场景 3：技术咨询

```bash
# 提问
/req --question 如何提高数据库查询性能？

# 系统推荐 research skill
# 获得答案后标记完成
/req --status QST-20260507-001 completed
```

---

## 附录

### 目录结构

```
.requirements/
├── features/           # 新功能
│   └── REQ-YYYYMMDD-XXX/
├── bugs/              # Bug 修复
│   └── BUG-YYYYMMDD-XXX/
├── questions/         # 技术问题
│   └── QST-YYYYMMDD-XXX/
├── adjustments/       # 需求调整
│   └── ADJ-YYYYMMDD-XXX/
├── refactorings/      # 重构任务
│   └── REF-YYYYMMDD-XXX/
└── _system/          # 系统核心
    ├── versions/     # 版本历史
    ├── metrics.yaml  # 性能指标
    └── templates/    # 项目模板
```

### 环境变量

| 变量 | 说明 | 默认值 |
|------|------|--------|
| `CLAUDE_BASE_DIR` | 基础目录 | `.` |
| `CLAUDE_LOG_LEVEL` | 日志级别 | `info` |

### 配置文件

**`.claude/settings.json`**
```json
{
  "hooks": {
    "PostToolUse": [...],
    "Stop": [...]
  }
}
```

---

**获取帮助**：运行 `/req --help` 或查看 [设计文档](../specs/2026-05-07-design.md)
