#!/usr/bin/env node

/**
 * ClaudeReqSys npm 安装后设置脚本
 * npm install -g 时自动执行
 */

import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// 获取包的安装位置
const packageJsonPath = process.env.npm_package_json;
if (!packageJsonPath) {
  console.log('ℹ️  本地开发模式，跳过自动安装');
  process.exit(0);
}

const pkgDir = path.dirname(packageJsonPath);
const globalClaude = path.join(process.env.HOME || process.env.USERPROFILE, '.claude');

console.log('🚀 ClaudeReqSys npm 全局安装');
console.log('包位置:', pkgDir);
console.log('安装目标:', globalClaude);
console.log('');

try {
  // 创建全局目录
  const dirs = [
    path.join(globalClaude, 'commands'),
    path.join(globalClaude, 'skills'),
    path.join(globalClaude, 'scripts'),
    path.join(globalClaude, 'scripts/hooks')
  ];

  dirs.forEach(dir => {
    fs.mkdirSync(dir, { recursive: true });
  });

  // 复制命令文件
  const commandsDir = path.join(pkgDir, 'src', 'claude', 'commands');
  if (fs.existsSync(commandsDir)) {
    console.log('📋 安装命令文件...');
    const files = fs.readdirSync(commandsDir);
    files.forEach(file => {
      if (file.endsWith('.md')) {
        fs.copyFileSync(
          path.join(commandsDir, file),
          path.join(globalClaude, 'commands', file)
        );
      }
    });
    console.log('  ✓ 命令文件');
  }

  // 复制 hooks 配置
  const hooksJson = path.join(pkgDir, 'src', 'config', 'hooks.json');
  if (fs.existsSync(hooksJson)) {
    console.log('⚙️  安装 hooks 配置...');
    fs.copyFileSync(hooksJson, path.join(globalClaude, 'hooks.json'));
    console.log('  ✓ hooks 配置');
  }

  // 复制 hooks 脚本
  const hooksDir = path.join(pkgDir, 'src', 'scripts', 'hooks');
  if (fs.existsSync(hooksDir)) {
    console.log('🔧 安装 hooks 脚本...');
    const files = fs.readdirSync(hooksDir);
    files.forEach(file => {
      if (file.endsWith('.js')) {
        fs.copyFileSync(
          path.join(hooksDir, file),
          path.join(globalClaude, 'scripts', 'hooks', file)
        );
      }
    });
    console.log('  ✓ hooks 脚本');
  }

  // 创建技能符号链接
  const skillsDir = path.join(pkgDir, 'src', 'claude', 'skills');
  if (fs.existsSync(skillsDir)) {
    console.log('🔗 链接技能文件...');
    const skills = fs.readdirSync(skillsDir, { withFileTypes: true });

    for (const skill of skills) {
      if (skill.isDirectory()) {
        const skillPath = path.join(skillsDir, skill.name);
        const skillFiles = fs.readdirSync(skillPath);

        for (const file of skillFiles) {
          if (file.startsWith('req-') && file.endsWith('.md')) {
            const sourceFile = path.join(skillPath, file);
            const targetFile = path.join(globalClaude, 'skills', file);

            if (fs.existsSync(targetFile)) {
              fs.unlinkSync(targetFile);
            }

            fs.symlinkSync(sourceFile, targetFile);
          }
        }
      }
    }
    console.log('  ✓ 技能链接');
  }

  console.log('');
  console.log('✅ 全局安装完成!');
  console.log('');
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
  console.log('     claude-req-update');
  console.log('');

} catch (error) {
  console.error('❌ 安装失败:', error.message);
  process.exit(1);
}
