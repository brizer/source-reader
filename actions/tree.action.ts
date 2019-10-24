import tree from 'tree-cli';
import { Input } from '../commands';
import { defaultConfiguration } from '../lib/configuration/defaults';
import { AbstractAction } from './abstract.action';
import { formatMapForFlags } from '../lib/utils/params';
import { INFO_PREFIX } from '../lib/ui';
export class TreeAction extends AbstractAction {
  public async handle(inputs: Input[], outputs: Input[], extraFlags: string[]) {
    const flags = formatMapForFlags(extraFlags);
    console.log(`\n${INFO_PREFIX} 项目文件结构生成中...\n`);

    const result = await tree({
      ...(defaultConfiguration.treeConfig as Partial<Tree.IFlags>),
      ...flags,
    });
    console.log(result.report);
    console.log(`\n${INFO_PREFIX} 项目文件结构生成完毕\n`);
    return result.report;
  }
}
