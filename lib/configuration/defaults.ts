import { Configuration } from './configuration';

interface ReadSourceContent {
  treeResult: string;
  outerResult: string;
  innerResult: string;
}

export const defaultConfiguration: Configuration = {
  treeConfig: {
    l: 10,
    ignore: ['node_modules', 'test'],
  },
  packageManager: 'npm',
};

export function formatReadSourceContent(
  content: ReadSourceContent = {
    treeResult: '',
    outerResult: '',
    innerResult: '',
  },
) {
  const readSourceContent = `
# 源码分析

## 文件结构

\`\`\` bash
${content.treeResult}
\`\`\`

## 外部模块依赖

${content.outerResult}

## 内部模块依赖

${content.innerResult}
  `;
  return readSourceContent;
}
