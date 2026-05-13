#!/usr/bin/env bash
set -euo pipefail

# 更新多个项目中的 ClaudeReqSys

CLAUDE_REQ_SYS="E:\AI_Project\ClaudeReqSys"

if [ ! -d "$CLAUDE_REQ_SYS" ]; then
  echo "error: ClaudeReqSys 目录不存在: $CLAUDE_REQ_SYS"
  exit 1
fi

# 更新 ClaudeReqSys 本身
echo "1️⃣ 更新 ClaudeReqSys 主仓库..."
cd "$CLAUDE_REQ_SYS"
git pull origin master

# 如果有多个项目使用此系统
echo
echo "2️⃣ 更新你的项目..."
read -p "输入你的项目路径 (留空跳过): " PROJECT_PATH

if [ -n "$PROJECT_PATH" ]; then
  cd "$PROJECT_PATH"
  bash "$CLAUDE_REQ_SYS/scripts/link-skills.sh"
  echo "✓ 项目已更新: $PROJECT_PATH"
fi

echo
echo "✅ 更新完成！请重启 Claude Code。"
