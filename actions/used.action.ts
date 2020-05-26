import { isNil } from '@tomato-js/shared';
import cheerio from 'cheerio';
import axios, { AxiosResponse } from 'axios';
import { Input } from '../commands';
import { AbstractAction } from './abstract.action';
import { NAME, USED_PAGE } from '../lib/configuration/const';
import { ERROR_PREFIX } from '../lib/ui';

function tryGetGithubUrl(url: string) {
  const gitReg = /git\+(.*)\.git/;
  if (gitReg.test(url)) {
    const result: any = url.match(gitReg);
    return result[1];
  }
  return url;
}

export class UsedAction extends AbstractAction {
  private usedList: any = [];
  private limitPage = 10;
  private showTopNumber: number = 20;
  private curPage: number = 1;
  public async handle(inputs: Input[], options: Input[]) {
    let name: string = inputs.find(option => option.name === NAME)!
      .value as string;
    const page = options.find(option => option.name === USED_PAGE)!
      .value as string;
    this.limitPage = Number(page) || 10;
    if (isNil(name)) {
      console.log(
        `\n${ERROR_PREFIX} 请输入需要查询使用情况的库的github链接，如：https://github.com/tomato-js/tomato`,
      );
      process.exit(1);
    }
    name = tryGetGithubUrl(name);
    try {
      await this.getInfo(`${name}/network/dependents`);
    } catch (error) {
      console.error(error);
    }
  }
  private async getInfo(url: string) {
    console.log(`fetching ${url}`);
    let homePageContent;
    try {
      homePageContent = await axios(url,{timeout:10000,});
    } catch (error) {
      console.log(`error in fetching`);
      console.error(error);
      this.showList();
    }

    console.log('finish fetching');
    const homePageBody = await (homePageContent as AxiosResponse).data;
    const nextIds = this.getNextId(homePageBody);
    if (isNil(nextIds)) {
      this.showList();
    } else {
      await this.getInfo(nextIds as string);
    }
  }
  public showList() {
    console.log(
      this.usedList
        .sort((a: any, b: any) => {
          return b.star - a.star;
        })
        .slice(0, this.showTopNumber),
    );
  }
  private getNextId(context: string) {
    const dom = cheerio.load(context);
    const nextBtn = dom('.btn.btn-outline.BtnGroup-item')[1];
    this.setUsedList(dom);
    const disable = nextBtn.attribs.disable === 'disabled';
    if (disable || this.curPage > this.limitPage) {
      return null;
    }
    this.curPage++;
    return nextBtn.attribs.href;
  }
  private setUsedList(dom: CheerioStatic) {
    const list = dom('.Box-row.d-flex.flex-items-center');
    list.map((index, item) => {
      const children = item.children;
      const nameSpan = children[3];
      const starDiv = children[5];
      const spanChild = nameSpan.childNodes;
      const nameNode = spanChild[3];
      const textNode = nameNode.childNodes[0];
      const text = textNode.data;
      const packageNode = spanChild[1];
      const packageName = packageNode.childNodes[0].data;
      const allName = `${packageName}/${text}`;
      const star = (starDiv.childNodes[1].childNodes[2].data || '').trim();
      this.usedList.push({
        name: allName,
        star: Number(star),
        link: `https://github.com/${allName}`,
      });
    });
  }
}
