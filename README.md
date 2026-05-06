# Claude Code 需求管理系统

智能需求管理与自动化执行系统，为 Claude Code 提供从需求到测试的全流程管理能力。

## 特性

- 📋 **多类型支持**：新功能、Bug 修复、技术问题、需求调整、重构
- 🤖 **智能自动化**：集成 brainstorming、systematic-debugging 等 skills
- 📊 **可视化仪表板**：实时查看项目状态和进度
- 🔗 **关系图谱**：管理需求间的依赖和关联
- 🧠 **智能去重**：自动检测相似需求，避免重复工作
- 🔒 **安全过滤**：自动检测和脱敏敏感信息
- 🌳 **Git 集成**：自动创建分支、生成 commit message
- 📈 **持续升级**：自我评价和优化系统性能
- 👥 **团队协作**：支持多人协作和权限管理
- 💰 **成本优化**：智能控制 Token 使用

## 快速开始

```bash
# 创建新需求
/req 添加用户登录功能

# Bug 报告
/req --bug 登录页面在移动端显示异常

# 技术问题
/req --question 如何优化数据库查询性能

# 查看仪表板
/req --dashboard

# 查看系统状态
/req --status
```

## 项目结构

```
.claude/
├── commands/                    # 命令定义
├── scripts/
│   └── requirement-manager/     # 核心实现
└── settings.json               # 配置文件
```

## 文档

- [设计文档](docs/specs/README.md)
- [使用指南](docs/guides/README.md)

## 版本

v0.1.0 - 初始设计
