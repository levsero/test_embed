// This script verifies that the dependencies present in manifest.json
// match the versions in the projects package.json.

const _ = require('lodash');
const semver = require('semver');
const chalk = require('chalk');
const manifest = require('../manifest.json');
const packageJson = require('../package.json');

const writeLog = (msg) => console.log(chalk.green(msg));
const writeError = (msg) => console.error(chalk.red(msg));

const validateDependencies = () => {
  const deps = _.reject(manifest.dependencies, (dep) => dep.internal);
  const packageDeps = packageJson.dependencies;

  _.each(deps, (dep) => {
    const version = packageDeps[dep.name];

    if (!version) {
      writeError(`${dep.name} not present in package dependencies`);
      process.exit(1);
    }

    if (semver.satisfies(dep.version, version)) {
      writeLog(`${dep.name}:${dep.version} is valid for package version ${version}`);
    } else {
      writeError(`${dep.name}:${dep.version} is invalid for package version ${version}`);
      process.exit(1);
    }
  });

  writeLog('\nAll manifest.json dependencies are valid');
};

validateDependencies();
