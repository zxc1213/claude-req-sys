# ClaudeReqSys 安装手册

## ⚠️ 重要说明

**Claude Code 的自定义命令只在当前工作目录的 `.claude/commands/` 下生效！**

这意味着你需要在要使用的项目目录中安装此系统。

---

## 🎯 快速安装（3步）

### 方式一：安装到当前目录

```bash
# 1. 进入 ClaudeReqSys 目录
cd E:\AI_Project\ClaudeReqSys

# 2. 运行安装脚本（安装到当前目录）
node install.js

# 3. 验证安装
/req --dashboard
```

### 方式二：安装到指定目录

```bash
# 1. 进入目标目录
cd C:\Users\19944\MyProject

# 2. 运行安装脚本（从 ClaudeReqSys 目录运行）
node E:\AI_Project\ClaudeReqSys\install.js

# 3. 验证
/req --dashboard
```

---

## 📂 安装后目录结构

安装完成后，你的项目会有：

```
你的项目/
├── .claude/
│   ├── commands/
│   │   └── requirement.md          ← 自定义命令（/req 生效的关键）
│   ├── scripts/
│   │   ├── hooks/                  ← 自动化钩子
│   │   └── requirement-manager/    ← 核心逻辑
│   └── settings.json               ← 配置文件
├── .requirements/                  ← 需求数据
└── node_modules/                   ← 依赖
```

**关键文件**：`.claude/commands/requirement.md` — 这是 `/req` 命令的定义文件。

---

## 🌍 多项目使用

如果你想在多个项目中使用：

### 方法一：逐个安装

```bash
# 项目 A
cd /path/to/project-a
node E:\AI_Project\ClaudeReqSys\install.js

# 项目 B
cd /path/to/project-b
node E:\AI_Project\ClaudeReqSys\install.js
```

### 方法二：使用全局配置（高级）

在用户主目录创建全局模板：

```bash
# 1. 复制到全局模板目录
mkdir -p ~/.claude-template/commands
cp E:\AI_Project\ClaudeReqSys/.claude/commands/requirement.md ~/.claude-template/commands/

# 2. 新项目时复制
cp -r ~/.claude-template/* /path/to/new-project/.claude/
```

---

## 🔧 故障排除

### 问题：`/req` 命令没反应

**检查清单**：

1. ✅ **确认当前目录**
```bash
pwd  # 确认在正确的项目目录
```

2. ✅ **确认命令文件存在**
```bash
ls .claude/commands/requirement.md
# 应该看到这个文件
```

3. ✅ **确认文件内容**
```bash
cat .claude/commands/requirement.md
# 应该看到命令定义（开头是 ---）
```

4. ✅ **重启 Claude Code**
```bash
# 完全退出 Claude Code，重新打开
```

---

## 🎓 工作原理

```
你输入: /req 添加登录功能
   ↓
Claude Code 查找: 当前目录/.claude/commands/requirement.md
   ↓
找到定义 → 加载命令说明
   ↓
执行: node .claude/scripts/requirement-manager/index.js "添加登录功能"
   ↓
返回结果
```

---

## 📋 完整安装示例

### 场景：在 C:\Users\19944\TestProject 中使用

```bash
# 1. 创建测试项目
mkdir C:\Users\19944\TestProject
cd C:\Users\19944\TestProject

# 2. 初始化项目（可选）
git init
npm init -y

# 3. 安装 ClaudeReqSys
node E:\AI_Project\ClaudeReqSys\install.js

# 4. 验证安装
ls .claude/commands/  # 应该看到 requirement.md

# 5. 在 Claude Code 中使用
/req --dashboard
```

---

## 💡 最佳实践

1. **为每个项目单独安装**
   - 保持项目独立性
   - 避免版本冲突

2. **版本控制**
```bash
# 提交到 Git
git add .claude/
git commit -m "添加需求管理系统"
```

3. **团队协作**
   - 将 `.claude/` 目录加入项目
   - 团队成员克隆项目后自动拥有命令

---

## 🚀 快速开始

安装完成后：

```bash
# 查看仪表板
/req --dashboard

# 创建需求
/req 添加用户登录功能

# Bug 报告
/req --bug 登录页面样式错误

# 查看所有需求
/req --list
```

---

## 📞 获取帮助

- **用户指南**：`docs/guides/user-guide.md`
- **设计文档**：`docs/specs/2026-05-07-design.md`
- **运行测试**：`npm test`

---

**记住**：`/req` 只在安装了系统的目录中生效！
