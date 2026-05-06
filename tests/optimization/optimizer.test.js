import { describe, it, beforeEach, afterEach } from 'node:test';
import assert from 'node:assert';
import fs from 'node:fs/promises';
import yaml from 'js-yaml';
import { Optimizer } from '../../.claude/scripts/requirement-manager/optimization/optimizer.js';

describe('Optimizer', () => {
  const testDir = '.test-optimizer';

  beforeEach(async () => {
    await fs.mkdir(`${testDir}/.requirements/_system`, { recursive: true });
  });

  afterEach(async () => {
    await fs.rm(testDir, { recursive: true, force: true });
  });

  describe('#generateDecision', () => {
    it('应该基于评价报告生成优化决策', async () => {
      const optimizer = new Optimizer(testDir);
      const evaluationReport = {
        bottlenecks: [
          { type: 'low_completion', severity: 'medium', types: [{ type: 'bug', rate: 0.6 }] }
        ],
        cost_efficiency: { cache_efficiency: 'poor', cache_hit_rate: 0.4 },
        skill_evaluation: { worst_skill: 'research' }
      };

      const decision = await optimizer.generateDecision(evaluationReport);

      assert.ok(decision.id);
      assert.ok(decision.timestamp);
      assert.ok(decision.actions);
      assert.ok(decision.actions.length > 0);
    });

    it('应该为瓶颈类型生成针对性决策', async () => {
      const optimizer = new Optimizer(testDir);
      const evaluationReport = {
        bottlenecks: [
          { type: 'high_cost', severity: 'critical', over_budget: 10000 }
        ]
      };

      const decision = await optimizer.generateDecision(evaluationReport);

      const costAction = decision.actions.find(a => a.category === 'cost');
      assert.ok(costAction);
      assert.strictEqual(costAction.priority, 'critical');
    });

    it('应该为无瓶颈系统生成维护建议', async () => {
      const optimizer = new Optimizer(testDir);
      const evaluationReport = {
        bottlenecks: [],
        system_health: 'excellent'
      };

      const decision = await optimizer.generateDecision(evaluationReport);

      assert.ok(decision.actions);
      assert.ok(decision.actions.every(a => a.category === 'maintenance'));
    });
  });

  describe('#prioritizeActions', () => {
    it('应该按优先级排序决策动作', async () => {
      const optimizer = new Optimizer(testDir);
      const actions = [
        { category: 'test', priority: 'low' },
        { category: 'cost', priority: 'critical' },
        { category: 'completion', priority: 'medium' }
      ];

      const prioritized = await optimizer.prioritizeActions(actions);

      assert.strictEqual(prioritized[0].priority, 'critical');
      assert.strictEqual(prioritized[prioritized.length - 1].priority, 'low');
    });

    it('应该为相同优先级按类别排序', async () => {
      const optimizer = new Optimizer(testDir);
      const actions = [
        { category: 'test', priority: 'high', order: 3 },
        { category: 'cost', priority: 'high', order: 1 },
        { category: 'completion', priority: 'high', order: 2 }
      ];

      const prioritized = await optimizer.prioritizeActions(actions);

      assert.strictEqual(prioritized[0].category, 'cost');
      assert.strictEqual(prioritized[1].category, 'completion');
      assert.strictEqual(prioritized[2].category, 'test');
    });
  });

  describe('#applyDecision', () => {
    it('应该应用优化决策', async () => {
      const optimizer = new Optimizer(testDir);
      const decision = {
        id: 'OPT-001',
        actions: [
          {
            id: 'act-1',
            type: 'config_change',
            category: 'cost',
            config: { cache_ttl: 3600 }
          }
        ]
      };

      const result = await optimizer.applyDecision(decision);

      assert.ok(result.success);
      assert.strictEqual(result.applied_actions.length, 1);
    });

    it('应该记录应用历史', async () => {
      const optimizer = new Optimizer(testDir);
      const decision = {
        id: 'OPT-001',
        actions: [
          {
            id: 'act-1',
            type: 'config_change',
            category: 'cost',
            config: { cache_ttl: 3600 }
          }
        ]
      };

      await optimizer.applyDecision(decision);

      const history = await optimizer.getHistory();
      assert.ok(history.length > 0);
      assert.strictEqual(history[0].decision_id, 'OPT-001');
    });
  });

  describe('#rollback', () => {
    it('应该回滚优化决策', async () => {
      const optimizer = new Optimizer(testDir);
      const decision = {
        id: 'OPT-001',
        actions: [
          {
            id: 'act-1',
            type: 'config_change',
            category: 'cost',
            config: { cache_ttl: 3600 }
          }
        ]
      };

      await optimizer.applyDecision(decision);
      const rollbackResult = await optimizer.rollback('OPT-001');

      assert.ok(rollbackResult.success);
      assert.strictEqual(rollbackResult.rolled_back_actions.length, 1);
    });

    it('应该记录回滚历史', async () => {
      const optimizer = new Optimizer(testDir);
      const decision = {
        id: 'OPT-001',
        actions: [
          {
            id: 'act-1',
            type: 'config_change',
            category: 'cost',
            config: { cache_ttl: 3600 }
          }
        ]
      };

      await optimizer.applyDecision(decision);
      await optimizer.rollback('OPT-001');

      const history = await optimizer.getHistory();
      const rollbackEntry = history.find(h => h.type === 'rollback');
      assert.ok(rollbackEntry);
    });
  });

  describe('#validateDecision', () => {
    it('应该验证决策安全性', async () => {
      const optimizer = new Optimizer(testDir);
      const safeDecision = {
        id: 'OPT-001',
        actions: [
          { id: 'act-1', type: 'config_change', category: 'cost' }
        ]
      };

      const validation = await optimizer.validateDecision(safeDecision);

      assert.ok(validation.valid);
    });

    it('应该拒绝危险决策', async () => {
      const optimizer = new Optimizer(testDir);
      const dangerousDecision = {
        id: 'OPT-001',
        actions: [
          { id: 'act-1', type: 'delete_data', category: 'dangerous' }
        ]
      };

      const validation = await optimizer.validateDecision(dangerousDecision);

      assert.ok(!validation.valid);
      assert.ok(validation.errors.length > 0);
    });

    it('应该检查决策频率限制', async () => {
      const optimizer = new Optimizer(testDir);

      // 快速应用多个决策
      for (let i = 0; i < 5; i++) {
        const decision = {
          id: `OPT-${i}`,
          actions: [{ id: `act-${i}`, type: 'config_change', category: 'cost' }]
        };
        await optimizer.applyDecision(decision);
      }

      const frequentDecision = {
        id: 'OPT-FREQ',
        actions: [{ id: 'act-freq', type: 'config_change', category: 'cost' }]
      };

      const validation = await optimizer.validateDecision(frequentDecision);

      assert.ok(!validation.valid);
      assert.ok(validation.errors.some(e => e.includes('frequency')));
    });
  });

  describe('#getHistory', () => {
    it('应该返回优化历史', async () => {
      const optimizer = new Optimizer(testDir);
      const decision = {
        id: 'OPT-001',
        actions: [{ id: 'act-1', type: 'config_change', category: 'cost' }]
      };

      await optimizer.applyDecision(decision);

      const history = await optimizer.getHistory();

      assert.ok(Array.isArray(history));
      assert.ok(history.length > 0);
    });

    it('应该按时间倒序返回历史', async () => {
      const optimizer = new Optimizer(testDir);

      for (let i = 0; i < 3; i++) {
        const decision = {
          id: `OPT-${i}`,
          actions: [{ id: `act-${i}`, type: 'config_change', category: 'cost' }]
        };
        await optimizer.applyDecision(decision);
      }

      const history = await optimizer.getHistory();

      assert.strictEqual(history[0].decision_id, 'OPT-2');
      assert.strictEqual(history[2].decision_id, 'OPT-0');
    });
  });

  describe('#generateDecisionId', () => {
    it('应该生成唯一决策 ID', async () => {
      const optimizer = new Optimizer(testDir);

      // 生成第一个 ID 并应用决策
      const id1 = await optimizer.generateDecisionId();
      const decision1 = {
        id: id1,
        actions: [{ id: 'act-1', type: 'config_change', category: 'cost' }]
      };
      await optimizer.applyDecision(decision1);

      // 生成第二个 ID
      const id2 = await optimizer.generateDecisionId();

      assert.ok(id1);
      assert.ok(id2);
      assert.notStrictEqual(id1, id2);
    });

    it('应该生成符合格式的 ID', async () => {
      const optimizer = new Optimizer(testDir);
      const id = await optimizer.generateDecisionId();

      assert.ok(/^OPT-\d{8}-\d{3}$/.test(id));
    });
  });
});
