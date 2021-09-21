// For a detailed explanation regarding each configuration property, visit:
// https://jestjs.io/docs/en/configuration.html
const base = require('../../jest.config.base')
const path = require('path')

module.exports = {
  ...base,

  collectCoverageFrom: ['**/*.js', '!**/node_modules/**'],

  coverageDirectory: 'coverage',

  testEnvironment: 'jsdom',

  displayName: { name: require('./package.json').name, color: 'magenta' },

  setupFilesAfterEnv: ['./jest.setup.js'],

  transform: {
    '^.+\\.js$': ['babel-jest', { configFile: path.resolve(__dirname, '.babelrc.js') }],
    '^.+\\.svg$': '<rootDir>/src/utils/test/mocks/svgrMock.js',
  },

  transformIgnorePatterns: ['node_modules/(?!(@zendeskgarden)/)'],
  testPathIgnorePatterns: ['/node_modules/', '/dist/'],
}
