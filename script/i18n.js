/* eslint-disable no-console */

var rest = require('rest'),
  _ = require('lodash'),
  fs = require('fs'),
  isAssetComposerBuild = process.argv[2] === 'ac',
  localeIdMapGlobal = 'zELocaleIdMap',
  localeIdMapPath = __dirname + '/../src/translation/ze_localeIdMap.js',
  localesEndpoint = 'https://support.zendesk.com/api/v2/locales/apps/web_widget.json'

function filterLocales(locales) {
  return _.reject(locales, function(locale) {
    return locale.name === 'Deutsch (informell)'
  })
}

function generateLocaleIdMap(locales) {
  return locales.reduce((idMap, element) => {
    idMap[element.locale] = element.id
    return idMap
  }, {})
}

function writeJsonToGlobalFile(globalName, path, json) {
  var contents = 'window.' + globalName + ' = ' + JSON.stringify(json, null, 2)

  fs.writeFile(path, contents, err => {
    console.error(err)
  })
}

function writeJsonToModuleFile(path, json) {
  var contents = 'module.exports = ' + JSON.stringify(json, null, 2)

  fs.writeFile(path, contents, err => {
    console.error(err)
  })
}

function writeJson(path, json, globalName) {
  if (isAssetComposerBuild) {
    writeJsonToGlobalFile(globalName, path, json)
  } else {
    writeJsonToModuleFile(path, json)
  }
}

console.log('Downloading ' + localesEndpoint)

rest(localesEndpoint).then(function(res) {
  var locales = filterLocales(JSON.parse(res.entity).locales)

  console.log('\nWriting to ' + localeIdMapPath)

  writeJson(localeIdMapPath, generateLocaleIdMap(locales), localeIdMapGlobal)
})
