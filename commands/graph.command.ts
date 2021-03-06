import path from 'path';
import { CommanderStatic, Command } from 'commander';
import { AbstractCommand } from './abstract.command';
import { Input } from './command.input';
import { defaultConfiguration } from '../lib/configuration/defaults';
import { PACKAGE_MANAGER, NAME, GRAPH_DETAIL } from '../lib/configuration/const';

export class GraphCommand extends AbstractCommand {
  public load(program: CommanderStatic): void {
    program
      .command('outer [name]')
      .alias('o')
      .description('Show the external module dependency of package')
      // .option('-p, --package-manager', 'Whick package manager, default is npm')
      .option('-d, --detail', 'Show detail of dependencies in document, need graphviz.')
      .action(async (name: string, command: Command) => {
        const options: Input[] = [];
        options.push({
          name: PACKAGE_MANAGER,
          value: command.packageManager || defaultConfiguration.packageManager,
        });
        options.push({
          name:GRAPH_DETAIL,
          value: command.detail || defaultConfiguration.packageManager
        })
        const inputs: Input[] = [];
        inputs.push({
          name: NAME,
          value:
            name || require(path.join(process.cwd(), './package.json')).name,
        });
        await this.action.handle(inputs, options);
        process.exit(0);
      });
  }
}
