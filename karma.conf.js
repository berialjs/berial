/* eslint-disable */
process.env.CHROME_BIN = require('puppeteer').executablePath()

module.exports = function (config) {
  config.set({
    singleRun: true,
    browsers: ['ChromeHeadless'],
    frameworks: ['mocha', 'karma-typescript'],
    files: ['src/**/*.ts', 'test/unit/**/*.ts'],
    preprocessors: {
      'src/**/*.ts': 'karma-typescript',
      'test/**/*.ts': 'karma-typescript'
    },
    reporters: ['spec', 'karma-typescript'],
    karmaTypescriptConfig: {
      compilerOptions: {
        module: 'commonjs'
      },
      reports: {
        text: '',
        html: {
          directory: 'coverage',
          subdirectory: 'html'
        },
        lcovonly: {
          directory: 'coverage',
          subdirectory: 'lcov'
        }
      },
      tsconfig: './tsconfig.test.json'
    }
  })
}
