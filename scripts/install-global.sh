#!/usr/bin/env bash
set -euo pipefail

# ClaudeReqSys 全局安装脚本
# 安装到 ~/.claude/ 目录，所有项目共享

REPO="$(cd "$(dirname "$0")/.." && pwd)"
GLOBAL_CLAUDE="$HOME/.claude"

echo "🚀 ClaudeReqSys 全局安装"
echo "安装位置: $GLOBAL_CLAUDE"
echo

# 1. 创建全局目录结构
echo "📁 创建全局目录结构..."
mkdir -p "$GLOBAL_CLAUDE/commands"
mkdir -p "$GLOBAL_CLAUDE/skills"
mkdir -p "$GLOBAL_CLAUDE/scripts"
mkdir -p "$GLOBAL_CLAUDE/templates"

# 2. 复制命令文件
echo "📋 安装命令文件..."
if [ -f "$REPO/.claude/commands/req.md" ]; then
  cp "$REPO/.claude/commands/req.md" "$GLOBAL_CLAUDE/commands/"
  echo "✓ req.md"
fi

if [ -f "$REPO/.claude/commands/metrics.md" ]; then
  cp "$REPO/.claude/commands/metrics.md" "$GLOBAL_CLAUDE/commands/"
  echo "✓ metrics.md"
fi

# 3. 链接技能文件
echo "🔗 链接技能文件..."
find "$REPO/skills" -name "req-*.md" -not -path '*/node_modules/*' | sort | while read -r skill_md; do
  name="$(basename "$skill_md")"
  target="$GLOBAL_CLAUDE/skills/$name"
  
  if [ -e "$target" ] && [ ! -L "$target" ]; then
    rm -f "$target"
  fi
  
  ln -sf "$skill_md" "$target"
  echo "✓ $name"
done

# 4. 复制脚本
echo "🛠️  安装脚本工具..."
cp "$REPO/scripts/update.sh" "$GLOBAL_CLAUDE/scripts/" 2>/dev/null || true
cp "$REPO/scripts/link-skills.sh" "$GLOBAL_CLAUDE/scripts/" 2>/dev/null || true

# 5. 复制 hooks 配置和脚本
echo "⚙️  安装 hooks 配置..."
mkdir -p "$GLOBAL_CLAUDE/scripts/hooks"
cp "$REPO/.claude/hooks.json" "$GLOBAL_CLAUDE/" 2>/dev/null || true
cp "$REPO/.claude/scripts/hooks/"*.js "$GLOBAL_CLAUDE/scripts/hooks/" 2>/dev/null || true
echo "✓ hooks 配置"

# 5. 创建项目初始化脚本
cat > "$GLOBAL_CLAUDE/scripts/init-project.sh" << 'INITSCRIPT'
#!/usr/bin/env bash
set -euo pipefail

PROJECT_ROOT="\$(pwd)"

echo "🎯 初始化 ClaudeReqSys 项目"
echo "项目位置: \$PROJECT_ROOT"
echo

mkdir -p "\$PROJECT_ROOT/.requirements/features"
mkdir -p "\$PROJECT_ROOT/.requirements/bugs"
mkdir -p "\$PROJECT_ROOT/.requirements/questions"
mkdir -p "\$PROJECT_ROOT/.requirements/adjustments"
mkdir -p "\$PROJECT_ROOT/.requirements/refactorings"
mkdir -p "\$PROJECT_ROOT/.requirements/metrics"
mkdir -p "\$PROJECT_ROOT/.requirements/metrics/reports"
mkdir -p "\$PROJECT_ROOT/.requirements/metrics/exports"
mkdir -p "\$PROJECT_ROOT/.requirements/metrics/trends"
mkdir -p "\$PROJECT_ROOT/.requirements/_system/versions"
mkdir -p "\$PROJECT_ROOT/docs/specs"
mkdir -p "\$PROJECT_ROOT/docs/guides"
mkdir -p "\$PROJECT_ROOT/docs/analysis"

echo "✅ 项目目录结构已创建"
echo
echo "📊 ClaudeReqSys 项目已就绪！"
INITSCRIPT

chmod +x "$GLOBAL_CLAUDE/scripts/init-project.sh"

echo
echo "✅ 全局安装完成!"
echo
echo "📌 使用方法:"
echo "  1. 初始化新项目:"
echo "     cd /path/to/your/project"
echo "     ~/.claude/scripts/init-project.sh"
echo
echo "  2. 直接使用（在任何项目中）:"
echo "     /req 添加新功能"
echo "     /req --dashboard"
echo
echo "  3. 更新系统:"
echo "     cd $REPO"
echo "     bash scripts/update.sh"
