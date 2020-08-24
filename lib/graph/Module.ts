import validate from './pjv';
import { get } from '@tomato-js/request';

function parseGithubPath(s:any) {
  s = /github.com\/([^/]+\/[^/?#]+)?/.test(s) && RegExp.$1;
  return s && s.replace(/\.git$/, '');
}

export default class Module {
  package: any;
  static key(name:any, version:any) {
    return `${name}@${version}`;
  }

  constructor(pkg:any = {}) {
    if (!pkg.maintainers) {
      pkg.maintainers = [];
    } else if (!Array.isArray(pkg.maintainers)) {
      pkg.maintainers = [pkg.maintainers];
    }
    this.package = pkg;
  }

  validate() {
    return validate(this.package);
  }

  get key() {
    return Module.key(this.package.name, this.version);
  }

  get version() {
    const version = this.package.version;
    return version && (version.version || version);
  }

  get githubPath() {
    const pkg = this.package;

    for (const k of ['repository', 'homepage', 'bugs']) {
      const path = parseGithubPath(pkg[k] && pkg[k].url);
      if (path) return path;
    }

    return null;
  }

  async getScores() {
    if (!this.package._scores) {
      let search:any;

      try {
        search = await get(`https://api.npms.io/v2/package/${this.package.name}`);
      } catch (err) {
        console.error(err);
        return;
      }

      const score = search.score;
      this.package._scores = score ? {
        final: score.final,
        quality: score.detail.quality,
        popularity: score.detail.popularity,
        maintenance: score.detail.maintenance
      } : null;
    }

    return this.package._scores;
  }

  get licenseString() {
    // Legacy: 'licenses' field
    let license = this.package.license || this.package.licenses;

    // Legacy: array of licenses?
    if (Array.isArray(license)) {
      // Convert to SPDX form
      // TODO: Is "OR" the correct operator for this?
      return license.map(l => l.type || l).join(' OR ');
    }

    // Legacy: license object?
    if (typeof (license) == 'object') license = license.type;

    if (!license) return null;

    // Strip outer ()'s (SPDX notation)
    return String(license).replace(/^\(|\)$/g, '');
  }

  toString() {
    return this.key;
  }

  toJSON() {
    return this.package;
  }
}