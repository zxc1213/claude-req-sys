# ClaudeReqSys 技能集合

智能需求管理系统的核心技能，采用分类组织结构。

## 目录结构

```
skills/
├── core/          # 核心需求管理
├── quality/       # 质量保证
├── analysis/      # 分析评估
├── change/        # 变更处理
└── utils/         # 辅助工具
```

## 安装

### 快速安装

```bash
# Unix/Linux/macOS
bash scripts/link-skills.sh

# Windows (PowerShell，需要管理员权限)
powershell scripts/link-skills.ps1
```

### 手动安装

1. 将 `skills/` 目录中的技能链接到 `.claude/skills/`
2. 运行 `/setup` 完成初始化配置

## 技能列表

运行 `bash scripts/list-skills.sh` 查看所有可用技能。

## 更新

```bash
# 拉取最新代码
git pull

# 重新链接技能
bash scripts/link-skills.sh
```

## 分类说明

### Core（核心）
核心需求管理功能，包括统一入口和深度分析。

### Quality（质量）
质量保证和验证，包括质量门禁和测试计划。

### Analysis（分析）
需求分析和评估，包括优先级评估和度量系统。

### Change（变更）
需求变更处理，包括变更管理和文档迁移。

### Utils（工具）
辅助工具，包括文档统一等。
