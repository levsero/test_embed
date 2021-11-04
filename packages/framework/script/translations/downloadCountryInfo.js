/* eslint-disable no-console */

const rest = require('rest')
const fs = require('fs')
const { frameworkRoot } = require('./utils')

const localeIdMapPath = frameworkRoot('./src/translation/ze_localeIdMap.js')
const localesPath = frameworkRoot('./src/translation/locales.json')

let localesEndpoint = 'https://support.zendesk.com/api/v2/locales/apps/web_widget.json'
if (process.env.EMBEDDABLE_FRAMEWORK_ENV === 'staging') {
  localesEndpoint = localesEndpoint.replace('.zendesk.com', '.zendesk-staging.com')
}

const downloadCountryInformation = () => {
  return rest(localesEndpoint).then(function (res) {
    if (res.status.code !== 200) {
      throw new Error(`${localesEndpoint} did not respond with 200`)
    }
    const locales = JSON.parse(res.entity).locales.filter(
      (locale) => locale.name !== 'Deutsch (informell)'
    )

    console.log('Writing to ' + localeIdMapPath)

    const localeIdMap = locales.reduce((idMap, element) => {
      idMap[element.locale.toLowerCase()] = element.id
      return idMap
    }, {})

    const contents = 'module.exports = ' + JSON.stringify(localeIdMap, null, 2)

    fs.writeFileSync(localeIdMapPath, contents)

    var codes = JSON.stringify(
      locales.map((obj) => obj.locale.toLowerCase()),
      null,
      2
    )
    console.log('Writing to ' + localesPath)

    fs.writeFileSync(localesPath, codes, { flag: 'w' })
  })
}

module.exports = downloadCountryInformation
