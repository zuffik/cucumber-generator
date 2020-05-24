import { Writer } from './Writer';
import chalk from 'chalk';

export class StdioWriter implements Writer {
  public async write(file: string, content: string): Promise<boolean> {
    process.stdout.write(`\n${chalk.bold.underline.blue(file)}\n`);
    process.stdout.write(`\n${content}\n`);
    return true;
  }
}
