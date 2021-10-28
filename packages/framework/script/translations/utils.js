/* eslint-disable no-console */

const path = require('path')
const util = require('util')
const exec = util.promisify(require('child_process').exec)

const repoRoot = (...args) => path.resolve(__dirname, '../../../../', ...args)
const frameworkRoot = (...args) => repoRoot('./packages/framework', ...args)

const printHeading = (heading) => console.log(`\n*** ${heading} ***`)

const localesFile = frameworkRoot('./src/translation/locales.json')
const downloadLocales = async ({ destination, packageName }) => {
  try {
    const { stdout, stderr } = await exec(
      `yarn download-locales --destination='${destination}' --packages='${packageName}' --locales='${localesFile}'`
    )

    console.log(stdout)
    console.error(stderr)
  } catch (err) {
    console.error(err)

    throw new Error(`Failed downloading ${packageName} to ${destination}`)
  }
}

const generateZeCountriesFile = async () => {
  try {
    const { stdout, stderr } = await exec(
      `bundle exec ruby ${path.resolve(__dirname, './fetch_countries.rb')}`
    )

    console.log(stdout)
    console.error(stderr)
  } catch (err) {
    console.error(err)

    throw new Error(`Failed generating ze_countries.js`)
  }
}

module.exports = {
  printHeading,
  repoRoot,
  frameworkRoot,
  downloadLocales,
  generateZeCountriesFile,
}
