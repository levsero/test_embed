const Jasmine = require('jasmine');
const SpecReporter = require('jasmine-spec-reporter');

const jRunner = new Jasmine();

jRunner.configureDefaultReporter({ print: function(){} });
jasmine.getEnv().addReporter(new SpecReporter());
jRunner.loadConfigFile('test/jasmine.json');
jRunner.execute();
