#!/usr/bin/env bash
set -euo pipefail

# ClaudeReqSys 安装后脚本
# 在 npm install 后自动执行

# 检测是否是全局安装
if [ "${npm_config_global:-}" = "true" ]; then
  echo "🚀 ClaudeReqSys 全局安装"

  # 获取包安装位置
  PKG_PATH="${npm_package_json%-package.json}"

  # 创建全局目录
  GLOBAL_CLAUDE="$HOME/.claude"
  mkdir -p "$GLOBAL_CLAUDE/commands"
  mkdir -p "$GLOBAL_CLAUDE/scripts/hooks"

  # 复制命令文件
  if [ -d "$PKG_PATH/src/claude/commands" ]; then
    echo "📋 安装命令文件..."
    cp "$PKG_PATH"/src/claude/commands/*.md "$GLOBAL_CLAUDE/commands/" 2>/dev/null || true
    echo "  ✓ 命令文件已安装"
  fi

  # 复制 hooks 配置
  if [ -f "$PKG_PATH/src/config/hooks.json" ]; then
    echo "⚙️  安装 hooks 配置..."
    cp "$PKG_PATH/src/config/hooks.json" "$GLOBAL_CLAUDE/hooks.json"
    echo "  ✓ hooks 配置已安装"
  fi

  # 复制 hooks 脚本
  if [ -d "$PKG_PATH/src/scripts/hooks" ]; then
    echo "🔧 安装 hooks 脚本..."
    cp "$PKG_PATH"/src/scripts/hooks/*.js "$GLOBAL_CLAUDE/scripts/hooks/" 2>/dev/null || true
    echo "  ✓ hooks 脚本已安装"
  fi

  # 创建技能符号链接
  if [ -d "$PKG_PATH/src/claude/skills" ]; then
    echo "🔗 链接技能文件..."
    mkdir -p "$GLOBAL_CLAUDE/skills"

    find "$PKG_PATH/src/claude/skills" -name "req-*.md" -not -name "README.md" | sort | while read -r skill_md; do
      name="$(basename "$skill_md")"
      target="$GLOBAL_CLAUDE/skills/$name"

      if [ -e "$target" ] && [ ! -L "$target" ]; then
        rm -f "$target"
      fi

      ln -sf "$skill_md" "$target"
    done
    echo "  ✓ 技能已链接"
  fi

  echo ""
  echo "✅ 全局安装完成!"
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
  echo "  3. 更新系统:"
  echo "     claude-req-update"
  echo ""

fi
# 本地安装时也创建技能链接（用于开发）
if [ -d "src/claude/skills" ] && [ ! -e ".claude" ]; then
  echo "🔗 链接技能文件（开发模式）..."
  bash scripts/link-skills.sh
fi
