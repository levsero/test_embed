// This script verifies that the dependencies present in manifest.json
// match the versions in the projects package.json.

const semver = require('semver');
const chalk = require('chalk');
const manifest = require('../manifest.json');
const packageJson = require('../package.json');

const writeLog = (msg) => console.log(chalk.green(msg));
const writeError = (msg) => console.error(chalk.red(msg));

const getVersion = (versionStr) => {
  if (versionStr && versionStr.includes('git+ssh')) {
    return versionStr.split('#')[1];
  }

  return versionStr;
};

const flattenArray = (array) => {
  return [].concat.apply([], array);
};

const validateDependencies = () => {
  const deps = flattenArray(manifest.assets.map((asset) => asset.externals));
  const packageDeps = packageJson.dependencies;

  deps.forEach((dep) => {
    const depName = dep.name;
    const packageVersion = getVersion(packageDeps[depName]);

    if (!dep.ignoreValidation) {
      if (!packageVersion) {
        writeError(`${depName} not present in package dependencies`);
        process.exit(1);
      }

      if (semver.satisfies(dep.version, packageVersion)) {
        writeLog(`${depName}:${dep.version} is valid for package version ${packageVersion}`);
      } else {
        writeError(`${depName}:${dep.version} is invalid for package version ${packageVersion}`);
        process.exit(1);
      }
    }
  });

  writeLog('\nAll manifest.json dependencies are valid');
};

validateDependencies();
