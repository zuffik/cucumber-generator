import { Feature, Stop } from '../files/Types';
import * as path from 'path';
import * as ejs from 'ejs';
import * as fs from 'fs';
import { flatten } from 'array-flatten';

interface Options {
  variables: Record<string, any>;
  templateDirectory: string;
  featureFile: string;
  template: string;
}

export class TemplateFeatureProcessor {
  public static async processFeature(
    feature: Feature,
    { variables: vars, featureFile: f, templateDirectory, template }: Options
  ): Promise<string> {
    const stopKeys: string[] = flatten(feature.scenarios)[0].stops.map((s: Stop) => s.stop);
    const variables = {
      ...vars,
      featureFilePath: `${vars.relativePathToFeatures}/${f}`,
      stops: stopKeys.filter((s, i) => stopKeys.indexOf(s) === i),
      feature,
      capitalize: this.capitalize,
    };
    return ejs.render(
      fs.readFileSync(path.join(templateDirectory, template + '.ejs')).toString(),
      variables
    );
  }

  private static capitalize(value: string) {
    return value.charAt(0).toUpperCase() + value.slice(1);
  }
}
