// This file is autoloaded by jasmine
// because it has 'helper' in its name.

console.log('loading test_helper');

global.basePath = function(path) {
  return __dirname + '/../../' + path;
};

global.buildPath = function(path) {
  return basePath('build/unit/' + path);
};

global._ = require('lodash');
