---
description: 智能需求管理系统 - 从需求到测试的全流程自动化
---

# 需求管理系统命令 (/req)

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

## 执行步骤

当用户运行 `/req` 命令时，按照以下步骤执行：

### 1. 解析命令参数
解析用户输入的选项和描述，确定：
- 需求类型（feature/bug/question/adjust/refactor）
- 是否使用自动化模式
- 是否是查询命令

### 2. 处理查询命令

**`--dashboard` 或 `--list`**：
运行 `node .claude/scripts/requirement-manager/index.js dashboard` 显示仪表板

**`--active`**：
运行 `node .claude/scripts/requirement-manager/index.js active` 显示当前活跃需求

**`--status <id>`**：
运行 `node .claude/scripts/requirement-manager/index.js status <id>` 显示需求状态

### 3. 创建新需求

对于非查询命令，创建新需求：

1. **生成需求 ID**：使用 `REQ-YYYYMMDD-XXX` 格式
2. **确定需求类型**：根据选项确定（默认 feature）
3. **创建需求文件**：在 `.requirements/<type>/` 目录下创建 `REQ-XXX.md`
4. **初始化需求内容**：
   ```markdown
   # REQ-XXX: <标题>

   **类型**: <feature|bug|question|adjust|refactor>
   **优先级**: P2
   **状态**: pending
   **创建时间**: <timestamp>
   **描述**: <用户输入的描述>

   ## 分析

   ## 实现计划

   ## 验证标准
   ```

5. **更新指标**：更新 `.requirements/_system/metrics.yaml`

### 4. 自动化模式（可选）

如果使用 `--auto` 或 `--conservative`：
- 调用相应的 skill（brainstorming、systematic-debugging 等）
- 自动分析需求并生成实现计划
- 更新需求文件内容

### 5. 返回结果

向用户显示：
- 需求创建成功信息
- 需求 ID 和文件路径
- 下一步操作建议

## 示例执行流程

### 示例 1：创建新功能
```
用户输入: /req 添加用户登录功能

执行步骤：
1. 解析：类型=feature，描述="添加用户登录功能"
2. 生成 ID：REQ-20260507-001
3. 创建文件：.requirements/features/REQ-20260507-001.md
4. 初始化内容并写入文件
5. 返回：✅ 需求已创建：REQ-20260507-001
```

### 示例 2：Bug 报告
```
用户输入: /req --bug 登录按钮点击无响应

执行步骤：
1. 解析：类型=bug，描述="登录按钮点击无响应"
2. 生成 ID：REQ-20260507-002
3. 创建文件：.requirements/bugs/REQ-20260507-002.md
4. 返回：✅ Bug 已记录：REQ-20260507-002
```

### 示例 3：查看仪表板
```
用户输入: /req --dashboard

执行步骤：
1. 解析：查询=dashboard
2. 运行：node .claude/scripts/requirement-manager/index.js dashboard
3. 返回：仪表板数据（需求统计、状态分布等）
```

## 注意事项

- 需求 ID 必须唯一，避免冲突
- 文件路径使用正确的类型目录
- 自动化模式需要相应 skill 已安装
- 仪表板需要 Node.js 环境运行脚本
