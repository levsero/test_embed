/* eslint-disable no-console */

const rest = require('rest')
const fs = require('fs')
const { repoRoot } = require('./utils')

const messengerLocaleIdMapPath = repoRoot(
  './packages/web-widget-messenger/messengerSrc/features/i18n/gen/ze_localeIdMap.js'
)
const messengerLocalesPath = repoRoot(
  './packages/web-widget-messenger/messengerSrc/features/i18n/gen/locales.json'
)

const classicLocaleIdMapPath = repoRoot(
  './packages/web-widget-classic/classicSrc/app/webWidget/services/gen/ze_localeIdMap.js'
)
const classicLocalesPath = repoRoot(
  './packages/web-widget-classic/classicSrc/app/webWidget/services/gen/locales.json'
)

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

    const localeIdMap = locales.reduce((idMap, element) => {
      idMap[element.locale.toLowerCase()] = element.id
      return idMap
    }, {})

    const contents = 'module.exports = ' + JSON.stringify(localeIdMap, null, 2)

    console.log('Writing to ' + messengerLocaleIdMapPath)
    fs.writeFileSync(messengerLocaleIdMapPath, contents)
    console.log('Writing to ' + classicLocaleIdMapPath)
    fs.writeFileSync(classicLocaleIdMapPath, contents)

    var codes = JSON.stringify(
      locales.map((obj) => obj.locale.toLowerCase()),
      null,
      2
    )

    console.log('Writing to ' + messengerLocalesPath)
    fs.writeFileSync(messengerLocalesPath, codes, { flag: 'w' })
    console.log('Writing to ' + classicLocalesPath)
    fs.writeFileSync(classicLocalesPath, codes, { flag: 'w' })
  })
}

module.exports = downloadCountryInformation
