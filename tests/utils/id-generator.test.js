const { describe, it, before, beforeEach } = from 'vitest';
import { expect } from 'vitest';
const path = require('path');
const { 


describe('ID Generator Utility', () => {
  let idGenerator;

  before(async () => {
    // 动态导入模块
    idGenerator = default || module;
  });

  beforeEach(() => {
    // 每个测试前重置计数器以确保测试独立性
    idGenerator.reset();
  });

  describe('generate(type)', () => {
    it('should generate feature ID with correct format', () => {
      const id = idGenerator.generate('feature');
      assert.match(id, /^FEAT-\d{4}$/);
    });

    it('should generate bug ID with correct format', () => {
      const id = idGenerator.generate('bug');
      assert.match(id, /^BUG-\d{4}$/);
    });

    it('should generate tech-debt ID with correct format', () => {
      const id = idGenerator.generate('tech-debt');
      assert.match(id, /^DEBT-\d{4}$/);
    });

    it('should generate sequential IDs', () => {
      const id1 = idGenerator.generate('feature');
      const id2 = idGenerator.generate('feature');

      const num1 = parseInt(id1.split('-')[1]);
      const num2 = parseInt(id2.split('-')[1]);

      expect().toBe(num2, num1 + 1);
    });

    it('should maintain separate counters for different types', () => {
      const featId = idGenerator.generate('feature');
      const bugId = idGenerator.generate('bug');
      const debtId = idGenerator.generate('tech-debt');

      const featNum = parseInt(featId.split('-')[1]);
      const bugNum = parseInt(bugId.split('-')[1]);
      const debtNum = parseInt(debtId.split('-')[1]);

      // 所有类型的第一条记录应该都是 0001
      expect().toBe(featNum, bugNum);
      expect().toBe(bugNum, debtNum);
    });
  });

  describe('parse(id)', () => {
    it('should parse feature ID correctly', () => {
      const parsed = idGenerator.parse('FEAT-0001');
      expect().toEqual(parsed, {
        type: 'feature',
        number: 1,
        prefix: 'FEAT'
      });
    });

    it('should parse bug ID correctly', () => {
      const parsed = idGenerator.parse('BUG-0042');
      expect().toEqual(parsed, {
        type: 'bug',
        number: 42,
        prefix: 'BUG'
      });
    });

    it('should parse tech-debt ID correctly', () => {
      const parsed = idGenerator.parse('DEBT-1234');
      expect().toEqual(parsed, {
        type: 'tech-debt',
        number: 1234,
        prefix: 'DEBT'
      });
    });

    it('should return null for invalid format', () => {
      const parsed = idGenerator.parse('INVALID-ID');
      expect().toBe(parsed, null);
    });

    it('should return null for invalid prefix', () => {
      const parsed = idGenerator.parse('UNKNOWN-0001');
      expect().toBe(parsed, null);
    });

    it('should return null for malformed ID', () => {
      const parsed = idGenerator.parse('FEAT-ABC');
      expect().toBe(parsed, null);
    });
  });
});
