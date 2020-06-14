import { Parser } from './src/files/Parser';
import { Scanner } from './src/files/Scanner';
import { ScanResult } from './src/files/Scanner';

declare module 'cucumber-generator' {
  export type Options = {
    featuresDirectory: string;
    scanner?: Scanner;
    parser?: Parser;
  }

  export abstract class Generator {
    protected readonly parser: Parser;
    protected readonly scanner: Scanner;

    public readonly featuresDirectory: string;

    protected constructor(options: Options);

    public abstract generate(): Promise<Record<string, string>>;
  }

  export type TemplateOptions = Options & {
    variables: {
      relativePathToFeatures: string,
      [K: string]: any
    }
  };

  export class TemplateGenerator extends Generator {
    private readonly variables: Record<string, any>;
    private readonly template: string;
    private readonly templateFile: string;

    constructor(
      template: 'jest-cucumber' | 'cypress-cucumber-preprocessor' | 'cucumber' | string,
      options: Options
    );

    public excludeExistingFiles(scanResult: ScanResult): ScanResult;

    public generate(): Promise<Record<string, string>>;
  }

  export interface Stop {
    label: string;
    stop: 'given' | 'and' | 'then' | 'when';
  }

  export interface Scenario {
    label: string;
    examples: Record<string, (string | number)[]>;
    stops: Stop[];
  }

  export interface Feature {
    label: string;
    scenarios: Scenario[];
  }

  export interface Writer {
    write(featureFile: string, content: string): Promise<boolean>;
  }

  export class FileWriter implements Writer {
    constructor(
      private readonly maintainStructure: boolean,
      private readonly outputDirectory: string,
      private readonly includeDirectory: boolean = false
    );
  }

  export class StdioWriter implements Writer {
  }
}
