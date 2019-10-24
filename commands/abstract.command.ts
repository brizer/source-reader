import { CommanderStatic } from 'commander';
import { AbstractAction } from '../actions/abstract.action';
// 抽象类，用来约束子类的实现格式
export abstract class AbstractCommand {
  constructor(protected action: AbstractAction) {}

  public abstract load(program: CommanderStatic): void;
}
