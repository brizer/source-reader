import { CommanderStatic } from 'commander';

export function getRemainingFlags(
  cli: CommanderStatic,
  spliceFlag: string,
): string[] {
  const params = [...cli.rawArgs];
  if (!params.includes(spliceFlag))
    throw new Error('spliceFlag must be in cli');
  return params.splice(params.indexOf(spliceFlag) + 1, Infinity);
}

export function formatMapForFlags(flags: string[] = []): any {
  const map: any = {};
  flags.map(v => {
    if (v.includes('-') || v.includes('--')) {
      const puerKey = v.replace(/\-/g, '');
      map[puerKey] = flags[flags.indexOf(v) + 1];
    }
  });
  return map;
}
