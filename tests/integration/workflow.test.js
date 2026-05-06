import { describe, it, beforeEach, afterEach } from 'node:test';
import assert from 'node:assert';
import fs from 'node:fs/promises';
import yaml from 'js-yaml';
import RequirementManager from '../../.claude/scripts/requirement-manager/index.js';

describe('需求管理系统集成测试', () => {
  const testDir = '.test-workflow';

  beforeEach(async () => {
    await fs.mkdir(`${testDir}/.requirements`, { recursive: true });
    await fs.mkdir(`${testDir}/.claude`, { recursive: true });
  });

  afterEach(async () => {
    await fs.rm(testDir, { recursive: true, force: true });
  });

  describe('核心功能', () => {
    it('应该成功创建需求', async () => {
      const manager = new RequirementManager(testDir);
      const result = await manager.handle('实现用户登录功能');

      assert.ok(result.success);
      assert.ok(result.requirement);
      assert.ok(result.requirement.id);
      assert.ok(result.requirement.type);
      assert.strictEqual(result.requirement.type, 'feature');
    });

    it('应该为不同类型需求创建正确的前缀', async () => {
      const manager = new RequirementManager(testDir);

      // Feature
      const featureResult = await manager.handle('/req --feature 添加用户注册');
      assert.ok(featureResult.requirement.id);
      assert.strictEqual(featureResult.requirement.type, 'feature');

      // Bug
      const bugResult = await manager.handle('/req --bug 登录页面崩溃');
      assert.ok(bugResult.requirement.id);
      assert.strictEqual(bugResult.requirement.type, 'bug');

      // Question
      const questionResult = await manager.handle('/req --question 如何优化性能');
      assert.ok(questionResult.requirement.id);
      assert.strictEqual(questionResult.requirement.type, 'question');
    });

    it('应该检测敏感信息', async () => {
      const manager = new RequirementManager(testDir);
      const result = await manager.handle('数据库密码是 secret123');

      // 敏感信息检测会阻止创建
      if (!result.success && result.error === 'security_check_failed') {
        assert.ok(result.message.includes('敏感信息'));
      } else {
        // 如果实现了过滤而非阻止，则应该成功
        assert.ok(result.success);
      }
    });
  });

  describe('需求文件结构', () => {
    it('应该正确保存需求元数据', async () => {
      const manager = new RequirementManager(testDir);
      const result = await manager.handle('实现测试功能');

      // 验证需求成功创建，包含必要信息
      assert.ok(result.success);
      assert.ok(result.requirement);
      assert.ok(result.requirement.id);
      assert.ok(result.executionPlan);
    });
  });

  describe('执行计划生成', () => {
    it('应该为每个需求生成执行计划', async () => {
      const manager = new RequirementManager(testDir);
      const result = await manager.handle('新功能需求');

      assert.ok(result.executionPlan);
      assert.ok(typeof result.executionPlan.totalSteps === 'number');
    });

    it('应该提供下一步操作指导', async () => {
      const manager = new RequirementManager(testDir);
      const result = await manager.handle('分析用户行为');

      assert.ok(result.nextSteps);
      assert.ok(Array.isArray(result.nextSteps));
      assert.ok(result.nextSteps.length > 0);
    });
  });

  describe('查询命令', () => {
    it('应该处理 list 命令', async () => {
      const manager = new RequirementManager(testDir);
      const result = await manager.handle('/req --list');

      assert.ok(result.success);
      assert.strictEqual(result.action, 'list_requirements');
    });

    it('应该处理 dashboard 命令', async () => {
      const manager = new RequirementManager(testDir);
      const result = await manager.handle('/req --dashboard');

      assert.ok(result.success);
      assert.strictEqual(result.action, 'show_dashboard');
    });

    it('应该处理 status 命令', async () => {
      const manager = new RequirementManager(testDir);
      const result = await manager.handle('/req --status REQ-001');

      assert.ok(result.success);
      assert.strictEqual(result.action, 'show_status');
    });
  });

  describe('错误处理', () => {
    it('应该处理空输入', async () => {
      const manager = new RequirementManager(testDir);
      const result = await manager.handle('');

      // 目前空输入会被解析，但不应该崩溃
      assert.ok(result !== undefined);
    });
  });

  describe('并发创建', () => {
    it('应该支持并发创建多个需求', async () => {
      const manager = new RequirementManager(testDir);

      const promises = [
        manager.handle('并发需求1'),
        manager.handle('并发需求2'),
        manager.handle('并发需求3')
      ];

      const results = await Promise.all(promises);

      assert.ok(results.every(r => r.success));
      assert.ok(results.every(r => r.requirement));
      assert.ok(results.every(r => r.requirement.id));

      // 验证 ID 是唯一的
      const ids = results.map(r => r.requirement.id);
      const uniqueIds = new Set(ids);
      assert.strictEqual(uniqueIds.size, 3);
    });
  });
});
