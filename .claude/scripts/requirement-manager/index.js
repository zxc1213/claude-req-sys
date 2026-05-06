/**
 * RequirementManager - 智能需求管理系统主入口
 *
 * 功能：
 * - 接收用户输入
 * - 安全检查
 * - 解析需求
 * - 创建需求
 * - 生成执行计划
 * - 返回下一步操作
 */

import { Processor } from './core/processor.js';
import { schedule, generateSkillPrompt } from './core/scheduler.js';
import securityFilter from './features/security.js';
import { info, success, warn, error } from './utils/logger.js';
import path from 'path';
import chalk from 'chalk';

/**
 * RequirementManager 类
 */
class RequirementManager {
  /**
   * 构造函数
   * @param {string} baseDir - 基础目录路径
   */
  constructor(baseDir) {
    this.baseDir = baseDir;
    this.processor = new Processor(baseDir);
    this.logPath = path.join(baseDir, '.claude', 'logs', 'requirement.log');
  }

  /**
   * 主处理方法
   * @param {string} input - 用户输入
   * @param {object} options - 选项对象
   * @returns {Promise<object>} 处理结果
   */
  async handle(input, options = {}) {
    try {
      // 1. 安全检查
      const securityCheck = this.performSecurityCheck(input);
      if (!securityCheck.safe) {
        return this.formatSecurityWarning(securityCheck);
      }

      // 2. 解析输入
      const parsed = this.parseInput(input, options);

      // 3. 处理查询命令
      if (this.isQueryCommand(parsed)) {
        return await this.handleQueryCommand(parsed);
      }

      // 4. 创建需求
      const requirement = await this.createRequirement(parsed);

      // 5. 生成执行计划
      const executionPlan = this.generateExecutionPlan(requirement);

      // 6. 记录日志
      await this.logCreation(requirement, executionPlan);

      // 7. 返回结果
      return this.formatResult(requirement, executionPlan);
    } catch (err) {
      await error('SYSTEM', `处理失败: ${err.message}`, this.logPath);
      return this.formatError(err);
    }
  }

  /**
   * 执行安全检查
   * @param {string} input - 用户输入
   * @returns {object} 安全检查结果
   */
  performSecurityCheck(input) {
    const filterResult = securityFilter.filterRequirement(input);

    return {
      safe: filterResult.safe,
      warnings: filterResult.report.warnings,
      severity: filterResult.report.severity,
      filtered: filterResult.filtered
    };
  }

  /**
   * 格式化安全警告
   * @param {object} securityCheck - 安全检查结果
   * @returns {object} 格式化的警告
   */
  formatSecurityWarning(securityCheck) {
    const warnings = securityCheck.warnings.map(w => w.message).join('\n  ');

    return {
      success: false,
      error: 'security_check_failed',
      message: `检测到敏感信息，无法继续：\n  ${warnings}`,
      severity: securityCheck.severity,
      suggestions: [
        '请移除敏感信息后重试',
        '不要包含密码、密钥、个人身份信息等',
        '使用占位符代替真实数据'
      ]
    };
  }

  /**
   * 解析用户输入
   * @param {string} input - 用户输入
   * @param {object} options - 选项对象
   * @returns {object} 解析后的需求对象
   */
  parseInput(input, options) {
    // 使用 Processor 的静态方法解析类型
    const parsed = Processor.parseType(input);

    // 合并选项
    return {
      ...parsed,
      ...options
    };
  }

  /**
   * 检查是否是查询命令
   * @param {object} parsed - 解析后的对象
   * @returns {boolean}
   */
  isQueryCommand(parsed) {
    const queryCommands = ['--list', '--active', '--status', '--dashboard'];
    return queryCommands.some(cmd => parsed.description.includes(cmd));
  }

  /**
   * 处理查询命令
   * @param {object} parsed - 解析后的对象
   * @returns {Promise<object>} 查询结果
   */
  async handleQueryCommand(parsed) {
    const description = parsed.description;

    if (description.includes('--list')) {
      return {
        success: true,
        action: 'list_requirements',
        message: '列出所有需求',
        implementation: 'TODO: 实现需求列表功能'
      };
    }

    if (description.includes('--active')) {
      return {
        success: true,
        action: 'list_active',
        message: '显示当前活跃需求',
        implementation: 'TODO: 实现活跃需求查询'
      };
    }

    if (description.includes('--dashboard')) {
      return {
        success: true,
        action: 'show_dashboard',
        message: '显示需求仪表板',
        implementation: 'TODO: 实现仪表板功能'
      };
    }

    if (description.includes('--status')) {
      const id = description.replace('--status', '').trim();
      return {
        success: true,
        action: 'show_status',
        requirementId: id,
        message: `显示需求 ${id} 的状态`,
        implementation: 'TODO: 实现状态查询'
      };
    }

    return {
      success: false,
      error: 'unknown_query_command',
      message: '未知的查询命令'
    };
  }

  /**
   * 创建需求
   * @param {object} parsed - 解析后的需求对象
   * @returns {Promise<object>} 创建的需求对象
   */
  async createRequirement(parsed) {
    const { type, mode, description } = parsed;

    // 创建需求
    const result = await this.processor.create(parsed);

    // 返回完整的需求对象
    return {
      id: result.id,
      path: result.path,
      type,
      mode,
      description
    };
  }

  /**
   * 生成执行计划
   * @param {object} requirement - 需求对象
   * @returns {object} 执行计划
   */
  generateExecutionPlan(requirement) {
    try {
      return schedule(requirement);
    } catch (err) {
      // 如果生成计划失败，返回基础计划
      return {
        requirementId: requirement.id,
        type: requirement.type,
        mode: requirement.mode,
        steps: [],
        error: err.message
      };
    }
  }

