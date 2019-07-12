/* eslint no-console: 0 */
const rest = require('rest')
const fs = require('fs')
const localeListPath = __dirname + '/../src/translation/locales.json'

const generateLocaleList = locales => {
  return locales.map(locale => locale.locale)
}

const writeJson = localeList => {
  const contents = JSON.stringify(localeList, null, 2)

  fs.writeFile(localeListPath, contents, { flag: 'w' }, err => {
    if (err) throw err
    console.log(`\nlocale list written to ${localeListPath}`)
  })
}

rest('https://support.zendesk.com/api/v2/locales/apps/web_widget.json')
  .then(function(res) {
    console.log('\nCreating locales list')
    const localeList = generateLocaleList(JSON.parse(res.entity).locales)

    writeJson(localeList)
  })
  .catch(err => {
    console.error('\nFailed to retrieve locales list:', err)
    throw err
  })
