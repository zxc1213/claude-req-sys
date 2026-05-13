#!/usr/bin/env node

/**
 * ClaudeReqSys npm 全局安装脚本
 * npm install -g 时的安装逻辑
 */

import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';
import { execSync } from 'child_process';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.dirname(__dirname);
const GLOBAL_CLAUDE = path.join(process.env.HOME || process.env.USERPROFILE, '.claude');

console.log('🚀 ClaudeReqSys npm 全局安装');
console.log('安装位置: ' + GLOBAL_CLAUDE);
console.log();

try {
  // 1. 创建全局目录结构
  console.log('📁 创建全局目录结构...');
  const dirs = [
    path.join(GLOBAL_CLAUDE, 'commands'),
    path.join(GLOBAL_CLAUDE, 'skills'),
    path.join(GLOBAL_CLAUDE, 'scripts'),
    path.join(GLOBAL_CLAUDE, 'scripts/hooks')
  ];

  dirs.forEach(dir => {
    fs.mkdirSync(dir, { recursive: true });
  });
  console.log('  ✓ 目录创建完成');

  // 2. 复制命令文件
  console.log('\n📋 安装命令文件...');
  const commandsDir = path.join(ROOT, '.claude', 'commands');
  if (fs.existsSync(commandsDir)) {
    fs.readdirSync(commandsDir).forEach(file => {
      if (file.endsWith('.md')) {
        fs.copyFileSync(
          path.join(commandsDir, file),
          path.join(GLOBAL_CLAUDE, 'commands', file)
        );
        console.log(`  ✓ ${file}`);
      }
    });
  }

  // 3. 复制 hooks 配置和脚本
  console.log('\n⚙️  安装 hooks 配置...');
  const hooksJson = path.join(ROOT, '.claude', 'hooks.json');
  if (fs.existsSync(hooksJson)) {
    fs.copyFileSync(hooksJson, path.join(GLOBAL_CLAUDE, 'hooks.json'));
    console.log('  ✓ hooks.json');
  }

  const hooksDir = path.join(ROOT, '.claude', 'scripts', 'hooks');
  if (fs.existsSync(hooksDir)) {
    fs.readdirSync(hooksDir).forEach(file => {
      if (file.endsWith('.js')) {
        fs.copyFileSync(
          path.join(hooksDir, file),
          path.join(GLOBAL_CLAUDE, 'scripts', 'hooks', file)
        );
        console.log(`  ✓ hooks/${file}`);
      }
    });
  }

  console.log('\n✅ 全局安装完成!\n');
  console.log('📌 使用方法:');
  console.log('  1. 初始化新项目:');
  console.log('     cd /path/to/your/project');
  console.log('     claude-req-init');
  console.log('');
  console.log('  2. 直接使用（在任何项目中）:');
  console.log('     /req 添加新功能');
  console.log('     /req --dashboard');
  console.log('');
  console.log('  3. 更新系统:');
  console.log('     claude-req-update\n');

} catch (error) {
  console.error('\n❌ 安装失败:', error.message);
  process.exit(1);
}
