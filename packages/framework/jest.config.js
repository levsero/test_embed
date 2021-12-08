// For a detailed explanation regarding each configuration property, visit:
// https://jestjs.io/docs/en/configuration.html

const path = require('path')
const base = require('../../jest.config.base')

module.exports = {
  ...base,

  displayName: { name: require('./package.json').name, color: 'cyan' },

  testEnvironment: 'jsdom',

  // An array of glob patterns indicating a set of files for which coverage information should be collected
  collectCoverageFrom: ['**/*.js', '!**/node_modules/**', '!**/dist/**'],

  // An array of regexp pattern strings used to skip coverage collection
  coveragePathIgnorePatterns: [
    'node_modules/(?!(@zendeskgarden/svg-icons)/)',
    'ze_countries.js',
    'ze_localeIdMap.js',
  ],

  globals: {
    __EMBEDDABLE_VERSION__: 1,
    __EMBEDDABLE_FRAMEWORK_ENV__: 'test',
    __DEV__: false,
    __ASSET_BASE_PATH__: 'https://static-staging.zdassets.com',
  },

  // A map from regular expressions to module names that allow to stub out resources with a single module
  moduleNameMapper: {
    '\\.(jpg|jpeg|png|gif|webp)$': '<rootDir>/src/__mocks__/fileMock.js',
    '^src/(.*)': '<rootDir>/src/$1',
    '@zendesk/web-widget-messenger': '<rootDir>/src/__mocks__/messengerMock.js',
    '^@zendesk/widget-shared-services/(.*)': '<rootDir>/../shared-services/dist/$1',
    '@zendesk/web-widget-classic': '<rootDir>/src/__mocks__/classicMock.js',
  },

  // The path to a module that runs some code to configure or set up the testing framework before each test
  setupFilesAfterEnv: ['./jest.setup.js'],

  // A map from regular expressions to paths to transformers
  transform: {
    '^.+\\.js$': ['babel-jest', { configFile: path.resolve(__dirname, '.babelrc.json') }],
  },

  // An array of regexp pattern strings that are matched against all source file paths, matched files will skip transformation
  transformIgnorePatterns: [
    'node_modules/(?!(@zendeskgarden/svg-icons|@zendesk/sunco-js-client)/)',
    'ze_countries.js',
    'ze_localeIdMap.js',
  ],

  snapshotSerializers: [require.resolve('snapshot-diff/serializer.js')],
}
