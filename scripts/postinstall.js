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
import { mergeHooksToSettings } from './merge-settings.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.dirname(__dirname);

const GLOBAL_CLAUDE = path.join(process.env.HOME || process.env.USERPROFILE, '.claude');
const claudeFilesDir = path.join(GLOBAL_CLAUDE, 'claude-req-sys');

// 检查是否需要安装
const needsGlobalSetup = !fs.existsSync(path.join(GLOBAL_CLAUDE, 'commands', 'req.md'));

if (!needsGlobalSetup) {
  console.log('✓ ClaudeReqSys 全局配置已存在，跳过安装');

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
    const hooksJson = path.join(claudeFilesDir, 'src', 'config', 'hooks.json');
    if (fs.existsSync(hooksJson)) {
      mergeHooksToSettings(hooksJson);
    }
  }

  // 检查是否需要更新
  try {
    const localVersion = JSON.parse(
      fs.readFileSync(path.join(ROOT, 'package.json'), 'utf8')
    ).version;
    const symlinkVersion = fs.existsSync(path.join(claudeFilesDir, 'package.json'))
      ? JSON.parse(fs.readFileSync(path.join(claudeFilesDir, 'package.json'), 'utf8')).version
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

    // 检查 npm 是否创建了符号链接
    let needsReplacement = false;
    if (fs.existsSync(npmSymlink)) {
      const stats = fs.lstatSync(npmSymlink);
      if (stats.isSymbolicLink()) {
        const linkTarget = fs.readlinkSync(npmSymlink);
        // 转换为绝对路径
        const absoluteTarget = path.isAbsolute(linkTarget)
          ? linkTarget
          : path.resolve(path.dirname(npmSymlink), linkTarget);

        console.log(`📍 npm 符号链接: ${npmSymlink} -> ${absoluteTarget}`);

        // 检查是否指向缓存临时目录
        if (absoluteTarget.includes('npm-cache') || absoluteTarget.includes('tmp')) {
          console.log('🔄 检测到缓存符号链接，替换为物理目录...');
          needsReplacement = true;

          // 删除符号链接
          fs.unlinkSync(npmSymlink);

          // 创建物理目录
          fs.mkdirSync(npmSymlink, { recursive: true });
          physicalInstallDir = npmSymlink;
        } else {
          // 不是缓存链接，使用现有位置
          physicalInstallDir = npmSymlink;
        }
      } else {
        // 已经是物理目录
        physicalInstallDir = npmSymlink;
      }
    } else {
      // 目录不存在，创建
      fs.mkdirSync(npmSymlink, { recursive: true });
      physicalInstallDir = npmSymlink;
    }

    if (needsReplacement) {
      console.log(`📦 复制包文件到物理位置: ${physicalInstallDir}`);

      // 递归复制所有内容
      const copyAll = (src, dest) => {
        fs.mkdirSync(dest, { recursive: true });
        const entries = fs.readdirSync(src, { withFileTypes: true });
        for (const entry of entries) {
          const srcPath = path.join(src, entry.name);
          const destPath = path.join(dest, entry.name);
          if (entry.isDirectory()) {
            copyAll(srcPath, destPath);
          } else {
            fs.copyFileSync(srcPath, destPath);
          }
        }
      };

      // 复制源目录的所有内容
      if (fs.existsSync(pkgDir)) {
        copyAll(pkgDir, physicalInstallDir);
        console.log('  ✓ 所有文件已复制');
      }

      // 手动安装依赖到物理位置
      console.log('📦 安装依赖到物理位置...');
      try {
        execSync('npm install --production', {
          cwd: physicalInstallDir,
          stdio: 'inherit',
        });
        console.log('  ✓ 依赖安装完成');
      } catch (installError) {
        console.log('  ⚠️  依赖安装失败，但不影响核心功能');
      }
    } else {
      console.log(`📍 npm 安装位置: ${physicalInstallDir}`);
    }

    // 创建独立位置用于 Claude 文件
    console.log('📦 复制 Claude 文件到独立位置...');
    const claudeFilesDir = claudeFilesDir;
    fs.mkdirSync(claudeFilesDir, { recursive: true });

    // 复制核心文件到独立位置
    const dirsToCopy = ['src', 'bin', 'scripts'];
    let copiedDirs = 0;

    for (const dir of dirsToCopy) {
      const sourceDir = path.join(pkgDir, dir);
      if (fs.existsSync(sourceDir)) {
        const targetDir = path.join(claudeFilesDir, dir);

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
      fs.copyFileSync(packageJson, path.join(claudeFilesDir, 'package.json'));
      console.log('  ✓ package.json');
    }

    console.log(`  ✓ 已复制 ${copiedDirs} 个目录到独立位置`);
  } catch (error) {
    // Fallback: 使用独立目录
    console.log('⚠️  无法替换 npm 符号链接，使用独立目录');
    physicalInstallDir = claudeFilesDir;
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
  const commandsDir = path.join(claudeFilesDir, 'src', 'claude', 'commands');
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

  // 从符号链接位置合并 hooks 配置到 settings.json
  console.log('\n⚙️  配置 hooks...');
  const hooksJson = path.join(claudeFilesDir, 'src', 'config', 'hooks.json');
  if (fs.existsSync(hooksJson)) {
    mergeHooksToSettings(hooksJson);
  } else {
    console.log('  ⚠️  hooks 配置文件不存在，跳过');
  }

  // 从符号链接位置复制 hooks 脚本
  console.log('\n🔧 安装 hooks 脚本...');
  const hooksDir = path.join(claudeFilesDir, 'src', 'scripts', 'hooks');
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
  const skillsDir = path.join(claudeFilesDir, 'src', 'claude', 'skills');
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
  console.log(`   - npm 包位置: ${physicalInstallDir}`);
  console.log(`   - Claude 文件位置: ${claudeFilesDir}`);
  console.log('   - 清理 npm 缓存不影响使用');
  console.log('   - 更新: 运行 npm install -g github:zxc1213/claude-req-sys');
  console.log('');
} catch (error) {
  console.error('❌ 自动配置失败:', error.message);
  console.log('\n💡 提示: 您可以稍后手动运行配置\n');
  // 不退出，允许 npm install 完成
}
