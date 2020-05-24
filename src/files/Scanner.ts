import glob from 'glob';

export class Scanner {
  constructor(private readonly rootDir: string) {}

  public async scan(): Promise<{
    absolute: string[];
    relative: string[];
  }> {
    const root = this.rootDir.endsWith('/')
      ? this.rootDir.slice(0, this.rootDir.length - 1)
      : this.rootDir;
    return await new Promise((resolve, reject) =>
      glob(this.rootDir + '/**/*.feature', { follow: true }, (err, matches) => {
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
