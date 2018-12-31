require('@babel/register')({
  plugins: ['dynamic-import-node']
});

// NODE_ENV value set by test:ci npm task for use on Travis - matches Travis defaults:
// https://docs.travis-ci.com/user/environment-variables/#Default-Environment-Variables
const env = process.env.NODE_ENV;
const Jasmine = require('jasmine');
const SpecReporter = require('jasmine-spec-reporter').SpecReporter;
const jRunner = new Jasmine();
const reporterConfig = {
  spec: {
    displaySuccessful: (env === 'test' ? false : true),
    displayStacktrace: true
  }
};

jRunner.configureDefaultReporter({ print: () => {} });
jRunner.addReporter(new SpecReporter(reporterConfig));
jRunner.loadConfigFile('test/jasmine.json');
// Support running of specific tests:
// https://jasmine.github.io/2.3/node.html#section-24
jRunner.execute(process.argv.slice(2));
