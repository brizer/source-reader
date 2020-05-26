import { CommanderStatic, Command } from 'commander';
import path from 'path';
import { AbstractCommand } from './abstract.command';
import { Input } from './command.input';
import { NAME, USED_PAGE } from '../lib/configuration/const';

export class UsedCommand extends AbstractCommand {
  public load(program: CommanderStatic): void {
    program
      .command('used [name]')
      .alias('u')
      .description('Show the used list of package')
      .option('-p, --page <output>', 'page to fetching')
      .action(async (name: string, command: Command) => {
        const options: Input[] = [];
        options.push({ name: USED_PAGE, value: command.page });
        const inputs: Input[] = [];
        inputs.push({
          name: NAME,
          value:
            name ||
            (
              require(path.join(process.cwd(), './package.json')).repository ||
              {}
            ).url,
        });
        await this.action.handle(inputs,options);
        process.exit(0);
      });
  }
}
