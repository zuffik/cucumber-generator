import { Args } from './Args';
import { TemplateGenerator } from '..';
import { Scanner } from '../files/Scanner';
import chalk from 'chalk';

export const runner = async (args: Args) => {
  const scanner = new Scanner(args.featuresDirectory);
  const generator = new TemplateGenerator('jest-cucumber', {
    outputDirectory: args.outputDirectory,
    featuresDirectory: args.featuresDirectory,
    variables: {
      relativePathToFeatures: args.relativePathToFeatures,
    },
    scanner,
  });

  const files = await scanner.scan();
  const excluded = generator.excludeExistingFiles(files);
  console.log(chalk.bold('\nFound files:'));
  for (let file of files.relative) {
    console.log(excluded.relative.includes(file) ? chalk.green(file) : chalk.gray(file));
  }

  await generator.generate(args.verbose);
  console.log(chalk.bold.green(`\nGenerated ${excluded.relative.length} files.\n`));
};
