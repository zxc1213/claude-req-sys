const { describe, it, before, after } = require('node:test');
const assert = require('node:assert');
const path = require('path');
const fs = require('fs/promises');
const { pathToFileURL } = require('url');

// 测试目录路径
const TEST_BASE_DIR = path.join(__dirname, '../temp-test-storage');
const STORAGE_MODULE = pathToFileURL(path.join(__dirname, '../../.claude/scripts/requirement-manager/utils/storage.js')).href;

describe('Storage Utility', () => {
  let storage;

  before(async () => {
    // 动态导入模块
    const module = await import(STORAGE_MODULE);
    storage = module.default || module;

    // 确保测试目录干净
    await storage.cleanup(TEST_BASE_DIR);
  });

  after(async () => {
    // 清理测试目录
    await storage.cleanup(TEST_BASE_DIR);
  });

  describe('init(baseDir)', () => {
    it('should create directory structure', async () => {
      await storage.init(TEST_BASE_DIR);

      const expectedDirs = [
        path.join(TEST_BASE_DIR, 'requirements'),
        path.join(TEST_BASE_DIR, 'requirements', 'features'),
        path.join(TEST_BASE_DIR, 'requirements', 'bugs'),
        path.join(TEST_BASE_DIR, 'requirements', 'tech-debt'),
        path.join(TEST_BASE_DIR, 'templates'),
        path.join(TEST_BASE_DIR, 'logs')
      ];

      for (const dir of expectedDirs) {
        const exists = await storage.exists(dir);
        assert.strictEqual(exists, true, `目录 ${dir} 应该存在`);
      }
    });

    it('should handle existing directories gracefully', async () => {
      // 第二次初始化应该不会抛出错误
      await assert.doesNotReject(async () => {
        await storage.init(TEST_BASE_DIR);
      });
    });
  });

  describe('exists(filePath)', () => {
    it('should return true for existing directory', async () => {
      await storage.init(TEST_BASE_DIR);
      const exists = await storage.exists(TEST_BASE_DIR);
      assert.strictEqual(exists, true);
    });

    it('should return true for existing file', async () => {
      const testFile = path.join(TEST_BASE_DIR, 'test.txt');
      await fs.writeFile(testFile, 'test');
      const exists = await storage.exists(testFile);
      assert.strictEqual(exists, true);
    });

    it('should return false for non-existent path', async () => {
      const exists = await storage.exists(path.join(TEST_BASE_DIR, 'nonexistent'));
      assert.strictEqual(exists, false);
    });
  });

  describe('createRequirementDir(baseDir, type, id)', () => {
    it('should create feature requirement directory', async () => {
      await storage.init(TEST_BASE_DIR);
      const reqPath = await storage.createRequirementDir(TEST_BASE_DIR, 'feature', 'FEAT-001');

      assert.ok(reqPath.includes('FEAT-001'));

      const metaFile = path.join(reqPath, 'meta.yaml');
      const exists = await storage.exists(metaFile);
      assert.strictEqual(exists, true);
    });

    it('should create bug requirement directory', async () => {
      await storage.init(TEST_BASE_DIR);
      const reqPath = await storage.createRequirementDir(TEST_BASE_DIR, 'bug', 'BUG-001');

      const metaFile = path.join(reqPath, 'meta.yaml');
      const exists = await storage.exists(metaFile);
      assert.strictEqual(exists, true);
    });

    it('should create tech-debt requirement directory', async () => {
      await storage.init(TEST_BASE_DIR);
      const reqPath = await storage.createRequirementDir(TEST_BASE_DIR, 'tech-debt', 'DEBT-001');

      const metaFile = path.join(reqPath, 'meta.yaml');
      const exists = await storage.exists(metaFile);
      assert.strictEqual(exists, true);
    });
  });

  describe('readMeta(baseDir, reqPath)', () => {
    it('should read existing metadata', async () => {
      await storage.init(TEST_BASE_DIR);
      const reqPath = await storage.createRequirementDir(TEST_BASE_DIR, 'feature', 'FEAT-002');
      const meta = await storage.readMeta(TEST_BASE_DIR, reqPath);

      assert.ok(meta);
      assert.strictEqual(meta.id, 'FEAT-002');
      assert.strictEqual(meta.type, 'feature');
      assert.ok(meta.createdAt);
    });

    it('should return null for non-existent metadata', async () => {
      const meta = await storage.readMeta(TEST_BASE_DIR, '/nonexistent/path');
      assert.strictEqual(meta, null);
    });
  });

  describe('writeMeta(baseDir, reqPath, meta)', () => {
    it('should write metadata to file', async () => {
      await storage.init(TEST_BASE_DIR);
      const reqPath = await storage.createRequirementDir(TEST_BASE_DIR, 'feature', 'FEAT-003');

      const testMeta = {
        id: 'FEAT-003',
        type: 'feature',
        title: 'Test Feature',
        status: 'open',
        priority: 'high',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      await storage.writeMeta(TEST_BASE_DIR, reqPath, testMeta);

      const readMeta = await storage.readMeta(TEST_BASE_DIR, reqPath);
      assert.deepStrictEqual(readMeta.id, testMeta.id);
      assert.strictEqual(readMeta.title, testMeta.title);
      assert.strictEqual(readMeta.priority, testMeta.priority);
    });
  });

  describe('cleanup(testDir)', () => {
    it('should remove test directory', async () => {
      await storage.init(TEST_BASE_DIR);
      const existsBefore = await storage.exists(TEST_BASE_DIR);
      assert.strictEqual(existsBefore, true);

      await storage.cleanup(TEST_BASE_DIR);

      const existsAfter = await storage.exists(TEST_BASE_DIR);
      assert.strictEqual(existsAfter, false);
    });

    it('should handle non-existent directory gracefully', async () => {
      await assert.doesNotReject(async () => {
        await storage.cleanup('/nonexistent/path');
      });
    });
  });
});
