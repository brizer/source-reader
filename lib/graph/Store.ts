import { get } from "@tomato-js/request";
import Module from './Module.js';


const _getCache:any = {};
const stats = { active: 0, complete: 0 };
// fetch module url, caching results (in memory for the time being)
async function fetchModule(name:any, version:any = 'latest') {
  const isScoped = name.startsWith('@');

  // url-escape "/"'s in the name
  const path = `${name.replace(/\//g, '%2F')}`;
  const pathAndVersion = `${path}/latest`;

  // Use cached request if available.  (We can get module info from versioned or unversioned API requests)
  let req = _getCache[pathAndVersion] || _getCache[path];

  if (!req) {
    // If semver isn't valid (i.e. not a simple, canonical version - e.g.
    // "1.2.3") fetch all versions (we'll figure out the specific version below)
    //
    // Also, we can't fetch scoped modules at specific versions.  See https://goo.gl/dSMitm
    const reqPath = !isScoped ? pathAndVersion : path;
    req = _getCache[reqPath] =   get(`https://registry.npmjs.org/${reqPath}`);
  }

  return req.then((data:any) => {
    let { data:body } = data;
    if (!body) throw Error('No module info found');
    if (typeof (body) != 'object') throw Error('Response was not an object');
    if (body.unpublished) throw Error('Module is unpublished');

    // If no explicit version was requested, find best semver match
    const versions = body.versions;
    if (versions) {
      let resolvedVersion;

      // Use latest dist tags, if available
      if (!version && ('dist-tags' in body)) {
        resolvedVersion = body['dist-tags'].latest;
      }

      if (!resolvedVersion) {
        // Pick last version that satisfies semver
        resolvedVersion = version[version.length-1];
      }

      body = versions[resolvedVersion];
    }

    // If we fail to find info, just create a stub entry
    if (!body) {
      body = { stub: true, name, version, maintainers: [] };
    }

    return body;
  });
}

/**
 * HTTP request api backed by localStorage cache
 */
export default class Store {
  static onRequest(stats: { active: number; complete: number; }) {
    throw new Error("Method not implemented.");
  }
  static _inflight: {};
  static _moduleCache: any;
  static _requestCache: any;
  static init() {
    this._inflight = {};
    this._moduleCache = {};
    this._requestCache = {};
  }

  // GET package info
  static async getModule(name?:any, version?:any) {
    const cacheKey = `${name}@${version}`;

    if (this._moduleCache[cacheKey]) return this._moduleCache[cacheKey];

    let moduleInfo;

    if (!(/github:|git\+/.test(version))) { // We don't support git-hosted modules
      try {
        // If semver isn't valid (i.e. not a simple, canonical version - e.g.
        // "1.2.3") fetch all versions (we'll figure out the specific version below)
        //
        // Also, we can't fetch scoped modules at specific versions.  See https://goo.gl/dSMitm
        moduleInfo = await fetchModule(name, version);
      } catch (err) {
        
      }
    }

    return this._moduleCache[cacheKey] = new Module(moduleInfo);
  }
}