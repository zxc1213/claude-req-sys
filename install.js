#!/usr/bin/env node

/**
 * ClaudeReqSys 安装脚本
 * 用于将需求管理系统安装到任何项目中
 */

import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';

const ROOT = path.resolve(new URL('.', import.meta.url).pathname);
const TARGET = process.cwd();

// 需要复制的文件和目录
const COPY_ITEMS = [
  '.claude/commands',
  '.claude/scripts',
  '.claude/settings.json',
  'README.md',
  'docs'
];

console.log('🚀 ClaudeReqSys 安装向导\n');

// 1. 检查目标目录
const targetGit = path.join(TARGET, '.git');
if (!fs.existsSync(targetGit)) {
  console.log('⚠️  警告: 当前目录不是 Git 仓库');
  console.log('建议: git init\n');
}

// 2. 创建目录结构
console.log('📁 创建目录结构...');
const dirs = [
  '.claude/commands',
  '.claude/scripts/hooks',
  '.claude/scripts/requirement-manager',
  'docs/specs',
  'docs/guides',
  '.requirements/features',
  '.requirements/bugs',
  '.requirements/questions',
  '.requirements/adjustments',
  '.requirements/refactorings',
  '.requirements/_system/versions',
  '.requirements/_system/metrics',
  'tests'
];

dirs.forEach(dir => {
  const fullPath = path.join(TARGET, dir);
  fs.mkdirSync(fullPath, { recursive: true });
});

// 3. 复制文件
console.log('📋 复制系统文件...');
COPY_ITEMS.forEach(item => {
  const src = path.join(ROOT, item);
  const dst = path.join(TARGET, item);

  if (fs.statSync(src).isDirectory()) {
    copyDir(src, dst);
  } else {
    fs.copyFileSync(src, dst);
  }
});

// 4. 合并 settings.json
console.log('⚙️  配置 hooks...');
const settingsSrc = path.join(ROOT, '.claude', 'settings.json');
const settingsDst = path.join(TARGET, '.claude', 'settings.json');

let settings = {};
if (fs.existsSync(settingsDst)) {
  settings = JSON.parse(fs.readFileSync(settingsDst, 'utf8'));
}

const newSettings = JSON.parse(fs.readFileSync(settingsSrc, 'utf8'));

// 合并 hooks
if (!settings.hooks) settings.hooks = {};
if (!settings.hooks.PostToolUse) settings.hooks.PostToolUse = [];
if (!settings.hooks.Stop) settings.hooks.Stop = [];

settings.hooks.PostToolUse.push(...newSettings.hooks.PostToolUse);
settings.hooks.Stop.push(...newSettings.hooks.Stop);

fs.writeFileSync(settingsDst, JSON.stringify(settings, null, 2));

// 5. 安装依赖
console.log('📦 安装依赖...');
try {
  execSync('npm install js-yaml', { cwd: TARGET, stdio: 'inherit' });
} catch (e) {
  console.log('⚠️  依赖安装失败，请手动运行: npm install js-yaml');
}

// 6. 初始化系统文件
console.log('🎯 初始化系统...');
const metricsPath = path.join(TARGET, '.requirements/_system/metrics.yaml');
if (!fs.existsSync(metricsPath)) {
  fs.writeFileSync(metricsPath, `# 系统性能指标
version: "0.1.0"
created: ${new Date().toISOString()}

metrics:
  requirements_created: 0
  requirements_completed: 0
  skill_usage: {}
  token_usage: 0
  cache_hit_rate: 0
`);
}

// 7. 完成
console.log('\n✅ 安装完成!\n');
console.log('开始使用:');
console.log('  /req 添加你的第一个需求');
console.log('  /req --dashboard 查看仪表板\n');
console.log('文档: docs/guides/user-guide.md');

function copyDir(src, dst) {
  fs.mkdirSync(dst, { recursive: true });
  const entries = fs.readdirSync(src, { withFileTypes: true });

  for (const entry of entries) {
    const srcPath = path.join(src, entry.name);
    const dstPath = path.join(dst, entry.name);

    if (entry.isDirectory()) {
      copyDir(srcPath, dstPath);
    } else {
      fs.copyFileSync(srcPath, dstPath);
    }
  }
}
