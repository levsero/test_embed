/* eslint-disable no-console */

var rest = require('rest'),
  _ = require('lodash'),
  fs = require('fs'),
  isAssetComposerBuild = process.argv[2] === 'ac',
  localeIdMapGlobal = 'zELocaleIdMap',
  localeIdMapPath = __dirname + '/../src/translation/ze_localeIdMap.js',
  localesPath = __dirname + '/../src/translation/locales.json',
  localesEndpoint = 'https://support.zendesk.com/api/v2/locales/apps/web_widget.json'

if (process.env.EMBEDDABLE_FRAMEWORK_ENV === 'staging') {
  localesEndpoint = localesEndpoint.replace('.zendesk.com', '.zendesk-staging.com')
}

function fatal(error) {
  console.error(error)
  process.exit(1)
}

function filterLocales(locales) {
  return _.reject(locales, function (locale) {
    return locale.name === 'Deutsch (informell)'
  })
}

function generateLocaleIdMap(locales) {
  return locales.reduce((idMap, element) => {
    idMap[element.locale.toLowerCase()] = element.id
    return idMap
  }, {})
}

function writeJsonToGlobalFile(globalName, path, json) {
  var contents = 'window.' + globalName + ' = ' + JSON.stringify(json, null, 2)

  fs.writeFile(path, contents, (err) => {
    if (err) {
      fatal(err)
    }
  })
}

function writeJsonToModuleFile(path, json) {
  var contents = 'module.exports = ' + JSON.stringify(json, null, 2)

  fs.writeFile(path, contents, (err) => {
    if (err) {
      fatal(err)
    }
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

rest(localesEndpoint)
  .then(function (res) {
    if (res.status.code !== 200) {
      fatal(localesEndpoint + ' did not respond with 200')
    }
    var locales = filterLocales(JSON.parse(res.entity).locales)

    console.log('\nWriting to ' + localeIdMapPath)

    writeJson(localeIdMapPath, generateLocaleIdMap(locales), localeIdMapGlobal)

    var codes = JSON.stringify(
      locales.map((obj) => obj.locale.toLowerCase()),
      null,
      2
    )
    console.log('\nWriting to ' + localesPath)
    fs.writeFile(localesPath, codes, { flag: 'w' }, (err) => {
      if (err) {
        console.error(err)
      }
    })
  })
  .catch(function (e) {
    fatal(e.message)
  })
