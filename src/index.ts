import { runner } from './cli/Runner';

export * from './generators/Generator';
export * from './generators/TemplateGenerator';

if (require.main === module) {
  runner(require('./cli/Args').args).catch((e) => console.error(e));
}
