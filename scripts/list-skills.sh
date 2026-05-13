#!/usr/bin/env bash
set -euo pipefail

# ClaudeReqSys 技能列表
# 列出所有可用的技能

REPO="$(cd "$(dirname "$0")/.." && pwd)"

echo "📋 ClaudeReqSys 技能列表"
echo "================================"
echo

# 按分类列出技能
for category in core quality analysis change utils; do
    if [ -d "$REPO/skills/$category" ]; then
        echo "## $category"
        find "$REPO/skills/$category" -name "*.md" -not -name "README.md" | while read -r skill; do
            name=$(basename "$skill" .md)
            echo "  - $name"
        done
        echo
    fi
done

echo "================================"
echo "总计: $(find "$REPO/skills" -name "*.md" -not -name "README.md" | wc -l) 个技能"
