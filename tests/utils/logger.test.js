const { describe, it, before, after } = from 'vitest';
import { expect } from 'vitest';
const path = require('path');
const fs = require('fs/promises');
const { 

// 测试目录路径
const TEST_BASE_DIR = path.join(__dirname, '../temp-test-logger');

describe('Logger Utility', () => {
  let logger;

  before(async () => {
    // 动态导入模块
    logger = default || module;

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
      expect(toBeTruthy();content.includes('Test info message'));
      expect(toBeTruthy();content.includes('REQ-001'));
      expect(toBeTruthy();content.includes('[INFO]'));
    });

    it('should log warning message', async () => {
      const logPath = path.join(TEST_BASE_DIR, 'test.log');
      await logger.log('REQ-002', 'warn', 'Test warning message', logPath);

      const content = await fs.readFile(logPath, 'utf-8');
      expect(toBeTruthy();content.includes('Test warning message'));
      expect(toBeTruthy();content.includes('[WARN]'));
    });

    it('should log error message', async () => {
      const logPath = path.join(TEST_BASE_DIR, 'error.log');
      await logger.log('REQ-003', 'error', 'Test error message', logPath);

      const content = await fs.readFile(logPath, 'utf-8');
      expect(toBeTruthy();content.includes('Test error message'));
      expect(toBeTruthy();content.includes('[ERROR]'));
    });
  });

  describe('info(reqId, message)', () => {
    it('should log info message', async () => {
      const logPath = path.join(TEST_BASE_DIR, 'info.log');
      await logger.info('REQ-004', 'Info test', logPath);

      const content = await fs.readFile(logPath, 'utf-8');
      expect(toBeTruthy();content.includes('Info test'));
      expect(toBeTruthy();content.includes('[INFO]'));
    });
  });

  describe('warn(reqId, message)', () => {
    it('should log warning message', async () => {
      const logPath = path.join(TEST_BASE_DIR, 'warn.log');
      await logger.warn('REQ-005', 'Warning test', logPath);

      const content = await fs.readFile(logPath, 'utf-8');
      expect(toBeTruthy();content.includes('Warning test'));
      expect(toBeTruthy();content.includes('[WARN]'));
    });
  });

  describe('error(reqId, message)', () => {
    it('should log error message', async () => {
      const logPath = path.join(TEST_BASE_DIR, 'error2.log');
      await logger.error('REQ-006', 'Error test', logPath);

      const content = await fs.readFile(logPath, 'utf-8');
      expect(toBeTruthy();content.includes('Error test'));
      expect(toBeTruthy();content.includes('[ERROR]'));
    });
  });

  describe('success(reqId, message)', () => {
    it('should log success message', async () => {
      const logPath = path.join(TEST_BASE_DIR, 'success.log');
      await logger.success('REQ-007', 'Success test', logPath);

      const content = await fs.readFile(logPath, 'utf-8');
      expect(toBeTruthy();content.includes('Success test'));
      expect(toBeTruthy();content.includes('[SUCCESS]'));
    });
  });
});
