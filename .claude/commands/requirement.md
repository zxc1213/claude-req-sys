---
name: requirement
description: 智能需求管理系统 - 从需求到测试的全流程自动化
---

# 需求管理系统命令

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

## 示例
```bash
/req 添加用户登录功能
/req --bug 登录页面在移动端显示异常
/req --dashboard
```
