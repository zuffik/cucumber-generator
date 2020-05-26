import { Writer } from './Writer';
import * as path from 'path';
import { existsSync, mkdir, writeFile } from 'fs';

export class FileWriter implements Writer {
  constructor(
    private readonly maintainStructure: boolean,
    private readonly outputDirectory: string,
    private readonly includeDirectory: boolean = false
  ) {}

  public async write(file: string, content: string): Promise<boolean> {
    const featureFile = file.replace(/\.features?$/, '.spec.ts');
    let outFile = path.join(this.outputDirectory, featureFile);
    if (existsSync(outFile)) {
      return false;
    }
    let directory = outFile.substr(0, outFile.lastIndexOf(path.sep));
    if (this.includeDirectory) {
      const fn = file.match(/(^|\/)([^\/]*)\.features?$/)?.[2]!;
      console.log(fn);
      directory = path.join(directory, fn);
      outFile = path.join(directory, outFile.slice(outFile.lastIndexOf(path.sep) + 1));
    }
    await new Promise((resolve, reject) => {
      if (!existsSync(directory)) {
        mkdir(directory, { recursive: true }, (err) => {
          if (err) {
            reject(err);
          } else {
            resolve();
          }
        });
      } else resolve();
    });
    await new Promise((resolve, reject) =>
      writeFile(outFile, content, (err) => {
        if (err) {
          reject(err);
        } else {
          resolve();
        }
      })
    );
    return true;
  }
}
