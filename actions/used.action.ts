import { isNil } from '@tomato-js/shared';
import { Npm } from '@tomato-js/api';
import { tableContent } from "@tomato-node/ui";
import { Input } from '../commands';
import { AbstractAction } from './abstract.action';
import { NAME, USED_PAGE } from '../lib/configuration/const';
import { ERROR_PREFIX } from '../lib/ui';
type Info = {
  [key: string]: {
    stars: number;
    url: string;
  };
};
export class UsedAction extends AbstractAction {
  private limitPage = 10;
  public async handle(inputs: Input[], options: Input[]) {
    let name: string = inputs.find(option => option.name === NAME)!
      .value as string;
    const page = options.find(option => option.name === USED_PAGE)!
      .value as string;
    this.limitPage = Number(page) || 10;
    if (isNil(name)) {
      console.log(
        `\n${ERROR_PREFIX} 请输入需要查询使用情况的npm库的名称，如：axios`,
      );
      process.exit(1);
    }
    const api = new Npm({
      name,
      pages: this.limitPage,
    });
    const infos = await api.getSortedDependentsByStar({
      token: process.env.GITHUB_TOKEN as string,
    });
    this.printTable(infos);
    return infos;
  }
  public printTable(infos: Info[]) {
    const arr = [];
    arr.push(['name','start','url']);
    infos.map(v=>{
      arr.push([Object.keys(v)[0],(Object.values(v)[0] as any).stars,(Object.values(v)[0] as any).url]);
    })
    console.log(tableContent(arr))
  }
}
