import { runner } from './cli/Runner';
import { args } from './cli/Args';

export * from './generators/Generator';
export * from './generators/TemplateGenerator';

if (require.main === module) {
  runner(args).catch((e) => console.error(e));
}
