#!/usr/bin/env node

/**
 * 合并 hooks 配置到用户的 settings.json
 *
 * Claude Code 不会自动读取 ~/.claude/hooks.json
 * hooks 必须在 settings.json 中定义才会生效
 */

import fs from 'fs';
import path from 'path';

const GLOBAL_CLAUDE = path.join(process.env.HOME || process.env.USERPROFILE, '.claude');
const SETTINGS_FILE = path.join(GLOBAL_CLAUDE, 'settings.json');
const HOOKS_SOURCE = path.join(GLOBAL_CLAUDE, 'hooks.json');

/**
 * 深度合并对象
 */
function deepMerge(target, source) {
  const output = { ...target };

  for (const key of Object.keys(source)) {
    if (source[key] instanceof Object && key in target && target[key] instanceof Object) {
      output[key] = deepMerge(target[key], source[key]);
    } else {
      output[key] = source[key];
    }
  }

  return output;
}

/**
 * 合并 hooks 到 settings.json
 * @param {string} [hooksSource] - 可选的 hooks 源文件路径，默认使用 HOOKS_SOURCE
 */
export function mergeHooksToSettings(hooksSource) {
  try {
    const sourceFile = hooksSource || HOOKS_SOURCE;

    // 读取 hooks 配置
    if (!fs.existsSync(sourceFile)) {
      console.log('  ⚠️  hooks.json 不存在，跳过');
      return false;
    }

    const hooksConfig = JSON.parse(fs.readFileSync(sourceFile, 'utf8'));

    // 读取或创建 settings.json
    let settings = {};
    if (fs.existsSync(SETTINGS_FILE)) {
      settings = JSON.parse(fs.readFileSync(SETTINGS_FILE, 'utf8'));
    }

    // 合并 hooks
    const merged = deepMerge(settings, hooksConfig);

    // 写回 settings.json
    fs.writeFileSync(SETTINGS_FILE, JSON.stringify(merged, null, 2), 'utf8');

    console.log('  ✓ hooks 已合并到 settings.json');
    return true;
  } catch (error) {
    console.error('  ❌ 合并 hooks 失败:', error.message);
    return false;
  }
}

// 如果直接运行此脚本
if (import.meta.url === `file://${process.argv[1]}`) {
  mergeHooksToSettings();
}
