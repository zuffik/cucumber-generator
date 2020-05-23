import { Parser } from './src/files/Parser';
import { Scanner } from './src/files/Scanner';

declare module 'cucumber-generator' {
  export interface FileOutputOptions {
    outputDirectory: string;
    maintainStructure?: boolean;
  }

  export interface ConsoleOutputOptions {
  }

  export type Options = {
    featuresDirectory: string;
  } & (FileOutputOptions | ConsoleOutputOptions)

  export abstract class Generator {
    protected readonly parser: Parser;
    protected readonly scanner: Scanner;

    public readonly featuresDirectory: string;
    public readonly outputDirectory?: string;
    public readonly maintainStructure?: boolean;

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
      template: 'jest-cucumber' | string,
      options: Options
    );

    public generate(): Promise<Record<string, string>>;
  }

  export interface Stop {
    label: string;
    stop: 'given' | 'and' | 'then' | 'when';
  }

  export interface Feature {
    label: string;
    stops: Stop[];
  }
}
