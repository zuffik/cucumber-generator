module.exports = {
  roots: [
    '<rootDir>/src',
    '<rootDir>/test'
  ],
  transform: {
    '^.+\\.ts$': 'babel-jest',
  },
  testRegex: '\\.(test|spec)\\.ts$',
  moduleFileExtensions: [
    'js',
    'ts'
  ],
  preset: 'ts-jest'
};
