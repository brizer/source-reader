import open from 'open';
import { Input } from '../commands';
import { AbstractAction } from './abstract.action';
import { INFO_PREFIX } from '../lib/ui';
import { getDependencyEntries, entryFromKey } from '../lib/graph/util';
import Store from '../lib/graph/Store';
import {
  PACKAGE_MANAGER,
  NAME,
  NO_REPORT,
  NO_OPEN,
  GRAPH_DETAIL,
} from '../lib/configuration/const';

const Viz = require('viz.js');
const { Module, render:renderViz } = require('viz.js/full.render.js');

export abstract class GraphActionClass extends AbstractAction {
  protected noReport: boolean = false;
  protected noOpen: boolean = false;
  protected detail: boolean = false;
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
    this.detail = options.some(
      option => option.name === GRAPH_DETAIL && option.value === true,
    );
    let urlStr: string = '';
    if (this.detail) {
      const svgContent = await this.handleGraph(packageName);
      // 返回svg图片的content
      return svgContent;
    }
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

  private async handleGraph(module: string) {
    const FONT = 'Roboto Condensed, sans-serif';
    new Store();
    Store.init();
    // Compose directed graph document (GraphViz notation)
    const nodes = ['\n// Nodes & per-node styling'];
    const edges = ['\n// Edges & per-edge styling'];
    const seen: any = {};
    function render(m: any, level = 0): any {
      if (Array.isArray(m)) {
        return Promise.all(m.map(render));
      }

      if (m.key in seen) return;
      seen[m.key] = true;

      nodes.push(`"${m}"`);

      const renderP = [];
      const EDGE_ATTRIBUTES: any = {
        dependencies: '[color=black]',
        devDependencies: '[color=red]',
        peerDependencies: '[color=green]',
        optionalDependencies: '[color=black style=dashed]',
        optionalDevDependencies: '[color=red style=dashed]',
      };
      for (const [dName, dVersion, dType] of getDependencyEntries(m, level)) {
        const p: any = Store.getModule(dName, dVersion).then(dst => {
          edges.push(`"${m}" -> "${dst}" ${EDGE_ATTRIBUTES[dType]}`);
          return render(dst, level + 1);
        });
        renderP.push(p);
      }
      return Promise.all(renderP);
    }

    let modules: any = module;
    if (typeof module == 'string') {
      modules = module.split(/[, ]+/);
      modules.sort();

      modules = await Promise.all(
        modules.map((moduleName: any) =>
          Store.getModule(...entryFromKey(moduleName)),
        ),
      );
    } else {
      modules = [module];
    }
    await render(modules);

    const title = modules.map((m: any) => m.package.name).join();
    const dotDoc = [
      'digraph {',
      'rankdir="LR"',
      'labelloc="t"',
      `label="${title}"`,
      '// Default styles',
      `graph [fontsize=16 fontname="${FONT}"]`,
      `node [shape=box style=rounded fontname="${FONT}" fontsize=11 height=0 width=0 margin=.04]`,
      `edge [fontsize=10, fontname="${FONT}" splines="polyline"]`,
      '',
    ]
      .concat(nodes)
      .concat(edges)
      .concat(
        modules.length > 1
          ? `{rank=same; ${modules.map((s: any) => `"${s}"`).join('; ')};}`
          : '',
      )
      .concat('}')
      .join('\n');

    const renderOptions = { format: 'svg' };

    let viz = new Viz({ Module, render:renderViz });
    const result = await viz.renderString(dotDoc, renderOptions);
    return result;
  }
}
