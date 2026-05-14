#!/usr/bin/env node

/**
 * ClaudeReqSys npx 安装入口
 * 使用: npx claude-req-sys
 *
 * 将配置文件复制到独立位置，不依赖 npm 缓存
 */

import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';
import { mergeHooksToSettings } from '../scripts/merge-settings.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.dirname(__dirname);

const GLOBAL_CLAUDE = path.join(process.env.HOME || process.env.USERPROFILE, '.claude');
const PKG_INSTALL_DIR = path.join(GLOBAL_CLAUDE, 'claude-req-sys');

console.log(`
╔══════════════════════════════════════════════════════════════╗
║           ClaudeReqSys 智能需求管理系统                      ║
║         为 Claude Code 提供全流程需求管理能力                ║
╚══════════════════════════════════════════════════════════════╝
`);

const reqMdPath = path.join(GLOBAL_CLAUDE, 'commands', 'req.md');
if (fs.existsSync(reqMdPath)) {
  console.log('✅ ClaudeReqSys 已安装并就绪！\n');

  // 检查 hooks 是否已合并到 settings.json
  const settingsPath = path.join(GLOBAL_CLAUDE, 'settings.json');
  let hasHooks = false;
  if (fs.existsSync(settingsPath)) {
    try {
      const settings = JSON.parse(fs.readFileSync(settingsPath, 'utf8'));
      hasHooks = !!settings.hooks;
    } catch (_error) {
      // 忽略读取错误
    }
  }

  if (!hasHooks) {
    console.log('⚙️  检测到 hooks 未配置，正在合并...');
    const hooksJson = path.join(PKG_INSTALL_DIR, 'src', 'config', 'hooks.json');
    if (fs.existsSync(hooksJson)) {
      mergeHooksToSettings(hooksJson);
    }
  }

  console.log('📌 在 Claude Code 中直接使用:');
  console.log('   /req          添加新功能');
  console.log('   /req --dashboard  查看需求仪表板');
  console.log('   /metrics      查看度量数据');
  console.log('   /commit       提交管理\n');

  // 检查版本
  try {
    const localVersion = JSON.parse(
      fs.readFileSync(path.join(ROOT, 'package.json'), 'utf8')
    ).version;
    const installedVersion = fs.existsSync(path.join(PKG_INSTALL_DIR, 'package.json'))
      ? JSON.parse(fs.readFileSync(path.join(PKG_INSTALL_DIR, 'package.json'), 'utf8')).version
      : null;

    console.log(`📦 当前版本: v${localVersion}`);
    if (installedVersion && installedVersion !== localVersion) {
      console.log(`💡 提示: 已安装 v${installedVersion}，可重新运行 npx claude-req-sys 更新`);
    }
  } catch (_error) {
    // 忽略版本读取错误
  }

  process.exit(0);
}

console.log('🚀 正在配置 ClaudeReqSys...\n');
console.log('💡 将文件复制到独立位置，清理 npm 缓存不影响使用\n');

