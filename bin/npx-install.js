#!/usr/bin/env node

/**
 * ClaudeReqSys npx 安装入口
 * 使用: npx claude-req-sys
 */

import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.dirname(__dirname);
const GLOBAL_CLAUDE = path.join(process.env.HOME || process.env.USERPROFILE, '.claude');

console.log(`
╔══════════════════════════════════════════════════════════════╗
║           ClaudeReqSys 智能需求管理系统                      ║
║         为 Claude Code 提供全流程需求管理能力                ║
╚══════════════════════════════════════════════════════════════╝
`);

const reqMdPath = path.join(GLOBAL_CLAUDE, 'commands', 'req.md');
if (fs.existsSync(reqMdPath)) {
  console.log('✅ ClaudeReqSys 已安装并就绪！\n');
  console.log('📌 在 Claude Code 中直接使用:');
  console.log('   /req          添加新功能');
  console.log('   /req --dashboard  查看需求仪表板');
  console.log('   /metrics      查看度量数据');
  console.log('   /commit       提交管理\n');
  try {
    const packageJson = JSON.parse(fs.readFileSync(path.join(ROOT, 'package.json'), 'utf8'));
    console.log(`📦 当前版本: v${packageJson.version}`);
  } catch {
    // 忽略版本读取错误
  }
  process.exit(0);
}

console.log('🚀 正在配置 ClaudeReqSys...\n');

try {
  const commandsDir = path.join(ROOT, 'src', 'claude', 'commands');
  const hooksDir = path.join(ROOT, 'src', 'scripts', 'hooks');
  const skillsDir = path.join(ROOT, 'src', 'claude', 'skills');
  const hooksJson = path.join(ROOT, 'src', 'config', 'hooks.json');

  console.log('📁 创建全局目录...');
  fs.mkdirSync(path.join(GLOBAL_CLAUDE, 'commands'), { recursive: true });
  fs.mkdirSync(path.join(GLOBAL_CLAUDE, 'skills'), { recursive: true });
  fs.mkdirSync(path.join(GLOBAL_CLAUDE, 'scripts'), { recursive: true });
  fs.mkdirSync(path.join(GLOBAL_CLAUDE, 'scripts', 'hooks'), { recursive: true });
  console.log('  ✓ 目录创建完成');

  console.log('\n📋 安装命令文件...');
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

  console.log('\n⚙️  安装 hooks 配置...');
  if (fs.existsSync(hooksJson)) {
    fs.copyFileSync(hooksJson, path.join(GLOBAL_CLAUDE, 'hooks.json'));
    console.log('  ✓ hooks 配置');
  }

  console.log('\n🔧 安装 hooks 脚本...');
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

  console.log('\n🔗 链接技能文件...');
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

  console.log(`
╔══════════════════════════════════════════════════════════════╗
║                  ✅ 安装完成！                               ║
╚══════════════════════════════════════════════════════════════╝

📌 现在可以在任何 Claude Code 项目中使用:

   /req          添加新功能需求
   /req --dashboard    查看需求仪表板
   /metrics      查看项目度量数据
   /commit       提交管理

📚 更多信息: https://github.com/zxc1213/claude-req-sys
`);

  try {
    const packageJson = JSON.parse(fs.readFileSync(path.join(ROOT, 'package.json'), 'utf8'));
    console.log(`📦 已安装版本: v${packageJson.version}\n`);
  } catch {
    // 忽略版本读取错误
  }
} catch (error) {
  console.error('\n❌ 安装失败:', error.message);
  console.log('\n💡 故障排除:');
  console.log('   1. 确保有 Claude Code 的写入权限');
  console.log('   2. 检查 ~/.claude/ 目录是否可访问');
  console.log('   3. 查看: https://github.com/zxc1213/claude-req-sys/issues\n');
  process.exit(1);
}
