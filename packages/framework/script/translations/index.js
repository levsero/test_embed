/* eslint-disable no-console */

const fs = require('fs')
const { downloadLocales, repoRoot, printHeading, generateZeCountriesFile } = require('./utils')
const downloadCountryInfo = require('./downloadCountryInfo')

const run = async () => {
  try {
    printHeading('Updating translations')

    printHeading('Cleaning translation folder')

    fs.rmdirSync(repoRoot('./packages/web-widget-messenger/messengerSrc/features/i18n/gen'), {
      recursive: true,
    })
    fs.rmdirSync(repoRoot('./packages/web-widget-classic/classicSrc/app/webWidget/services/gen'), {
      recursive: true,
    })

    fs.mkdirSync(repoRoot('./packages/web-widget-messenger/messengerSrc/features/i18n/gen'))
    fs.mkdirSync(repoRoot('./packages/web-widget-classic/classicSrc/app/webWidget/services/gen'))

    printHeading('Downloading country information')
    await downloadCountryInfo()

    printHeading('Generating ze_countries.js file')
    await generateZeCountriesFile()

    printHeading('Downloading translations')
    await Promise.all([
      downloadLocales({
        packageName: 'web_widget_classic',
        destination: repoRoot(
          './packages/web-widget-classic/classicSrc/app/webWidget/services/gen/translations'
        ),
      }),
      downloadLocales({
        packageName: 'web_widget_messenger',
        destination: repoRoot(
          './packages/web-widget-messenger/messengerSrc/features/i18n/gen/translations'
        ),
      }),
    ])

    printHeading('Finished updating translations')
  } catch (err) {
    console.error('Failed updating translations')
    console.error(err)
  }
}

run()
