/* eslint-disable no-console */

const fs = require('fs')
const { downloadLocales, frameworkRoot, printHeading, generateZeCountriesFile } = require('./utils')
const downloadCountryInfo = require('./downloadCountryInfo')

const run = async () => {
  try {
    printHeading('Updating translations')

    printHeading('Cleaning translation folder')
    fs.rmdirSync(frameworkRoot('./src/translation'), {
      recursive: true,
    })
    fs.mkdirSync(frameworkRoot('./src/translation'))

    printHeading('Downloading country information')
    await downloadCountryInfo()

    printHeading('Generating ze_countries.js file')
    await generateZeCountriesFile()

    printHeading('Downloading translations')
    await Promise.all([
      downloadLocales({
        packageName: 'web_widget_classic',
        destination: frameworkRoot('./src/translation/classic'),
      }),
      downloadLocales({
        packageName: 'web_widget_messenger',
        destination: frameworkRoot('./src/translation/messenger'),
      }),
    ])

    printHeading('Finished updating translations')
  } catch (err) {
    console.error('Failed updating translations')
    console.error(err)
  }
}

run()
