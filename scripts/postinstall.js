#!/usr/bin/env node

/**
 * ClaudeReqSys npm postinstall 脚本
 * 覆盖式更新：每次安装都清理旧文件并安装最新版本
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
let physicalInstallDir; // 最终的物理安装位置

console.log('🚀 ClaudeReqSys 正在安装/更新...\n');

try {
  // 第一步：清理损坏的 npm 安装（修复 ENOTDIR 错误）
  try {
    const npmGlobalRoot = execSync('npm root -g', { encoding: 'utf8' }).trim();
    const npmPkgPath = path.join(npmGlobalRoot, 'claude-req-sys');

    if (fs.existsSync(npmPkgPath)) {
      const stats = fs.lstatSync(npmPkgPath);
      if (!stats.isDirectory()) {
        console.log('🧹 发现损坏的安装（文件而非目录），正在清理...');
        fs.unlinkSync(npmPkgPath);
        console.log('  ✓ 已清理损坏的文件');
      }
    }
  } catch (cleanupError) {
    // 清理失败不影响后续流程
    console.log('  ⚠️  清理步骤跳过');
  }

  // 获取包源位置（修复：优先使用 npm 全局路径）
  let pkgDir;

  // 方法1: 从 npm 全局 node_modules 获取
  try {
    const npmGlobalRoot = execSync('npm root -g', { encoding: 'utf8' }).trim();
    const npmPkgDir = path.join(npmGlobalRoot, 'claude-req-sys');
    if (fs.existsSync(path.join(npmPkgDir, 'package.json'))) {
      pkgDir = npmPkgDir;
    }
  } catch {
    // 忽略错误，尝试下一个方法
  }

  // 方法2: 从脚本位置推断（postinstall.js 在 scripts/ 目录下）
  if (!pkgDir) {
    let currentDir = path.dirname(fileURLToPath(import.meta.url));
    // 向上查找包含 package.json 的目录
    while (currentDir && currentDir !== path.dirname(currentDir)) {
      if (fs.existsSync(path.join(currentDir, 'package.json'))) {
        pkgDir = currentDir;
        break;
      }
      currentDir = path.dirname(currentDir);
    }
  }

  // 方法3: 验证包目录是否有效，无效则使用 ROOT
  if (!pkgDir || !fs.existsSync(path.join(pkgDir, 'package.json'))) {
    pkgDir = ROOT;
  }

  // 获取当前版本
  let currentVersion = 'unknown';
  try {
    currentVersion = JSON.parse(fs.readFileSync(path.join(pkgDir, 'package.json'), 'utf8')).version;
  } catch {
    // 忽略版本读取错误
  }

  console.log(`📦 版本: v${currentVersion}`);
  console.log('💡 覆盖式更新模式：清理旧文件，安装最新版本\n');

  // 获取 npm 全局 node_modules 物理路径并替换符号链接
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

    // 创建独立位置用于 Claude 文件（覆盖式）
    console.log('📦 复制文件到独立位置...');

    // 设置独立位置路径
    physicalInstallDir = path.join(GLOBAL_CLAUDE, 'claude-req-sys');

    // 清理旧文件（如果存在）
    if (fs.existsSync(physicalInstallDir)) {
      console.log('  🧹 清理旧文件...');
      fs.rmSync(physicalInstallDir, { recursive: true, force: true });
    }

    fs.mkdirSync(physicalInstallDir, { recursive: true });

    // 复制核心文件到独立位置
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
    }

    console.log(`  ✓ 已复制 ${copiedDirs} 个目录到独立位置`);
  } catch (error) {
    // Fallback: 使用独立目录
    console.log('⚠️  无法替换 npm 符号链接，使用独立目录');
    physicalInstallDir = path.join(GLOBAL_CLAUDE, 'claude-req-sys');
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
    }

    console.log(`  ✓ 已复制 ${copiedDirs} 个目录到独立位置`);
  }

  // 创建全局目录
  console.log('\n📁 创建全局目录...');
  fs.mkdirSync(path.join(GLOBAL_CLAUDE, 'commands'), { recursive: true });
  fs.mkdirSync(path.join(GLOBAL_CLAUDE, 'skills'), { recursive: true });
  console.log('  ✓ 目录创建完成');

  // 从独立位置复制命令文件（覆盖式）
  console.log('\n📋 安装命令文件...');
  const commandsDir = path.join(physicalInstallDir, 'src', 'claude', 'commands');
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

  // 合并 hooks 配置到 settings.json
  console.log('\n⚙️  配置 hooks...');
  const hooksJson = path.join(physicalInstallDir, 'src', 'config', 'hooks.json');
  if (fs.existsSync(hooksJson)) {
    mergeHooksToSettings(hooksJson);
  } else {
    console.log('  ⚠️  hooks 配置文件不存在，跳过');
  }

  // 创建技能符号链接（覆盖式）
  console.log('\n🔗 链接技能文件...');
  const skillsDir = path.join(physicalInstallDir, 'src', 'claude', 'skills');

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

            // 删除旧链接或文件
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
  } else {
    console.log('  ⚠️  技能源目录不存在，跳过');
  }

  console.log('\n✅ ClaudeReqSys 安装完成!\n');
  console.log('📌 现在可以在任何项目中直接使用:');
  console.log('   /req 添加新功能');
  console.log('   /req --dashboard');
  console.log('');
  console.log('💡 提示:');
  console.log(`   - 安装位置: ${physicalInstallDir}`);
  console.log('   - 清理 npm 缓存不影响使用');
  console.log('   - 每次运行 npm install 都会覆盖更新到最新版本');
  console.log('');
} catch (error) {
  console.error('❌ 安装失败:', error.message);
  console.log('\n💡 提示: 您可以稍后手动运行配置\n');
  // 不退出，允许 npm install 完成
}
