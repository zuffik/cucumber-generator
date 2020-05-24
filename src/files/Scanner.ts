import glob from 'glob';
import * as fs from 'fs';
import * as path from 'path';

export type ScanResult = {
  absolute: string[];
  relative: string[];
};

export class Scanner {
  constructor(public readonly rootDir: string) {}

  public async scanForFeatures(): Promise<ScanResult> {
    const root = this.rootDir.endsWith('/')
      ? this.rootDir.slice(0, this.rootDir.length - 1)
      : this.rootDir;
    return await new Promise((resolve, reject) =>
      glob(root + '/**/*.feature', { follow: true }, (err, matches) => {
        if (err) {
          return reject(err);
        }
        resolve({
          absolute: matches,
          relative: matches.map((r) => r.replace(this.rootDir, '').substr(1)),
        });
      })
    );
  }
}
