# ClaudeReqSys 安装指南

## 📋 目录

- [安装到自己的电脑](#安装到自己的电脑)
- [分发到其他人的电脑](#分发到其他人的电脑)
- [文件结构说明](#文件结构说明)
- [常见问题](#常见问题)

---

## 安装到自己的电脑

### 当前项目（E:\AI_Project\ClaudeReqSys）

项目已存在，直接使用：

```bash
cd E:\AI_Project\ClaudeReqSys
npm install
```

然后就可以用 `/req` 命令了。

### 安装到新项目

**方式一：自动安装脚本**

```bash
# 进入目标项目目录
cd /path/to/your/project

# 克隆或复制 ClaudeReqSys
git clone https://github.com/zxc1213/claude-req-sys.git ClaudeReqSys-temp
cd ClaudeReqSys-temp

# 运行安装脚本（将系统安装到当前目录）
node install.js
```

**方式二：手动安装**

1. **复制文件和目录**
```bash
# 复制以下到目标项目
.claude/
├── commands/
│   └── requirement.md
├── scripts/
│   ├── hooks/
│   │   ├── post-req-update.js
│   │   └── stop-req-summary.js
│   └── requirement-manager/

# 注意：不要复制 settings.json，避免覆盖现有配置
docs/
```

2. **安装依赖**
```bash
npm install js-yaml fuse.js chalk cli-table3 ora
```

3. **验证安装**
```bash
# 在 Claude Code 中运行
/req --dashboard
```

---

## 分发到其他人的电脑

### 方法一：npm 包（推荐）

1. **从 GitHub 安装**
```bash
# 全局安装
npm install -g https://github.com/zxc1213/claude-req-sys.git

# 或安装到项目
npm install --save-dev https://github.com/zxc1213/claude-req-sys.git
```

2. **运行安装脚本**
```bash
# 进入目标项目
cd /path/to/project

# 运行安装
claude-req-install
```

### 方法二：Git Submodule

```bash
# 在目标项目中
git submodule add https://github.com/zxc1213/claude-req-sys.git .claude-reqsys
cd .claude-reqsys
node install.js
```

### 方法三：直接下载

1. **下载并解压**
```bash
# 下载项目
wget https://github.com/zxc1213/claude-req-sys/archive/refs/heads/master.zip
unzip master.zip
cd claude-req-sys-master
```

2. **运行安装**
```bash
node install.js
```

---

## 文件结构说明

### 核心文件

```
.claude/
├── commands/requirement.md    # 自定义命令定义（必需）
├── scripts/
│   ├── hooks/                 # 自动化钩子（可选）
│   │   ├── post-req-update.js   # 工具后执行
│   │   └── stop-req-summary.js   # 停止时总结
│   └── requirement-manager/   # 核心逻辑（必需）
└── req-system-hooks.example.json  # Hooks 配置示例（参考）
```

### 工作目录

```
.requirements/
├── features/       # 新功能
├── bugs/          # Bug 修复
├── questions/     # 技术问题
├── adjustments/   # 需求调整
├── refactorings/  # 重构任务
└── _system/       # 系统核心
    ├── versions/  # 版本历史
    └── metrics/   # 性能指标
```

---

## 常见问题

### Q: 安装脚本会覆盖我的 settings.json 吗？

**A**: 不会。安装脚本只复制命令和脚本文件，不会修改你现有的 `settings.json`。

Hooks 配保存在 `req-system-hooks.example.json` 中，你可以选择性地合并到 `settings.json`。

### Q: 命令不生效？

**检查项**：
1. 确认在正确的项目目录
2. 检查 `.claude/commands/requirement.md` 是否存在
3. 重启 Claude Code

### Q: 自动化功能不工作？

**A**: 需要手动配置 Hooks：

1. 查看 `.claude/req-system-hooks.example.json`
2. 将 hooks 配置合并到 `settings.json`
3. 重启 Claude Code

### Q: 如何卸载？

```bash
# 删除系统文件
rm -rf .claude/commands/requirement.md
rm -rf .claude/scripts/requirement-manager
rm -rf .claude/scripts/hooks
rm -rf .requirements/

# settings.json 不会被修改，无需恢复
```

---

## 快速开始

安装完成后：

```bash
# 创建第一个需求
/req 添加用户登录功能

# 查看仪表板
/req --dashboard

# 查看帮助
/req --help
```

---

**获取更多帮助**：查看 [用户指南](docs/guides/user-guide.md)
