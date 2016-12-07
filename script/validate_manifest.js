// This script verifies that the dependencies present in manifest.json
// match the versions in the projects package.json.

const _ = require('lodash');
const semver = require('semver');
const chalk = require('chalk');
const manifest = require('../manifest.json');
const packageJson = require('../package.json');

const validateDependencies = () => {
  const deps = _.reject(manifest.dependencies, (dep) => dep.internal);
  const packageDeps = packageJson.dependencies;

  _.each(deps, (dep) => {
    const version = packageDeps[dep.name];

    if (!version) {
      console.error(chalk.red(`${dep.name} not present in package dependencies`));
      process.exit(1);
      return;
    }

    if (semver.satisfies(dep.version, version)) {
      console.log(chalk.green(`${dep.name}:${dep.version} is valid for package version ${version}`));
    } else {
      console.error(chalk.red(`${dep.name}:${dep.version} is invalid for package version ${version}`));
      process.exit(1);
    }
  });

  console.log(chalk.green('\nAll manifest.json dependencies are valid'));
};

validateDependencies();
