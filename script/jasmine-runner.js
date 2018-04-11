const Jasmine = require('jasmine');
const SpecReporter = require('jasmine-spec-reporter');

const jRunner = new Jasmine();
const env = process.env.NODE_ENV;

// NODE_ENV value set by test:ci npm task for use on Travis - matches Travis defaults:
// https://docs.travis-ci.com/user/environment-variables/#Default-Environment-Variables
if (env !== 'test') {
  jRunner.configureDefaultReporter({ print: () => {} });
  jRunner.addReporter(new SpecReporter());
}
jRunner.loadConfigFile('test/jasmine.json');
jRunner.execute();
