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

### 安装到新项目

**方式一：自动安装脚本**

```bash
# 进入目标项目目录
cd /path/to/your/project

# 克隆或复制 ClaudeReqSys
git clone <repository-url> ClaudeReqSys-temp
cd ClaudeReqSys-temp

# 运行安装脚本（将系统安装到上级目录）
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
│       ├── index.js
│       ├── router.js
│       ├── detector.js
│       ├── filters/
│       ├── integrations/
│       └── optimization/
└── settings.json

docs/
├── specs/
└── guides/

requirements/  # 创建空目录
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

1. **发布到 npm**（或私有 npm）

```bash
# 在 ClaudeReqSys 目录
npm publish
```

2. **用户安装**

```bash
# 全局安装
npm install -g claude-requirement-system

# 或安装到项目
npm install --save-dev claude-requirement-system
```

3. **运行安装脚本**

```bash
# 进入目标项目
cd /path/to/project

# 运行安装
claude-req-install
# 或
npx claude-requirement-system install
```

### 方法二：Git Submodule

```bash
# 在目标项目中
git submodule add <repository-url> .claude-reqsys
cd .claude-reqsys
node install.js
```

### 方法三：复制粘贴

最简单的方式：

1. **打包项目**
```bash
cd E:\AI_Project\ClaudeReqSys
tar -czf claude-reqsys.tar.gz \
  .claude/ \
  docs/ \
  install.js \
  package.json \
  README.md
```

2. **分发压缩包**

3. **用户解压并安装**
```bash
tar -xzf claude-reqsys.tar.gz
cd claude-reqsys
node install.js
```

---

## 文件结构说明

### 核心文件

```
.claude/
├── commands/requirement.md    # 自定义命令定义
├── scripts/
│   ├── hooks/                 # 自动化钩子
│   │   ├── post-req-update.js   # 工具后执行
│   │   └── stop-req-summary.js   # 停止时总结
│   └── requirement-manager/   # 核心逻辑
└── settings.json              # Claude Code 配置
```

### 工作目录

```
.requirements/
├── features/       # 新功能需求
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

### Q: 命令不生效？

**检查项**：
1. `.claude/commands/requirement.md` 是否存在
2. 重启 Claude Code
3. 检查 settings.json 语法

### Q: Hooks 不执行？

**检查项**：
1. Node.js 版本 >= 18.0.0
2. 依赖是否安装：`npm list js-yaml`
3. 查看日志：`.requirements/_system/logs/`

### Q: 如何卸载？

```bash
# 删除文件
rm -rf .claude/commands/requirement.md
rm -rf .claude/scripts/requirement-manager
rm -rf .claude/scripts/hooks/post-req-update.js
rm -rf .claude/scripts/hooks/stop-req-summary.js
rm -rf .requirements/

# 编辑 settings.json，移除相关 hooks
```

### Q: 如何更新？

```bash
# 重新运行安装脚本
node install.js
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
