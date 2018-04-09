const Jasmine = require('jasmine');
const SpecReporter = require('jasmine-spec-reporter');

const jRunner = new Jasmine();
const env = process.env.NODE_ENV;

if (env !== 'test') {
  jRunner.configureDefaultReporter({ print: () => {} });
  jRunner.addReporter(new SpecReporter());
}
jRunner.loadConfigFile('test/jasmine.json');
jRunner.execute();
