import { Feature, Stop } from '../files/Types';
import * as path from 'path';
import * as fs from 'fs';
import { runner } from 'hygen';
import Logger from 'hygen/dist/logger';
import { flatten } from 'array-flatten';

interface Options {
  outputDirectory: string;
  maintainStructure: boolean;
  variables: Record<string, any>;
  templateDirectory: string;
  featureFile: string;
  verbose: boolean;
}

export class TemplateFeatureProcessor {
  public static getOutputFile(
    file: string,
    outputDirectory: string,
    maintainStructure: boolean
  ): string {
    return path.join(
      outputDirectory,
      (!maintainStructure ? file.substr(file.lastIndexOf(path.sep)) : file).replace(
        '.feature',
        '.spec.ts'
      )
    );
  }

  public static async processFeature(
    feature: Feature,
    {
      outputDirectory,
      maintainStructure,
      variables: vars,
      templateDirectory,
      featureFile: f,
      verbose,
    }: Options
  ): Promise<string> {
    const stopKeys: string[] = flatten(feature.scenarios)[0].stops.map((s: Stop) => s.stop);
    const outputFilePath = this.getOutputFile(f, outputDirectory, maintainStructure);
    const variables = {
      ...vars,
      outputFilePath,
      featureFilePath: `${vars.relativePathToFeatures}/${f}`,
      stops: stopKeys.filter((s, i) => stopKeys.indexOf(s) === i),
      feature,
    };
    const parameters = flatten(
      Object.keys(variables).map((k) => [
        `--${k}`,
        JSON.stringify(variables[k as keyof typeof variables]),
      ])
    );
    await runner(['main', 'new', 'jest-cucumber', ...parameters], {
      cwd: templateDirectory,
      logger: new Logger(verbose ? console.log.bind(console) : () => {}),
      createPrompter: () => require('enquirer'),
      exec: (action, body) => {
        const opts = body && body.length > 0 ? { input: body } : {};
        return require('execa').shell(action, opts);
      },
      debug: !!process.env.DEBUG,
    });
    return fs.readFileSync(outputFilePath).toString();
  }
}
