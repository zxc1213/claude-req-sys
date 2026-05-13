#!/usr/bin/env bash
set -euo pipefail

# ClaudeReqSys 安装脚本
# 使用: bash install.sh

echo "🚀 ClaudeReqSys 安装"
echo ""

# 检测是否在正确的目录
if [ ! -f "package.json" ] || [ ! -d "src" ]; then
  echo "❌ 错误：请在 claude-req-sys 根目录运行此脚本"
  echo "   cd claude-req-sys"
  echo "   bash install.sh"
  exit 1
fi

# 获取脚本所在目录（绝对路径）
REPO="$(cd "$(dirname "$0")" && pwd)"
GLOBAL_CLAUDE="$HOME/.claude"

echo "安装位置: $GLOBAL_CLAUDE"
echo ""

# 创建全局目录
echo "📁 创建目录结构..."
mkdir -p "$GLOBAL_CLAUDE/commands"
mkdir -p "$GLOBAL_CLAUDE/skills"
mkdir -p "$GLOBAL_CLAUDE/scripts/hooks"

# 复制命令文件
echo "📋 安装命令文件..."
cp "$REPO/src/claude/commands"/*.md "$GLOBAL_CLAUDE/commands/" 2>/dev/null || true
echo "  ✓ 命令文件"

# 复制 hooks 配置
echo "⚙️  安装 hooks 配置..."
cp "$REPO/src/config/hooks.json" "$GLOBAL_CLAUDE/hooks.json" 2>/dev/null || true
echo "  ✓ hooks 配置"

# 复制 hooks 脚本
echo "🔧 安装 hooks 脚本..."
cp "$REPO/src/scripts/hooks"/*.js "$GLOBAL_CLAUDE/scripts/hooks/" 2>/dev/null || true
echo "  ✓ hooks 脚本"

# 复制 requirement-manager 脚本
echo "📊 安装需求管理器..."
mkdir -p "$GLOBAL_CLAUDE/scripts/requirement-manager"
cp -r "$REPO/src/scripts/requirement-manager"/*.js "$GLOBAL_CLAUDE/scripts/requirement-manager/" 2>/dev/null || true
echo "  ✓ 需求管理器"

# 创建技能符号链接
echo "🔗 链接技能文件..."
find "$REPO/src/claude/skills" -name "req-*.md" -not -name "README.md" | sort | while read -r skill_md; do
  name="$(basename "$skill_md")"
  target="$GLOBAL_CLAUDE/skills/$name"

  if [ -e "$target" ] && [ ! -L "$target" ]; then
    rm -f "$target"
  fi

  ln -sf "$skill_md" "$target"
  echo "  ✓ $name"
done

echo ""
echo "✅ 安装完成!"
echo ""
echo "📌 使用方法:"
echo "  1. 初始化新项目:"
echo "     cd /path/to/your/project"
echo "     claude-req-init"
echo ""
echo "  2. 直接使用（在任何项目中）:"
echo "     /req 添加新功能"
echo "     /req --dashboard"
echo ""