  /**
   * 记录创建日志
   * @param {object} requirement - 需求对象
   * @param {object} executionPlan - 执行计划
   */
  async logCreation(requirement, executionPlan) {
    await success(
      requirement.id,
      `需求已创建: ${requirement.type} - ${requirement.description.substring(0, 50)}`,
      this.logPath
    );

    await info(
      requirement.id,
      `执行模式: ${executionPlan.modeDescription}, 步骤数: ${executionPlan.metadata.totalSteps}`,
      this.logPath
    );
  }

  /**
   * 格式化结果
   * @param {object} requirement - 需求对象
   * @param {object} executionPlan - 执行计划
   * @returns {object} 格式化的结果
   */
  formatResult(requirement, executionPlan) {
    // 获取第一个步骤（通常是 brainstorming）
    const firstStep = executionPlan.steps[0];

    return {
      success: true,
      requirement: {
        id: requirement.id,
        type: requirement.type,
        mode: requirement.mode,
        description: requirement.description
      },
      executionPlan: {
        mode: executionPlan.mode,
        modeDescription: executionPlan.modeDescription,
        totalSteps: executionPlan.metadata.totalSteps,
        checkpoints: executionPlan.checkpoints.length
      },
      nextSteps: this.generateNextSteps(requirement, executionPlan, firstStep)
    };
  }

  /**
   * 生成下一步操作
   * @param {object} requirement - 需求对象
   * @param {object} executionPlan - 执行计划
   * @param {object} firstStep - 第一步
   * @returns {object} 下一步操作
   */
  generateNextSteps(requirement, executionPlan, firstStep) {
    const steps = [];

    // 第一步：调用 skill
    if (firstStep) {
      steps.push({
        action: 'call_skill',
        skill: firstStep.skill,
        description: `使用 ${firstStep.skill} skill 分析需求`,
        prompt: generateSkillPrompt(firstStep.skill, {
          id: requirement.id,
          type: requirement.type,
          description: requirement.description
        })
      });
    }

    // 后续步骤提示
    if (executionPlan.steps.length > 1) {
      steps.push({
        action: 'continue_workflow',
        description: `完成后继续执行剩余 ${executionPlan.steps.length - 1} 个步骤`
      });
    }

    return steps;
  }

  /**
   * 格式化错误
   * @param {Error} err - 错误对象
   * @returns {object} 格式化的错误
   */
  formatError(err) {
    return {
      success: false,
      error: err.code || 'processing_error',
      message: err.message,
      suggestions: [
        '检查输入格式是否正确',
        '查看日志获取详细信息',
        '确保有足够的文件系统权限'
      ]
    };
  }

  /**
   * CLI 入口点
   * @param {string[]} args - 命令行参数
   */
  static async cli(args) {
    // 获取基础目录
    const baseDir = process.cwd();

    // 创建管理器实例
    const manager = new RequirementManager(baseDir);

    // 解析参数
    const input = args.join(' ');
    const options = {};

    // 处理输入
    const result = await manager.handle(input, options);

    // 输出结果
    console.log(JSON.stringify(result, null, 2));
  }
}

/**
 * 格式化输出到终端
 * @param {object} result - 处理结果
 */
function formatOutput(result) {
  console.log(chalk.cyan('📋 需求管理系统\n'));

  if (!result.success) {
    console.log(chalk.red(`✗ 错误: ${result.message}`));
    if (result.suggestions) {
      console.log(chalk.yellow('\n建议:'));
      result.suggestions.forEach(s => console.log(`  • ${s}`));
    }
    return;
  }

  // 需求信息
  if (result.requirement) {
    console.log(`${chalk.gray('类型:')} ${result.requirement.type}`);
    console.log(`${chalk.gray('模式:')} ${result.executionPlan.modeDescription}`);
    console.log(`${chalk.gray('描述:')} ${result.requirement.description}\n`);
    console.log(chalk.green(`✓ 需求已创建: ${result.requirement.id}\n`));
  }

  // 执行计划
  if (result.executionPlan) {
    console.log(chalk.cyan('执行计划:'));
    console.log(`  总步骤数: ${result.executionPlan.totalSteps}`);
    console.log(`  检查点数: ${result.executionPlan.checkpoints}\n`);
  }

  // 下一步
  if (result.nextSteps && result.nextSteps.length > 0) {
    console.log(chalk.cyan('下一步:'));
    result.nextSteps.forEach((step, index) => {
      if (step.action === 'call_skill') {
        console.log(`  ${index + 1}. 调用 skill: ${chalk.yellow(step.skill)}`);
        console.log(`     ${step.description}`);
        if (step.prompt) {
          console.log(chalk.gray(`     提示: ${step.prompt.substring(0, 100)}...`));
        }
      } else {
        console.log(`  ${index + 1}. ${step.description}`);
      }
    });
  }

  // 查询命令结果
  if (result.action) {
    console.log(chalk.cyan(`操作: ${result.action}`));
    console.log(chalk.gray(result.message));
    if (result.implementation) {
      console.log(chalk.yellow(`\n待实现: ${result.implementation}`));
    }
  }
}

// 导出
export default RequirementManager;
export { formatOutput };

// CLI 入口（如果直接运行此文件）
if (import.meta.url === `file://${process.argv[1]}`) {
  RequirementManager.cli(process.argv.slice(2)).catch(err => {
    console.error('CLI 错误:', err);
    process.exit(1);
  });
}
