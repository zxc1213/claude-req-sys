#!/usr/bin/env node

/**
 * ClaudeReqSys npm postinstall 脚本
 * 在 npm install -g 后自动安装全局配置
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { pathToFileURL } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.dirname(__dirname);

const GLOBAL_CLAUDE = path.join(process.env.HOME || process.env.USERPROFILE, '.claude');

// 检查是否需要安装全局配置
const needsGlobalSetup = !fs.existsSync(path.join(GLOBAL_CLAUDE, 'commands', 'req.md'));

if (!needsGlobalSetup) {
  console.log('✓ ClaudeReqSys 全局配置已存在，跳过安装');
  process.exit(0);
}

console.log('🚀 ClaudeReqSys 正在自动配置...\n');

try {
  // 获取包安装位置
  // 兼容 npm 全局安装和本地开发
  let pkgDir;
  try {
    // 尝试从已安装的包获取路径
    const packageJsonPath = import.meta.resolve('claude-req-sys/package.json');
    pkgDir = path.dirname(pathToFileURL(packageJsonPath).pathname);
  } catch {
    // 如果失败，使用当前项目根目录
    pkgDir = ROOT;
  }

  // 创建全局目录
  console.log('📁 创建全局目录...');
  fs.mkdirSync(path.join(GLOBAL_CLAUDE, 'commands'), { recursive: true });
  fs.mkdirSync(path.join(GLOBAL_CLAUDE, 'skills'), { recursive: true });
  fs.mkdirSync(path.join(GLOBAL_CLAUDE, 'scripts'), { recursive: true });
  fs.mkdirSync(path.join(GLOBAL_CLAUDE, 'scripts', 'hooks'), { recursive: true });

  // 复制命令文件
  console.log('📋 安装命令文件...');
  const commandsDir = path.join(pkgDir, 'src', 'claude', 'commands');
  if (fs.existsSync(commandsDir)) {
    const files = fs.readdirSync(commandsDir);
    let commandCount = 0;
    files.forEach((file) => {
      if (file.endsWith('.md')) {
        fs.copyFileSync(path.join(commandsDir, file), path.join(GLOBAL_CLAUDE, 'commands', file));
        commandCount++;
      }
    });
    console.log(`  ✓ ${commandCount} 个命令文件`);
  }

  // 复制 hooks 配置
  console.log('⚙️  安装 hooks 配置...');
  const hooksJson = path.join(pkgDir, 'src', 'config', 'hooks.json');
  if (fs.existsSync(hooksJson)) {
    fs.copyFileSync(hooksJson, path.join(GLOBAL_CLAUDE, 'hooks.json'));
    console.log('  ✓ hooks 配置');
  }

  // 复制 hooks 脚本
  console.log('🔧 安装 hooks 脚本...');
  const hooksDir = path.join(pkgDir, 'src', 'scripts', 'hooks');
  if (fs.existsSync(hooksDir)) {
    const files = fs.readdirSync(hooksDir);
    let hookCount = 0;
    files.forEach((file) => {
      if (file.endsWith('.js')) {
        fs.copyFileSync(
          path.join(hooksDir, file),
          path.join(GLOBAL_CLAUDE, 'scripts', 'hooks', file)
        );
        hookCount++;
      }
    });
    console.log(`  ✓ ${hookCount} 个 hooks 脚本`);
  }

  // 创建技能符号链接
  console.log('🔗 链接技能文件...');
  const skillsDir = path.join(pkgDir, 'src', 'claude', 'skills');
  if (fs.existsSync(skillsDir)) {
    const skills = fs.readdirSync(skillsDir, { withFileTypes: true });
    let skillCount = 0;

    for (const skill of skills) {
      if (skill.isDirectory()) {
        const skillPath = path.join(skillsDir, skill.name);
        const skillFiles = fs.readdirSync(skillPath);

        for (const file of skillFiles) {
          if (file.startsWith('req-') && file.endsWith('.md')) {
            const sourceFile = path.join(skillPath, file);
            const targetFile = path.join(GLOBAL_CLAUDE, 'skills', file);

            if (fs.existsSync(targetFile)) {
              fs.unlinkSync(targetFile);
            }

            fs.symlinkSync(sourceFile, targetFile);
            skillCount++;
          }
        }
      }
    }
    console.log(`  ✓ ${skillCount} 个技能链接`);
  }

  console.log('\n✅ ClaudeReqSys 自动配置完成!\n');
  console.log('📌 现在可以在任何项目中直接使用:');
  console.log('   /req 添加新功能');
  console.log('   /req --dashboard');
  console.log('');
} catch (error) {
  console.error('❌ 自动配置失败:', error.message);
  console.log('\n💡 提示: 您可以稍后手动运行 claude-req-init 来完成配置\n');
  // 不退出，允许 npm install 完成
}
