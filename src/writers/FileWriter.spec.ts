import * as path from 'path';
import { FileWriter } from './FileWriter';

jest.mock('fs', () => ({
  __esModule: true,
  mkdir: jest.fn((p, { recursive }, callback) => {
    callback(null);
  }) as any,
  writeFile: jest.fn((p, data, callback) => {
    callback(null);
  }),
  existsSync: jest.fn(() => false),
}));

describe('FileWriter', () => {
  let fileWriter: FileWriter;
  const fileName = 'file.txt';
  const file = path.join(__dirname, fileName);

  beforeEach(() => (fileWriter = new FileWriter(true, __dirname)));

  it('should create file with content', async () => {
    const content = 'file';
    await fileWriter.write(fileName, content);
    const { mkdir, writeFile } = require('fs');
    expect(mkdir).toBeCalledWith(__dirname, expect.anything(), expect.anything());
    expect(writeFile).toBeCalledWith(file, content, expect.anything());
  });
});
