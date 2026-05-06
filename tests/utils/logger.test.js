const { describe, it, before, after } = require('node:test');
const assert = require('node:assert');
const path = require('path');
const fs = require('fs/promises');
const { pathToFileURL } = require('url');

// 测试目录路径
const TEST_BASE_DIR = path.join(__dirname, '../temp-test-logger');
const LOGGER_MODULE = pathToFileURL(path.join(__dirname, '../../.claude/scripts/requirement-manager/utils/logger.js')).href;

describe('Logger Utility', () => {
  let logger;

  before(async () => {
    // 动态导入模块
    const module = await import(LOGGER_MODULE);
    logger = module.default || module;

    // 创建测试目录
    await fs.mkdir(TEST_BASE_DIR, { recursive: true });
  });

  after(async () => {
    // 清理测试目录
    await fs.rm(TEST_BASE_DIR, { recursive: true, force: true });
  });

  describe('log(reqId, level, message)', () => {
    it('should log info message', async () => {
      const logPath = path.join(TEST_BASE_DIR, 'test.log');
      await logger.log('REQ-001', 'info', 'Test info message', logPath);

      const content = await fs.readFile(logPath, 'utf-8');
      assert.ok(content.includes('Test info message'));
      assert.ok(content.includes('REQ-001'));
      assert.ok(content.includes('[INFO]'));
    });

    it('should log warning message', async () => {
      const logPath = path.join(TEST_BASE_DIR, 'test.log');
      await logger.log('REQ-002', 'warn', 'Test warning message', logPath);

      const content = await fs.readFile(logPath, 'utf-8');
      assert.ok(content.includes('Test warning message'));
      assert.ok(content.includes('[WARN]'));
    });

    it('should log error message', async () => {
      const logPath = path.join(TEST_BASE_DIR, 'error.log');
      await logger.log('REQ-003', 'error', 'Test error message', logPath);

      const content = await fs.readFile(logPath, 'utf-8');
      assert.ok(content.includes('Test error message'));
      assert.ok(content.includes('[ERROR]'));
    });
  });

  describe('info(reqId, message)', () => {
    it('should log info message', async () => {
      const logPath = path.join(TEST_BASE_DIR, 'info.log');
      await logger.info('REQ-004', 'Info test', logPath);

      const content = await fs.readFile(logPath, 'utf-8');
      assert.ok(content.includes('Info test'));
      assert.ok(content.includes('[INFO]'));
    });
  });

  describe('warn(reqId, message)', () => {
    it('should log warning message', async () => {
      const logPath = path.join(TEST_BASE_DIR, 'warn.log');
      await logger.warn('REQ-005', 'Warning test', logPath);

      const content = await fs.readFile(logPath, 'utf-8');
      assert.ok(content.includes('Warning test'));
      assert.ok(content.includes('[WARN]'));
    });
  });

  describe('error(reqId, message)', () => {
    it('should log error message', async () => {
      const logPath = path.join(TEST_BASE_DIR, 'error2.log');
      await logger.error('REQ-006', 'Error test', logPath);

      const content = await fs.readFile(logPath, 'utf-8');
      assert.ok(content.includes('Error test'));
      assert.ok(content.includes('[ERROR]'));
    });
  });

  describe('success(reqId, message)', () => {
    it('should log success message', async () => {
      const logPath = path.join(TEST_BASE_DIR, 'success.log');
      await logger.success('REQ-007', 'Success test', logPath);

      const content = await fs.readFile(logPath, 'utf-8');
      assert.ok(content.includes('Success test'));
      assert.ok(content.includes('[SUCCESS]'));
    });
  });
});
