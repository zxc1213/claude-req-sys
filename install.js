#!/usr/bin/env node

/**
 * ClaudeReqSys 安装脚本
 * 用于将需求管理系统安装到任何项目中
 * 智能合并配置，不覆盖用户现有设置
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { execSync } from 'child_process';

// 获取 install.js 所在目录（源目录）
const scriptPath = fileURLToPath(import.meta.url);
const ROOT = path.dirname(scriptPath);

// 目标目录：从命令行参数获取，或使用当前目录
const TARGET = process.argv[2] ? path.resolve(process.argv[2]) : process.cwd();

// 需要复制的文件和目录（不包含 settings.json）
const COPY_ITEMS = [
  '.claude/commands',
  '.claude/scripts',
  'README.md',
  'docs'
];

console.log('🚀 ClaudeReqSys 安装向导\n');

// ============================================================================
// JSON 深度合并工具函数
// ============================================================================

function isPlainObject(value) {
  return Boolean(value) && typeof value === 'object' && !Array.isArray(value);
}

function deepMergeJson(baseValue, patchValue) {
  if (!isPlainObject(baseValue) || !isPlainObject(patchValue)) {
    return patchValue;
  }

  const merged = { ...baseValue };
  for (const [key, value] of Object.entries(patchValue)) {
    if (isPlainObject(value) && isPlainObject(merged[key])) {
      merged[key] = deepMergeJson(merged[key], value);
    } else if (Array.isArray(value) && Array.isArray(merged[key])) {
      // 数组合并：保留唯一项
      const mergedArray = [...merged[key]];
      for (const item of value) {
        if (!mergedArray.includes(item)) {
          mergedArray.push(item);
        }
      }
      merged[key] = mergedArray;
    } else {
      merged[key] = value;
    }
  }
  return merged;
}

function readJsonObject(filePath, label) {
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    return JSON.parse(content);
  } catch (error) {
    return null;
  }
}

function writeJsonObject(filePath, value) {
  fs.writeFileSync(filePath, JSON.stringify(value, null, 2) + '\n', 'utf8');
}

// ============================================================================
// 安装逻辑
// ============================================================================

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
  '.claude/scripts',
  '.claude/skills',
  'docs/specs',
  'docs/guides',
  'docs/analysis',
  '.requirements/features',
  '.requirements/bugs',
  '.requirements/questions',
  '.requirements/adjustments',
  '.requirements/refactorings',
  '.requirements/metrics',
  '.requirements/metrics/reports',
  '.requirements/metrics/exports',
  '.requirements/metrics/trends',
  '.requirements/_system/versions',
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

  if (!fs.existsSync(src)) {
    console.log(`⚠️  跳过不存在的文件: ${item}`);
    return;
  }

  if (fs.statSync(src).isDirectory()) {
    copyDir(src, dst);
  } else {
    fs.copyFileSync(src, dst);
  }
});

// 4. 智能合并 hooks 配置
console.log('⚙️  配置自动化 hooks...');

const settingsPath = path.join(TARGET, '.claude', 'settings.json');
const hooksConfigPath = path.join(ROOT, '.claude', 'hooks.json');

let shouldMergeHooks = false;
let existingSettings = {};
let hooksConfig = {};

// 读取现有 settings.json
if (fs.existsSync(settingsPath)) {
  existingSettings = readJsonObject(settingsPath, 'settings.json') || {};
  console.log('✓ 找到现有 settings.json');
}

// 读取 hooks 配置
if (fs.existsSync(hooksConfigPath)) {
  hooksConfig = readJsonObject(hooksConfigPath, 'hooks.json') || {};
  shouldMergeHooks = true;
  console.log('✓ 找到 hooks 配置模板');
}

if (shouldMergeHooks && Object.keys(hooksConfig).length > 0) {
  // 智能合并 hooks
  const mergedSettings = deepMergeJson(existingSettings, hooksConfig);
  writeJsonObject(settingsPath, mergedSettings);
  console.log('✓ Hooks 配置已智能合并到 settings.json');
} else {
  // 创建示例配置文件
  const hooksExamplePath = path.join(TARGET, '.claude', 'req-system-hooks.example.json');
  const exampleConfig = {
    "_comment": "ClaudeReqSys Hooks 配置 - 如需启用自动化功能，请将以下内容合并到 settings.json 的 hooks 配置中",
    "hooks": {
      "PostToolUse": [
        {
          "matcher": "Edit|Write|Bash",
          "hooks": [
            {
              "type": "command",
              "command": "node \".claude/scripts/hooks/post-req-update.js\"",
              "timeout": 10
            }
          ],
          "description": "更新需求记录",
          "id": "post:req:update"
        }
      ],
      "Stop": [
        {
          "matcher": "*",
          "hooks": [
            {
              "type": "command",
              "command": "node \".claude/scripts/hooks/stop-req-summary.js\"",
              "timeout": 10
            }
          ],
          "description": "生成需求执行总结",
          "id": "stop:req:summary"
        }
      ]
    }
  };
  writeJsonObject(hooksExamplePath, exampleConfig);
  console.log('ⓘ 未找到 hooks 配置模板，已创建示例文件');
  console.log('  如需自动化功能，请手动合并 .claude/req-system-hooks.example.json 到 settings.json');
}

// 5. 安装依赖
console.log('📦 安装依赖...');
try {
  execSync('npm install js-yaml', { cwd: TARGET, stdio: 'inherit' });
} catch (e) {
  console.log('⚠️  依赖安装失败，请手动运行: npm install js-yaml');
}

// 6. 初始化系统文件
console.log('🎯 初始化系统...');

// 初始化度量系统
const metricsConfigPath = path.join(TARGET, '.requirements/metrics/config.json');
if (!fs.existsSync(metricsConfigPath)) {
  const metricsConfig = {
    metrics: {
      collection: {
        enabled: true,
        interval: 'daily',
        retentionDays: 90
      },
      targets: {
        cycle_time: 2.0,
        rework_rate: 0.15,
        quality_gate_pass_rate: 0.90,
        user_satisfaction: 4.0,
        completion_rate: 0.90
      },
      alerts: {
        enabled: true,
        thresholds: {
          cycle_time: { warning: 2.5, critical: 3.0 },
          rework_rate: { warning: 0.15, critical: 0.20 }
        }
      },
      reporting: {
        frequency: 'weekly',
        autoGenerate: false,
        includeCharts: false
      }
    }
  };
  fs.writeFileSync(metricsConfigPath, JSON.stringify(metricsConfig, null, 2));
}

// 初始化度量数据
const metricsDataPath = path.join(TARGET, '.requirements/metrics/data.yaml');
if (!fs.existsSync(metricsDataPath)) {
  const metricsData = {
    metrics: {
      cycle_time: [],
      rework_rate: [],
      quality_gate_pass_rate: [],
      completion_rate: [],
      user_satisfaction: []
    },
    last_updated: new Date().toISOString()
  };
  fs.writeFileSync(metricsDataPath, require('js-yaml').dump(metricsData));
}

// 7. 完成
console.log('\n✅ 安装完成!\n');
console.log('📊 ClaudeReqSys v0.3.0 - 智能需求管理系统\n');
console.log('开始使用:');
console.log('  /req 添加你的第一个需求（智能推断）');
console.log('  /priority --list 查看优先级排序');
console.log('  /metrics 查看项目指标');
console.log('  /req --dashboard 查看仪表板\n');
console.log('📌 新功能:');
console.log('  ✅ 统一入口 - 智能路由到最优流程');
console.log('  ✅ 优先级评估 - 5维度科学评估');
console.log('  ✅ 质量门禁 - 4阶段自动检查');
console.log('  ✅ 文档统一 - 5文件→2文件');
console.log('  ✅ 度量体系 - 4维度16指标\n');
console.log('📖 文档:');
console.log('  - 用户指南: docs/guides/user-guide.md');
console.log('  - 优化报告: docs/analysis/optimization-report.md\n');

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
