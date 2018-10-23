require('babel-register')({
  plugins: ['dynamic-import-node']
});

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
// Support running of specific tests:
// https://jasmine.github.io/2.3/node.html#section-24
jRunner.execute(process.argv.slice(2));
