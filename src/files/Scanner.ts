import glob from 'glob';
import * as path from 'path';

export class Scanner {
  constructor(private readonly rootDir: string) {}
  public async scan(): Promise<{
    absolute: string[];
    relative: string[];
  }> {
    return await new Promise((resolve, reject) =>
      glob(this.rootDir + '**/*.feature', { follow: true }, (err, matches) => {
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
