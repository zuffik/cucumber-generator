import { Parser } from '../files/Parser';
import { Scanner } from '../files/Scanner';
import * as tmp from 'tmp';

interface FileOutputOptions {
  outputDirectory: string;
  maintainStructure?: boolean;
}

interface ConsoleOutputOptions {}

export type Options = {
  featuresDirectory: string;
} & (FileOutputOptions | ConsoleOutputOptions);

export abstract class Generator {
  protected readonly parser: Parser;
  protected readonly scanner: Scanner;

  public readonly featuresDirectory: string;
  public readonly outputDirectory: string;
  public readonly maintainStructure?: boolean;

  protected constructor(options: Options) {
    this.parser = new Parser(options.featuresDirectory);
    this.scanner = new Scanner(options.featuresDirectory);

    this.featuresDirectory = options.featuresDirectory;
    if (this.isFileOutput(options)) {
      this.outputDirectory = options.outputDirectory;
      this.maintainStructure =
        typeof options.maintainStructure == 'undefined' ? true : options.maintainStructure;
    } else {
      this.outputDirectory = tmp.dirSync().name;
    }
  }

  protected isFileOutput(options: Options | any): options is FileOutputOptions {
    return 'outputDirectory' in options;
  }

  public abstract generate(): Promise<Record<string, string>>;
}
