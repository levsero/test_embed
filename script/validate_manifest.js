// This script verifies that the dependencies present in manifest.json
// match the versions in the projects package.json.

const semver = require('semver');
const chalk = require('chalk');
const manifest = require('../manifest.json');
const packageJson = require('../package.json');

const writeLog = (msg) => console.log(chalk.green(msg));
const writeError = (msg) => console.error(chalk.red(msg));
const getVersion = (versionStr) => {
  if (versionStr.includes('git+ssh')) {
    return versionStr.split('#')[1];
  }

  return versionStr;
};

const validateDependencies = () => {
  const deps = manifest.externals;
  const packageDeps = packageJson.dependencies;

  deps.forEach((dep) => {
    const version = getVersion(packageDeps[dep.name]);

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
