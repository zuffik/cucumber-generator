import { Generator, Options as BaseOptions } from './Generator';
import { Parser } from '../files/Parser';
import { TemplateFeatureProcessor } from './TemplateFeatureProcessor';
import { ScanResult } from '../files/Scanner';
import * as fs from 'fs';

type Options = BaseOptions & {
  variables: {
    relativePathToFeatures: string;
    [K: string]: any;
  };
  templateDirectory?: string;
};

export class TemplateGenerator extends Generator {
  private readonly variables: Record<string, any>;
  private readonly templateDirectory: string;

  constructor(template: string, options: Options) {
    const { variables, templateDirectory, ...base } = options;
    super(base);
    this.variables = variables;
    this.templateDirectory = templateDirectory || process.cwd();
  }

  public excludeExistingFiles(scanResult: ScanResult): ScanResult {
    return {
      absolute: scanResult.absolute.filter(
        (file) =>
          !fs.existsSync(
            TemplateFeatureProcessor.getOutputFile(
              file.replace(this.scanner.rootDir, '').slice(1),
              this.outputDirectory,
              !!this.maintainStructure
            )
          )
      ),
      relative: scanResult.relative.filter(
        (file) =>
          !fs.existsSync(
            TemplateFeatureProcessor.getOutputFile(
              file,
              this.outputDirectory,
              !!this.maintainStructure
            )
          )
      ),
    };
  }

  public async generate(verbose: boolean = false): Promise<Record<string, string>> {
    const result: Record<string, string> = {};
    const featureFiles = this.excludeExistingFiles(await this.scanner.scan());
    for (let f of featureFiles.relative) {
      const doc = await this.parser.parse(f);
      const features = Parser.toFeatures(doc);
      for (let feature of features) {
        result[f] = await TemplateFeatureProcessor.processFeature(feature, {
          variables: this.variables,
          templateDirectory: this.templateDirectory,
          maintainStructure: !!this.maintainStructure,
          outputDirectory: this.outputDirectory,
          featureFile: f,
          verbose,
        });
      }
    }
    return result;
  }
}
