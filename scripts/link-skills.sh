#!/usr/bin/env bash
set -euo pipefail

# ClaudeReqSys 技能链接脚本
# 将 src/claude/skills/ 目录中的技能链接到 .claude/skills/

REPO="$(cd "$(dirname "$0")/.." && pwd)"
DEST="$REPO/.claude/skills"

# 防止符号链接循环
if [ -L "$DEST" ]; then
  resolved="$(readlink -f "$DEST")"
  case "$resolved" in
    "$REPO"|"$REPO"/*)
      echo "error: $DEST is a symlink into this repo ($resolved)." >&2
      echo "Remove it (rm \"$DEST\") and re-run." >&2
      exit 1
      ;;
  esac
fi

mkdir -p "$DEST"

echo "🔗 ClaudeReqSys 技能链接"
echo "源目录: $REPO/src/claude/skills"
echo "目标目录: $DEST"
echo

# 查找所有技能 .md 文件（排除 README.md）并创建符号链接
find "$REPO/src/claude/skills" -name "*.md" -not -name "README.md" -not -path '*/node_modules/*' | sort | while read -r skill_md; do
  # 获取技能文件名
  name="$(basename "$skill_md")"
  target="$DEST/$name"

  # 如果目标存在且不是符号链接，先删除
  if [ -e "$target" ] && [ ! -L "$target" ]; then
    echo "⚠️  删除现有文件: $name"
    rm -rf "$target"
  fi

  # 创建符号链接
  ln -sfn "$skill_md" "$target"
  echo "✓ $name"
done

echo
echo "✅ 链接完成!"
echo "技能已安装到: $DEST"
