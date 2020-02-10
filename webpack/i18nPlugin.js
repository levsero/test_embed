const I18nPlugin = require('@zendesk/client-i18n-tools/I18nPlugin')
const path = require('path')

module.exports = shouldSplit => {
  const settings = {
    locales: path.join(__dirname, '../src/translation/locales.json'),
    localesDir: path.join(__dirname, '../src/translation/locales'),
    source: path.join(__dirname, '../config/locales/translations/embeddable_framework.yml'),
    assetNamePrefix: 'locales/',
    globalVariable: 'WWI18N'
  }

  if (shouldSplit) {
    return new I18nPlugin({
      ...settings,
      bundleName: 'i18n_locale_bundle'
    })
  }

  return new I18nPlugin({
    ...settings
  })
}
