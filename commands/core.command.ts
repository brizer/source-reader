import { CommanderStatic, Command } from 'commander';
import { AbstractCommand } from './abstract.command';
import { Input } from './command.input';
import { NAME, CORE_SVG, CORE_DOT } from '../lib/configuration/const';

export class CoreCommand extends AbstractCommand {
  public load(program: CommanderStatic): void {
    program
      .command('inner <index>')
      .alias('i')
      .description('Show the core module dependency by index file')
      .option(
        '-s, --svg <output>',
        'Show the core dependency by svg, need graphviz.',
      )
      .option('-d, --dot', 'Show the core dependency by dot, need graphviz.')
      .action(async (index: string, command: Command) => {
        const options: Input[] = [];
        options.push({
          name: CORE_SVG,
          value: command.svg,
        });
        options.push({
          name: CORE_DOT,
          value: !!command.dot,
        });

        const inputs: Input[] = [];
        inputs.push({ name: NAME, value: index || 'index.js' });
        await this.action.handle(inputs, options);
        process.exit(0);
      });
  }
}
