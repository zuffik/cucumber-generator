import { TemplateGenerator } from '../src';
import * as tmp from 'tmp';
import rimraf from 'rimraf';
import * as path from 'path';
import ncp from 'ncp';
import { TemplateFeatureProcessor } from '../src/generators/TemplateFeatureProcessor';
import { Feature } from '../src/files/Types';

describe('JestCucumberGenerator integration', () => {
  let featuresDirectory: string;
  let outputDirectory: string;
  const relativePathToFeatures = '../features';
  const templateDirectory = path.join(__dirname, '..', 'templates');

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
    await new Promise((resolve, reject) =>
      rimraf(path.join(featuresDirectory, 'external'), (err) => (err ? reject(err) : resolve()))
    );
    const spy = jest.spyOn(TemplateFeatureProcessor, 'processFeature');
    const generator = new TemplateGenerator('jest-cucumber', {
      variables: {
        relativePathToFeatures,
      },
      featuresDirectory,
      templateDirectory,
    });
    const feature: Feature = {
      label: 'Simple feature name',
      scenarios: [
        {
          label: '1st scenario name',
          stops: [
            { stop: 'given', label: '1st Given stop', parameters: [] },
            { stop: 'given', label: '2nd Given stop', parameters: [] },
            { stop: 'when', label: 'Condition stop', parameters: [] },
            { stop: 'and', label: 'Conjuncture stop', parameters: [] },
            { stop: 'then', label: 'Result stop', parameters: [] },
          ],
        },
        {
          label: '2nd scenario name',
          stops: [
            { stop: 'given', label: 'Given stop', parameters: [] },
            { stop: 'when', label: 'Action stop', parameters: [] },
            { stop: 'then', label: 'Final stop', parameters: [] },
          ],
        },
      ],
    };
    const result = await generator.generate();
    expect(spy).toBeCalledWith(feature, expect.anything());
    expect(result['Simple.feature']).toBeDefined();
    expect(result['Simple.feature']).toEqual(
      await TemplateFeatureProcessor.processFeature(feature, {
        variables: {
          relativePathToFeatures,
        },
        featureFile: 'Simple.feature',
        templateDirectory,
      })
    );
  });

  it('should generate login feature', async () => {
    const spy = jest.spyOn(TemplateFeatureProcessor, 'processFeature');
    const generator = new TemplateGenerator('jest-cucumber', {
      variables: {
        relativePathToFeatures,
      },
      featuresDirectory: path.join(featuresDirectory, 'auth'),
      templateDirectory,
    });
    const feature: Feature = {
      label: 'Login user',
      scenarios: [
        {
          label: 'Successful login',
          stops: [
            { stop: 'when', label: 'inputting credentials', parameters: ['data'] },
            { stop: 'and', label: 'trying to login', parameters: [] },
            { stop: 'then', label: 'it should be successful', parameters: [] },
          ],
        },
        {
          label: 'Unsuccessful login',
          stops: [
            { stop: 'when', label: 'inputting credentials', parameters: ['data'] },
            { stop: 'and', label: 'trying to login', parameters: [] },
            { stop: 'then', label: `it shouldn't be successful`, parameters: [] },
          ],
        },
      ],
    };
    const result = await generator.generate();
    expect(spy).toBeCalledWith(feature, expect.anything());
    expect(result['Login.feature']).toBeDefined();
    expect(result['Login.feature']).toEqual(
      await TemplateFeatureProcessor.processFeature(feature, {
        variables: {
          relativePathToFeatures,
        },
        featureFile: 'Login.feature',
        templateDirectory,
      })
    );
  });

  afterEach(() => {
    jest.clearAllMocks();
    return Promise.all(
      [featuresDirectory, outputDirectory].map(
        (dir) =>
          new Promise((resolve, reject) => rimraf(dir, (err) => (err ? reject(err) : resolve())))
      )
    );
  });
});
