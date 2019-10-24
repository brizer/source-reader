import { promisify } from 'util';
import fs from 'fs';
import path from 'path';
import { join } from 'path';
import { CommanderStatic, Command } from 'commander';
import { Input } from './command.input';
import {
  NAME,
  NO_REPORT,
  NO_OPEN,
  PACKAGE_MANAGER,
  CORE_SVG,
} from '../lib/configuration/const';
import { TreeAction, CoreAction, GraphAction } from '../actions';
import { formatReadSourceContent } from '../lib/configuration/defaults';

export class AllCommand {
  constructor(
    protected treeAction: TreeAction,
    protected innerAction: CoreAction,
    protected outerAction: GraphAction,
  ) {}

  public load(program: CommanderStatic): void {
    program
      .command('all <index>')
      .description('Perform all processes directly and quickly')
      .action(async (index: string, command: Command) => {
        const treeInputs: Input[] = [];
        treeInputs.push({ name: NAME, value: index || 'index.js' });
        const treeResult = await this.treeAction.handle(
          treeInputs,
          [],
          ['all'],
        );
        const outerInputs: Input[] = [];
        outerInputs.push({
          name: NAME,
          value: require(path.join(process.cwd(), './package.json')).name,
        });
        const outerOptions: Input[] = [];
        outerOptions.push({ name: PACKAGE_MANAGER, value: 'npm' });
        outerOptions.push({ name: NO_OPEN, value: true });
        const outerUrl = await this.outerAction.handle(
          outerInputs,
          outerOptions,
          [],
        );
        const innerInputs: Input[] = [];
        innerInputs.push({ name: NAME, value: index || 'index.js' });
        const innerOptions: Input[] = [];
        innerOptions.push({
          name: CORE_SVG,
          value: 'inner.svg',
        });
        const innerResult = await this.innerAction.handle(
          innerInputs,
          innerOptions,
          [],
        );
        const content = {
          treeResult,
          innerResult: '![img](./inner.svg)',
          outerResult: `请在： ${outerUrl} 查看`,
        };
        const formatedContent = formatReadSourceContent(content);
        await this.createReadSourceFile(formatedContent);
      });
  }

  private createReadSourceFile = (content?: string) => {
    const fileContent = content || formatReadSourceContent();
    const filePath = join(process.cwd(), './READ_SOURCE.md');
    return promisify(fs.writeFile)(filePath, fileContent);
  };
}
