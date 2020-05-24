import yargs from 'yargs';

export interface Args {
  outputDirectory: string;
  featuresDirectory: string;
  relativePathToFeatures: string;
}

export const args: Args = yargs
  .completion()
  .alias('h', 'help')
  .help('h')
  .showHelpOnFail(true)
  .alias('o', 'outputDirectory')
  .string('outputDirectory')
  .alias('f', 'featuresDirectory')
  .string('featuresDirectory')
  .string('relativePathToFeatures')
  .default('relativePathToFeatures', './')
  .demandOption('outputDirectory')
  .demandOption('featuresDirectory').argv as Args;