try {
  // 创建独立安装目录
  console.log('📁 创建独立安装目录...');
  fs.mkdirSync(PKG_INSTALL_DIR, { recursive: true });

  // 复制核心文件
  console.log('📦 复制包文件到独立位置...');
  const dirsToCopy = ['src', 'bin', 'scripts'];
  let copiedDirs = 0;

  for (const dir of dirsToCopy) {
    const sourceDir = path.join(ROOT, dir);
    if (fs.existsSync(sourceDir)) {
      const targetDir = path.join(PKG_INSTALL_DIR, dir);

      const copyDir = (src, dest) => {
        fs.mkdirSync(dest, { recursive: true });
        const entries = fs.readdirSync(src, { withFileTypes: true });
        for (const entry of entries) {
          const srcPath = path.join(src, entry.name);
          const destPath = path.join(dest, entry.name);
          if (entry.isDirectory()) {
            copyDir(srcPath, destPath);
          } else {
            fs.copyFileSync(srcPath, destPath);
          }
        }
      };

      copyDir(sourceDir, targetDir);
      copiedDirs++;
    }
  }

  const packageJson = path.join(ROOT, 'package.json');
  if (fs.existsSync(packageJson)) {
    fs.copyFileSync(packageJson, path.join(PKG_INSTALL_DIR, 'package.json'));
  }

  console.log(`  ✓ 已复制 ${copiedDirs} 个目录到 ${PKG_INSTALL_DIR}`);

  // 创建全局目录
  console.log('\n📁 创建全局目录...');
  fs.mkdirSync(path.join(GLOBAL_CLAUDE, 'commands'), { recursive: true });
  fs.mkdirSync(path.join(GLOBAL_CLAUDE, 'skills'), { recursive: true });
  fs.mkdirSync(path.join(GLOBAL_CLAUDE, 'scripts'), { recursive: true });
  fs.mkdirSync(path.join(GLOBAL_CLAUDE, 'scripts', 'hooks'), { recursive: true });
  console.log('  ✓ 目录创建完成');

  // 从独立位置安装命令文件
  console.log('\n📋 安装命令文件...');
  const commandsDir = path.join(PKG_INSTALL_DIR, 'src', 'claude', 'commands');
  if (fs.existsSync(commandsDir)) {
    const files = fs.readdirSync(commandsDir);
    let count = 0;
    files.forEach((file) => {
      if (file.endsWith('.md')) {
        fs.copyFileSync(path.join(commandsDir, file), path.join(GLOBAL_CLAUDE, 'commands', file));
        count++;
      }
    });
    console.log(`  ✓ ${count} 个命令文件`);
  }

  // 从独立位置合并 hooks 配置到 settings.json
  console.log('\n⚙️  配置 hooks...');
  const hooksJson = path.join(PKG_INSTALL_DIR, 'src', 'config', 'hooks.json');
  if (fs.existsSync(hooksJson)) {
    mergeHooksToSettings(hooksJson);
  } else {
    console.log('  ⚠️  hooks 配置文件不存在，跳过');
  }

  // 从独立位置安装 hooks 脚本
  console.log('\n🔧 安装 hooks 脚本...');
  const hooksDir = path.join(PKG_INSTALL_DIR, 'src', 'scripts', 'hooks');
  if (fs.existsSync(hooksDir)) {
    const files = fs.readdirSync(hooksDir);
    let count = 0;
    files.forEach((file) => {
      if (file.endsWith('.js')) {
        fs.copyFileSync(
          path.join(hooksDir, file),
          path.join(GLOBAL_CLAUDE, 'scripts', 'hooks', file)
        );
        count++;
      }
    });
    console.log(`  ✓ ${count} 个 hooks 脚本`);
  }

  // 创建技能符号链接（指向独立位置）
  console.log('\n🔗 链接技能文件...');
  const skillsDir = path.join(PKG_INSTALL_DIR, 'src', 'claude', 'skills');
  if (fs.existsSync(skillsDir)) {
    const skills = fs.readdirSync(skillsDir, { withFileTypes: true });
    let count = 0;
    for (const skill of skills) {
      if (skill.isDirectory()) {
        const skillPath = path.join(skillsDir, skill.name);
        const skillFiles = fs.readdirSync(skillPath);
        for (const file of skillFiles) {
          if (file.startsWith('req-') && file.endsWith('.md')) {
            const sourceFile = path.join(skillPath, file);
            const targetFile = path.join(GLOBAL_CLAUDE, 'skills', file);
            if (fs.existsSync(targetFile)) fs.unlinkSync(targetFile);
            fs.symlinkSync(sourceFile, targetFile);
            count++;
          }
        }
      }
    }
    console.log(`  ✓ ${count} 个技能链接`);
  }

  // 读取版本
  let version = 'unknown';
  try {
    const pkg = JSON.parse(fs.readFileSync(path.join(PKG_INSTALL_DIR, 'package.json'), 'utf8'));
    version = pkg.version;
  } catch (_error) {
    // 忽略版本读取错误
  }

  console.log(`
╔══════════════════════════════════════════════════════════════╗
║                  ✅ 安装完成！                               ║
╚══════════════════════════════════════════════════════════════╝

📌 现在可以在任何 Claude Code 项目中使用:

   /req          添加新功能需求
   /req --dashboard    查看需求仪表板
   /metrics      查看项目度量数据
   /commit       提交管理

💡 安装信息:
   📦 版本: v${version}
   📁 独立位置: ${PKG_INSTALL_DIR}
   🔒 缓存安全: 清理 npm 缓存不影响使用

📚 更多信息: https://github.com/zxc1213/claude-req-sys
`);
} catch (error) {
  console.error('\n❌ 安装失败:', error.message);
  console.log('\n💡 故障排除:');
  console.log('   1. 确保有 Claude Code 的写入权限');
  console.log('   2. 检查 ~/.claude/ 目录是否可访问');
  console.log('   3. 查看: https://github.com/zxc1213/claude-req-sys/issues\n');
  process.exit(1);
}
