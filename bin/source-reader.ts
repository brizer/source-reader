#!/usr/bin/env node
import commander from 'commander';
import { CommanderStatic } from 'commander';
import { CommandLoader } from '../commands';

const bootstrap = () => {
  const program: CommanderStatic = commander;
  program
    .version(require('../package.json').version)
    .usage('<command> [options]');
  CommandLoader.load(program);
  commander.parse(process.argv);
  // 默认输出帮助
  if (!program.args.length) {
    program.outputHelp();
  }
};

bootstrap();
