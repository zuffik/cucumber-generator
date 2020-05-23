import { Feature, Stop } from '../files/Types';
import * as path from 'path';
import * as fs from 'fs';
import { runner } from 'hygen';
import Logger from 'hygen/dist/logger';

interface Options {
  outputDirectory: string;
  maintainStructure: boolean;
  variables: Record<string, any>;
  templateDirectory: string;
  featureFile: string;
}

export class TemplateFeatureProcessor {
  public static async processFeature(
    feature: Feature,
    {
      outputDirectory,
      maintainStructure,
      variables: vars,
      templateDirectory,
      featureFile: f,
    }: Options
  ): Promise<string> {
    const stopKeys: string[] = (feature.scenarios as any).flat()[0].stops.map((s: Stop) => s.stop);
    const outputFilePath = path
      .join(outputDirectory, !maintainStructure ? f.substr(f.lastIndexOf(path.sep)) : f)
      .replace('.feature', '.spec.ts');
    const variables = {
      ...vars,
      outputFilePath,
      featureFilePath: `${vars.relativePathToFeatures}/${f}`,
      stops: stopKeys.filter((s, i) => stopKeys.indexOf(s) === i),
      feature,
    };
    const parameters = (Object.keys(variables).map((k) => [
      `--${k}`,
      JSON.stringify(variables[k as keyof typeof variables]),
    ]) as any).flat();
    await runner(['main', 'new', 'jest-cucumber', ...parameters], {
      cwd: templateDirectory,
      logger: new Logger(console.log.bind(console)),
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
