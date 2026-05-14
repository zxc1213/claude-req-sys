#!/usr/bin/env node

/**
 * ClaudeReqSys npm postinstall 脚本
 * 新架构：替换 npm 的缓存符号链接为物理目录
 * 清理缓存后依然可用
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { pathToFileURL } from 'url';
import { execSync } from 'child_process';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.dirname(__dirname);

const GLOBAL_CLAUDE = path.join(process.env.HOME || process.env.USERPROFILE, '.claude');
const SYMLINK_DIR = path.join(GLOBAL_CLAUDE, 'claude-req-sys');

// 检查是否需要安装
const needsGlobalSetup = !fs.existsSync(path.join(GLOBAL_CLAUDE, 'commands', 'req.md'));

if (!needsGlobalSetup) {
  console.log('✓ ClaudeReqSys 全局配置已存在，跳过安装');

  // 检查是否需要更新
  try {
    const localVersion = JSON.parse(
      fs.readFileSync(path.join(ROOT, 'package.json'), 'utf8')
    ).version;
    const symlinkVersion = fs.existsSync(path.join(SYMLINK_DIR, 'package.json'))
      ? JSON.parse(fs.readFileSync(path.join(SYMLINK_DIR, 'package.json'), 'utf8')).version
      : null;

    if (symlinkVersion && symlinkVersion !== localVersion) {
      console.log(`📦 检测到新版本 v${localVersion}（当前: v${symlinkVersion}），建议更新`);
      console.log('   运行 npm install -g github:zxc1213/claude-req-sys 重新安装最新版本\n');
    }
  } catch (_error) {
    // 忽略版本检查错误
  }

  process.exit(0);
}

console.log('🚀 ClaudeReqSys 正在自动配置...\n');

try {
  // 获取包源位置
  let pkgDir;
  try {
    const packageJsonPath = import.meta.resolve('claude-req-sys/package.json');
    pkgDir = path.dirname(pathToFileURL(packageJsonPath).pathname);
  } catch {
    pkgDir = ROOT;
  }

  // 获取 npm 全局 node_modules 物理路径并替换符号链接
  let physicalInstallDir;

  try {
    const npmGlobalRoot = execSync('npm root -g', { encoding: 'utf8' }).trim();
    const npmSymlink = path.join(npmGlobalRoot, 'claude-req-sys');

    // 检查 npm 创建的符号链接
    if (fs.existsSync(npmSymlink)) {
      const stats = fs.lstatSync(npmSymlink);
      if (stats.isSymbolicLink()) {
        console.log('🔄 替换 npm 缓存符号链接为物理目录...');

        // 删除 npm 的符号链接
        fs.unlinkSync(npmSymlink);

        // 创建物理目录
        fs.mkdirSync(npmSymlink, { recursive: true });
        physicalInstallDir = npmSymlink;

        console.log(`  ✓ 物理目录: ${npmSymlink}`);
      } else {
        // 已经是物理目录
        physicalInstallDir = npmSymlink;
      }
    } else {
      // 目录不存在，创建
      fs.mkdirSync(npmSymlink, { recursive: true });
      physicalInstallDir = npmSymlink;
    }

    // 复制核心文件到物理位置
    console.log('📦 复制包文件到物理位置...');
    const dirsToCopy = ['src', 'bin', 'scripts'];
    let copiedDirs = 0;

    for (const dir of dirsToCopy) {
      const sourceDir = path.join(pkgDir, dir);
      if (fs.existsSync(sourceDir)) {
        const targetDir = path.join(physicalInstallDir, dir);

        // 递归复制目录
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

    // 复制 package.json（用于版本检查）
    let packageJson = path.join(pkgDir, 'package.json');
    if (!fs.existsSync(packageJson)) {
      packageJson = path.join(ROOT, 'package.json');
    }
    if (fs.existsSync(packageJson)) {
      fs.copyFileSync(packageJson, path.join(physicalInstallDir, 'package.json'));
      console.log('  ✓ package.json');
    }

    console.log(`  ✓ 已复制 ${copiedDirs} 个目录`);

    // 创建或更新符号链接：~/.claude/claude-req-sys → 物理位置
    console.log('\n🔗 创建符号链接...');
    if (fs.existsSync(SYMLINK_DIR)) {
      const stats = fs.lstatSync(SYMLINK_DIR);
      if (stats.isSymbolicLink()) {
        fs.unlinkSync(SYMLINK_DIR);
      } else {
        fs.rmSync(SYMLINK_DIR, { recursive: true, force: true });
      }
    }

    fs.symlinkSync(physicalInstallDir, SYMLINK_DIR, 'dir');
    console.log(`  ✓ ~/.claude/claude-req-sys → ${physicalInstallDir}`);
  } catch (error) {
    // Fallback: 使用独立目录
    console.log('⚠️  无法替换 npm 符号链接，使用独立目录');
    physicalInstallDir = SYMLINK_DIR;
    fs.mkdirSync(physicalInstallDir, { recursive: true });

    // 复制文件到独立目录
    console.log('📦 复制包文件到独立位置...');
    const dirsToCopy = ['src', 'bin', 'scripts'];
    let copiedDirs = 0;

    for (const dir of dirsToCopy) {
      const sourceDir = path.join(pkgDir, dir);
      if (fs.existsSync(sourceDir)) {
        const targetDir = path.join(physicalInstallDir, dir);
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

    let packageJson = path.join(pkgDir, 'package.json');
    if (!fs.existsSync(packageJson)) {
      packageJson = path.join(ROOT, 'package.json');
    }
    if (fs.existsSync(packageJson)) {
      fs.copyFileSync(packageJson, path.join(physicalInstallDir, 'package.json'));
      console.log('  ✓ package.json');
    }

    console.log(`  ✓ 已复制 ${copiedDirs} 个目录到独立位置`);
  }

  // 创建全局目录
  console.log('\n📁 创建全局目录...');
  fs.mkdirSync(path.join(GLOBAL_CLAUDE, 'commands'), { recursive: true });
  fs.mkdirSync(path.join(GLOBAL_CLAUDE, 'skills'), { recursive: true });
  fs.mkdirSync(path.join(GLOBAL_CLAUDE, 'scripts'), { recursive: true });
  fs.mkdirSync(path.join(GLOBAL_CLAUDE, 'scripts', 'hooks'), { recursive: true });
  console.log('  ✓ 目录创建完成');

  // 从符号链接位置复制命令文件
  console.log('\n📋 安装命令文件...');
  const commandsDir = path.join(SYMLINK_DIR, 'src', 'claude', 'commands');
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

  // 从符号链接位置复制 hooks 配置
  console.log('\n⚙️  安装 hooks 配置...');
  const hooksJson = path.join(SYMLINK_DIR, 'src', 'config', 'hooks.json');
  if (fs.existsSync(hooksJson)) {
    fs.copyFileSync(hooksJson, path.join(GLOBAL_CLAUDE, 'hooks.json'));
    console.log('  ✓ hooks 配置');
  }

  // 从符号链接位置复制 hooks 脚本
  console.log('\n🔧 安装 hooks 脚本...');
  const hooksDir = path.join(SYMLINK_DIR, 'src', 'scripts', 'hooks');
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

  // 创建技能符号链接（指向符号链接位置）
  console.log('\n🔗 链接技能文件...');
  const skillsDir = path.join(SYMLINK_DIR, 'src', 'claude', 'skills');
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
  console.log('💡 提示:');
  console.log(`   - 物理文件位置: ${physicalInstallDir}`);
  console.log('   - 符号链接: ~/.claude/claude-req-sys → 物理位置');
  console.log('   - 清理 npm 缓存不影响使用');
  console.log('   - 更新: 运行 npm install -g github:zxc1213/claude-req-sys');
  console.log('');
} catch (error) {
  console.error('❌ 自动配置失败:', error.message);
  console.log('\n💡 提示: 您可以稍后手动运行配置\n');
  // 不退出，允许 npm install 完成
}
