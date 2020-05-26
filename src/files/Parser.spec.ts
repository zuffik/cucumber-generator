import * as path from 'path';
import { Parser } from './Parser';
import { messages } from 'cucumber-messages';

const GherkinDocument = messages.GherkinDocument;

describe('Parser', () => {
  const root = path.join(__dirname, '..', 'fixtures');
  let parser: Parser;
  beforeEach(() => (parser = new Parser(root)));

  it('should parse features', async () => {
    const features = ['Simple', 'auth/Login'];
    await Promise.all(
      features.map(async (feature) => {
        const doc = await parser.parse(feature + '.feature');
        expect(doc).toEqual(expect.arrayContaining([expect.any(GherkinDocument)]));
      })
    );
  });

  it('should get features from simple parse result', async () => {
    const doc = await parser.parse('Simple.feature');
    const feature = Parser.toFeatures(doc);
    expect(feature).toEqual(
      expect.arrayContaining([
        {
          label: 'Simple feature name',
          scenarios: [
            {
              examples: {},
              label: '1st scenario name',
              stops: expect.arrayContaining([
                { stop: 'given', label: '1st Given stop', parameters: [] },
                { stop: 'given', label: '2nd Given stop', parameters: [] },
                { stop: 'when', label: 'Condition stop', parameters: [] },
                { stop: 'and', label: 'Conjuncture stop', parameters: [] },
                { stop: 'then', label: 'Result stop', parameters: [] },
              ]),
            },
            {
              examples: {},
              label: '2nd scenario name',
              stops: expect.arrayContaining([
                { stop: 'given', label: 'Given stop', parameters: [] },
                { stop: 'when', label: 'Action stop', parameters: [] },
                { stop: 'then', label: 'Final stop', parameters: [] },
              ]),
            },
          ],
        },
      ])
    );
  });

  it('should get features from login parse result', async () => {
    const doc = await parser.parse('auth/Login.feature');
    const feature = Parser.toFeatures(doc);
    expect(feature).toEqual(
      expect.arrayContaining([
        {
          label: 'Login user',
          scenarios: [
            {
              label: 'Successful login',
              examples: {
                username: ['demo-1', 'demo-2'],
                password: ['{env.APP_DEMO_USER_PASS}', '{env.APP_DEMO_USER_PASS}'],
              },
              stops: [
                { stop: 'when', label: 'inputting <username>', parameters: ['username'] },
                { stop: 'and', label: 'inputting <password>', parameters: ['password'] },
                { stop: 'and', label: 'trying to login', parameters: [] },
                { stop: 'then', label: 'it should be successful', parameters: [] },
              ],
            },
            {
              label: 'Unsuccessful login',
              examples: {},
              stops: [
                { stop: 'when', label: 'inputting credentials', parameters: ['data'] },
                { stop: 'and', label: 'trying to login', parameters: [] },
                { stop: 'then', label: `it shouldn't be successful`, parameters: [] },
              ],
            },
          ],
        },
      ])
    );
  });
});
