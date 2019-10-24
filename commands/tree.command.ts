import { CommanderStatic } from 'commander';
import { AbstractCommand } from './abstract.command';
import { getRemainingFlags } from '../lib/utils/params';

export class TreeCommand extends AbstractCommand {
  public load(program: CommanderStatic): void {
    program
      .command('tree [args...]')
      .allowUnknownOption()
      .description(
        'Show the dir of project\nuse tree-cli, more info : https://github.com/MrRaindrop/tree-clis',
      )
      .action(async (args: string) => {
        const flags = getRemainingFlags(program, 'tree');
        await this.action.handle([], [], flags);
        process.exit(0);
      });
  }
}
