module.exports = {
  roots: ['<rootDir>/test'],
  testRegex: 'test/(.+)\\.test\\.ts$',
  transform: {
    '^.+\\.tsx?$': 'ts-jest'
  },
  moduleFileExtensions: ['ts', 'js']
}
