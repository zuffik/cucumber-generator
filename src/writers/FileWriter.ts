import { Writer } from './Writer';
import * as path from 'path';
import { mkdir, writeFile } from 'fs';

export class FileWriter implements Writer {
  private readonly directory: string;

  constructor(private readonly file: string) {
    this.directory = this.file.substr(0, this.file.lastIndexOf(path.sep));
  }

  public async write(content: string): Promise<void> {
    await new Promise((resolve, reject) =>
      mkdir(this.directory, { recursive: true }, (err) => {
        if (err) {
          reject(err);
        } else {
          resolve();
        }
      })
    );
    await new Promise((resolve, reject) =>
      writeFile(this.file, content, (err) => {
        if (err) {
          reject(err);
        } else {
          resolve();
        }
      })
    );
  }
}
