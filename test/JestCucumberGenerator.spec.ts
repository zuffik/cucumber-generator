import { TemplateGenerator } from '../src';
import * as tmp from 'tmp';
import rimraf from 'rimraf';
import * as path from 'path';
import ncp from 'ncp';
import { TemplateFeatureProcessor } from '../src/generators/TemplateFeatureProcessor';

describe('JestCucumberGenerator integration', () => {
  let featuresDirectory: string;
  let outputDirectory: string;
  const relativePathToFeatures = '../features';

  beforeEach(() => {
    featuresDirectory = tmp.dirSync().name;
    outputDirectory = tmp.dirSync().name;
    return new Promise((resolve, reject) =>
      ncp(path.join(__dirname, '..', 'src', 'fixtures'), featuresDirectory, (err) =>
        err ? reject(err) : resolve()
      )
    );
  });

  it('should generate simple feature', async () => {
    await new Promise((resolve, reject) =>
      rimraf(path.join(featuresDirectory, 'auth'), (err) => (err ? reject(err) : resolve()))
    );
    const generator = new TemplateGenerator('jest-cucumber', {
      variables: {
        relativePathToFeatures,
      },
      featuresDirectory,
      outputDirectory,
    });
    const result = await generator.generate();
    expect(result['Simple.feature']).toBeDefined();
    expect(result['Simple.feature']).toEqual(
      await TemplateFeatureProcessor.processFeature(
        {
          label: 'Simple feature name',
          scenarios: [
            {
              label: '1st scenario name',
              stops: [
                { stop: 'given', label: '1st Given stop' },
                { stop: 'given', label: '2nd Given stop' },
                { stop: 'when', label: 'Condition stop' },
                { stop: 'and', label: 'Conjuncture stop' },
                { stop: 'then', label: 'Result stop' },
              ],
            },
            {
              label: '2nd scenario name',
              stops: [
                { stop: 'given', label: 'Given stop' },
                { stop: 'when', label: 'Action stop' },
                { stop: 'then', label: 'Final stop' },
              ],
            },
          ],
        },
        {
          variables: {
            relativePathToFeatures,
          },
          featureFile: 'Simple.feature',
          outputDirectory,
          maintainStructure: false,
          templateDirectory: process.cwd(),
        }
      )
    );
  });

  afterEach(() =>
    Promise.all(
      [featuresDirectory, outputDirectory].map(
        (dir) =>
          new Promise((resolve, reject) => rimraf(dir, (err) => (err ? reject(err) : resolve())))
      )
    )
  );
});
