module.exports = {
  clearMocks: true,
  collectCoverage: true,

  coverageReporters: ['lcov'],

  modulePathIgnorePatterns: ['<rootDir>/e2e/'],

  restoreMocks: true,

  setupFiles: ['jest-prop-type-error'],

  testURL: 'http://localhost',
}
