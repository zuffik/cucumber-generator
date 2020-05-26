import { Args } from './Args';
import { FileWriter, StdioWriter, TemplateGenerator, Writer } from '..';
import { Scanner } from '../files/Scanner';
import chalk from 'chalk';
import * as path from 'path';

export const runner = async (args: Args) => {
  const featuresDirectory = path.isAbsolute(args.featuresDirectory)
    ? args.featuresDirectory
    : path.join(process.cwd(), args.featuresDirectory);
  const outputDirectory =
    !args.outputDirectory || path.isAbsolute(args.outputDirectory)
      ? args.outputDirectory
      : path.join(process.cwd(), args.outputDirectory);
  const scanner = new Scanner(featuresDirectory);
  const generator = new TemplateGenerator(args.template, {
    featuresDirectory,
    templateDirectory: args.templatesDirectory || path.join(__dirname, '..', '..', 'templates'),
    variables: {
      relativePathToFeatures: args.relativePathToFeatures,
    },
    scanner,
  });

  const files = await scanner.scanForFeatures();
  console.log(chalk.bold('\nFound files:'));
  for (let file of files.relative) {
    console.log(chalk.gray(file));
  }

  const result = await generator.generate();
  const writer: Writer =
    args.output == 'file'
      ? new FileWriter(args.maintainStructure, outputDirectory, args.includeDirectory)
      : new StdioWriter();
  const processed: string[] = (
    await Promise.all(
      Object.keys(result).map(async (file) => {
        const content = result[file];
        return [file, await writer.write(file, content)];
      })
    )
  )
    .filter(([f, s]) => s)
    .map(([f]) => f) as string[];

  console.log(chalk.bold.green(`\nGenerated ${processed.length} files:`));
  for (let file of processed) {
    console.log(
      chalk.green(path.join(args.outputDirectory || '', file.replace(/\.features?$/, '.spec.ts')))
    );
  }
  console.log();
};
