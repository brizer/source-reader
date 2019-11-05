import chalk from 'chalk';
import { ERROR_PREFIX } from '../ui';

const which = require('which');

export async function isBinExists(name: string): Promise<any> {
  let binInfo: string | boolean;
  try {
    binInfo = await which(name);
  } catch (error) {
    binInfo = false;
  }
  return binInfo;
}

export async function judgeGraphViz() {
  if (!(await isBinExists('dot'))) {
    console.error(
      `\n${ERROR_PREFIX} 要使用高级功能请先安装${chalk.green(
        'graphviz',
      )}，地址为：http://www.graphviz.org/ `,
    );
    process.exit(1);
  }
}
