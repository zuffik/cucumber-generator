import { Args } from './Args';
import { TemplateGenerator } from '..';

export const runner = async (args: Args) => {
  const generator = new TemplateGenerator('jest-cucumber', {
    outputDirectory: args.outputDirectory,
    featuresDirectory: args.featuresDirectory,
    variables: {
      relativePathToFeatures: args.relativePathToFeatures,
    },
  });
  await generator.generate();
};
