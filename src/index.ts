import { runner } from './cli/Runner';

export * from './generators/Generator';
export * from './generators/TemplateGenerator';
export * from './writers/FileWriter';
export * from './writers/StdioWriter';
export * from './writers/Writer';

if (require.main === module) {
  runner(require('./cli/Args').args).catch((e) => console.error(e));
}
