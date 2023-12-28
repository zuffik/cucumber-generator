import { glob } from 'glob';
import * as path from 'path';

export type ScanResult = {
  absolute: string[];
  relative: string[];
};

export class Scanner {
  constructor(public readonly rootDir: string) {}

  public async scanForFeatures(): Promise<ScanResult> {
    const root = this.rootDir.endsWith(path.sep)
      ? this.rootDir.slice(0, this.rootDir.length - 1)
      : this.rootDir;
    return await new Promise((resolve, reject) => {
      glob(root + '/**/*.feature', { follow: true })
        .then((matches) => {
          resolve({
            absolute: matches,
            relative: matches.map((r) => r.replace(root.replace(/\\/g, '/'), '').substr(1)),
          });
        })
        .catch(reject);
    });
  }
}
