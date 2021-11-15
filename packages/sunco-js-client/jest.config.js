// For a detailed explanation regarding each configuration property, visit:
// https://jestjs.io/docs/en/configuration.html

const path = require('path')
const base = require('../../jest.config.base')

module.exports = {
  ...base,

  displayName: { name: require('./package.json').name, color: 'blue' },

  // An array of glob patterns indicating a set of files for which coverage information should be collected
  collectCoverageFrom: ['**/*.js', '!**/node_modules/**', '!**/dist/**'],

  // A map from regular expressions to module names that allow to stub out resources with a single module
  moduleNameMapper: {
    '^src/(.*)': '<rootDir>/src/$1',
  },

  // The path to a module that runs some code to configure or set up the testing framework before each test
  setupFilesAfterEnv: ['./jest.setup.js'],

  // A map from regular expressions to paths to transformers
  transform: {
    '^.+\\.js$': ['babel-jest', { configFile: path.resolve(__dirname, '.babelrc.js') }],
  },
}
