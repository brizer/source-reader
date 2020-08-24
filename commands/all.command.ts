import { promisify } from 'util';
import fs from 'fs';
import path from 'path';
import { join } from 'path';
import { CommanderStatic, Command } from 'commander';
import { loading } from '@tomato-node/ui';
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
import { GRAPH_DETAIL } from '../lib/configuration/const';

// Convert fs.readFile into Promise version of same    
const writeFile = promisify(fs.writeFile);

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
        outerOptions.push({ name: GRAPH_DETAIL, value: true });
        const myloading = loading('正在生成内部、外部模块依赖').show();
        const outerContent = await this.outerAction.handle(
          outerInputs,
          outerOptions,
          [],
        );
        await writeFile('outer.svg',outerContent,'utf-8');
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
          outerResult: '![img](./outer.svg)',
        };
        const formatedContent = formatReadSourceContent(content);
        await this.createReadSourceFile(formatedContent);
        myloading.hide({type:'succeed',text:'生成完毕'});

      });
  }

  private createReadSourceFile = (content?: string) => {
    const fileContent = content || formatReadSourceContent();
    const filePath = join(process.cwd(), './READ_SOURCE.md');
    return promisify(fs.writeFile)(filePath, fileContent);
  };
}
