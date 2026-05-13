#!/usr/bin/env bash
set -euo pipefail

# ClaudeReqSys 更新脚本

REPO="$(cd "$(dirname "$0")/.." && pwd)"

echo "🔄 ClaudeReqSys 更新向导"
echo

# 1. 拉取最新代码
echo "📥 拉取最新代码..."
git pull origin master

# 2. 更新技能链接
echo "🔗 更新技能链接..."
bash "$REPO/scripts/link-skills.sh"

echo
echo "✅ 更新完成!"
echo "请重启 Claude Code 以加载最新技能。"
