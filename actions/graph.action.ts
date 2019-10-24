import open from 'open';
import { Input } from '../commands';
import { AbstractAction } from './abstract.action';
import { INFO_PREFIX } from '../lib/ui';
import {
  PACKAGE_MANAGER,
  NAME,
  NO_REPORT,
  NO_OPEN,
} from '../lib/configuration/const';

export abstract class GraphActionClass extends AbstractAction {
  protected noReport: boolean = false;
  protected noOpen: boolean = false;
}

export class GraphAction extends GraphActionClass {
  public async handle(inputs: Input[], options: Input[], extraFlags: string[]) {
    const packageName: string = inputs.find(option => option.name === NAME)!
      .value as string;
    const packageManager: string = options.find(
      option => option.name === PACKAGE_MANAGER,
    )!.value as string;
    this.noReport = options.some(
      option => option.name === NO_REPORT && option.value === true,
    );
    this.noOpen = options.some(
      option => option.name === NO_OPEN && option.value === true,
    );
    let urlStr: string = '';
    switch (packageManager) {
      case 'npm':
        urlStr = await this.openNpmGraph(packageName);
        break;
      default:
        break;
    }
    return urlStr;
  }

  private async openNpmGraph(name: string): Promise<string> {
    const url: string = `http://npm.broofa.com?q=${name}`;
    if (!this.noOpen) {
      await open(url);
    }
    if (!this.noReport) {
      console.log(`\n${INFO_PREFIX} 外部模块依赖分析完成，请在 ${url} 查看\n`);
    }
    return url;
  }
}
