const madge = require('madge');
import { Input } from '../commands';
import { AbstractAction } from './abstract.action';
import { INFO_PREFIX } from '../lib/ui';
import { NAME, CORE_SVG, CORE_DOT } from '../lib/configuration/const';
export class CoreAction extends AbstractAction {
  public async handle(inputs: Input[], options: Input[], extraFlags: string[]) {
    const path: string = inputs.find(option => option.name === NAME)!
      .value as string;
    const useDot: boolean = options.some(
      option => option.name === CORE_DOT && option.value === true,
    );
    const useSvg: string = options.find(option => option.name === CORE_SVG)!
      .value as string;
    const madgeIns = await madge(path);
    let stdout = '';
    let notify = '';
    if (useDot) {
      stdout = await madgeIns.dot();
      return await this.printOutput(stdout, notify);
    }
    if (useSvg) {
      const outputPath = await madgeIns.image(useSvg);
      notify = `生成svg文件位于${outputPath}`;
      return await this.printOutput(stdout, notify);
    }

    stdout = await madgeIns.obj();
    return await this.printOutput(stdout, notify);
  }

  private async printOutput(stdout: string = '', notify: string = '') {
    console.log(stdout);
    console.log(`\n${INFO_PREFIX} 内部文件模块依赖分析完成 ${notify} \n`);
  }
}
