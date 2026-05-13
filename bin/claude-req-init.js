#!/usr/bin/env node

/**
 * ClaudeReqSys 项目初始化命令
 * 使用: claude-req-init
 */

import { execSync } from 'child_process';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.dirname(__dirname);

console.log('🎯 ClaudeReqSys 项目初始化\n');

// 获取项目根目录
const projectRoot = process.cwd();

// 创建目录结构
const dirs = [
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
  'docs/specs',
  'docs/guides',
  'docs/analysis'
];

console.log('📁 创建项目目录...');
dirs.forEach(dir => {
  const fullPath = path.join(projectRoot, dir);
  fs.mkdirSync(fullPath, { recursive: true });
  console.log(`  ✓ ${dir}`);
});

// 初始化度量系统
const metricsConfigPath = path.join(projectRoot, '.requirements/metrics/config.json');
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
  console.log('  ✓ metrics/config.json');
}

// 初始化度量数据
const metricsDataPath = path.join(projectRoot, '.requirements/metrics/data.yaml');
if (!fs.existsSync(metricsDataPath)) {
  const yaml = require('js-yaml');
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
  fs.writeFileSync(metricsDataPath, yaml.dump(metricsData));
  console.log('  ✓ metrics/data.yaml');
}

console.log('\n✅ 项目初始化完成!\n');
console.log('📊 ClaudeReqSys 已就绪\n');
console.log('开始使用:');
console.log('  /req 添加你的第一个需求');
console.log('  /req --dashboard 查看仪表板\n');
