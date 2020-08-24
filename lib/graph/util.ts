export function entryFromKey(key:any) {
  const MODULE_RE = /^(@?[^@]+)(?:@(.*))?$/;

  if (!MODULE_RE.test(key)) console.log('Invalid key', key);

  return RegExp.$2 ? [RegExp.$1, RegExp.$2] : [RegExp.$1];
}

export function getDependencyEntries(pkg:any, level = 0):any {
  pkg = pkg.package || pkg;

  const deps = [];

  const type = 'dependencies';
  if(pkg[type]){
    const d = Object.entries(pkg[type]);
    d.forEach(o => o.push(type));
    deps.push(...d);
  }
  return deps;
}

export function simplur(strings:any, ...exps:any) {
  const result = [];
  let n = exps[0];
  let label = n;
  if (Array.isArray(n) && n.length == 2) [n, label] = n;
  for (const s of strings) {
    if (typeof n == 'number') {
      result.push(s.replace(/\[([^|]*)\|([^\]]*)\]/g, n == 1 ? '$1' : '$2'));
    } else {
      result.push(s);
    }

    if (!exps.length) break;
    n = label = exps.shift();
    if (Array.isArray(n) && n.length == 2) [n, label] = n;
    result.push(label);
  }

  return result.join('');
}
