import { Parser } from '../files/Parser';
import { Scanner } from '../files/Scanner';
import * as tmp from 'tmp';

export type Options = {
  featuresDirectory: string;
  scanner?: Scanner;
  parser?: Parser;
};

export abstract class Generator {
  protected readonly parser: Parser;
  protected readonly scanner: Scanner;

  public readonly featuresDirectory: string;

  protected constructor(options: Options) {
    this.parser = options.parser || new Parser(options.featuresDirectory);
    this.scanner = options.scanner || new Scanner(options.featuresDirectory);

    this.featuresDirectory = options.featuresDirectory;
  }

  public abstract generate(): Promise<Record<string, string>>;
}
