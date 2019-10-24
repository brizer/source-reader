import chalk from 'chalk';
import { CommanderStatic } from 'commander';
import { TreeAction, GraphAction, CoreAction } from '../actions';
import { TreeCommand } from './tree.command';
import { GraphCommand } from './graph.command';
import { CoreCommand } from './core.command';
import { ERROR_PREFIX } from '../lib/ui';
import { AllCommand } from './all.command';

export class CommandLoader {
  public static load(program: CommanderStatic): void {
    new TreeCommand(new TreeAction()).load(program);
    new GraphCommand(new GraphAction()).load(program);
    new CoreCommand(new CoreAction()).load(program);
    new AllCommand(new TreeAction(), new CoreAction(), new GraphAction()).load(
      program,
    );
    this.handleInvalidCommand(program);
  }
  // 校验不合法的输入
  private static handleInvalidCommand(program: CommanderStatic) {
    //基于commander模块自带事件，校验输入命令是否合法
    program.on('command:*', () => {
      console.error(
        `\n${ERROR_PREFIX} Invalid command: ${chalk.red('%s')}`,
        program.args.join(' '),
      );
      console.log(
        `See ${chalk.red('--help')} for a list of available commands.\n`,
      );
      process.exit(1);
    });
  }
}
