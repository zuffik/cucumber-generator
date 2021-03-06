import * as path from 'path';
import { Scanner } from './Scanner';

describe('Scanner', () => {
  const root = path.join(__dirname, '..');
  const fixtures = path.join(root, 'fixtures');

  it('should find features from src', async () => {
    const scanner = new Scanner(root);
    const scans = await scanner.scanForFeatures();
    expect(scans).toEqual({
      absolute: expect.arrayContaining([
        path.join(fixtures, 'auth/Login.feature'),
        path.join(fixtures, 'external/Addition.feature'),
        path.join(fixtures, 'Simple.feature'),
      ]),
      relative: expect.arrayContaining([
        path.join('fixtures', 'auth/Login.feature'),
        path.join('fixtures', 'external/Addition.feature'),
        path.join('fixtures', 'Simple.feature'),
      ]),
    });
  });

  it('should find features from src', async () => {
    const scanner = new Scanner(fixtures);
    const scans = await scanner.scanForFeatures();
    expect(scans).toEqual({
      absolute: expect.arrayContaining([
        path.join(fixtures, 'auth/Login.feature'),
        path.join(fixtures, 'external/Addition.feature'),
        path.join(fixtures, 'Simple.feature'),
      ]),
      relative: expect.arrayContaining([
        'auth/Login.feature',
        'external/Addition.feature',
        'Simple.feature',
      ]),
    });
  });
});
