import { Writer } from './Writer';
import * as path from 'path';
import { existsSync, mkdir, writeFile } from 'fs';

export class FileWriter implements Writer {
  constructor(
    private readonly maintainStructure: boolean,
    private readonly outputDirectory: string
  ) {}

  public async write(file: string, content: string): Promise<boolean> {
    const featureFile = file.replace(/\.feature$/, '.spec.ts');
    const outFile = path.join(this.outputDirectory, featureFile);
    if (existsSync(outFile)) {
      return false;
    }
    const directory = outFile.substr(0, outFile.lastIndexOf(path.sep));
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
