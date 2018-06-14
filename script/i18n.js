var when = require('when'),
    rest = require('rest'),
    _ = require('lodash'),
    fs = require('fs'),
    isAssetComposerBuild = process.argv[2] === 'ac',
    appRoot = require('app-root-path'),
    localeIdMapGlobal = 'zELocaleIdMap',
    translationsGlobal = 'zETranslations',
    localeIdMapPath = __dirname + "/../src/translation/ze_localeIdMap.js",
    translationsPath = __dirname + "/../src/translation/ze_translations.js",
    translationMissingMessage = 'translation%20missing';

function filterLocales(locales) {
  return _.reject(locales, function(locale) {
    return locale.name === 'Deutsch (informell)';
  });
}

function fetchLocale(locale) {
  var url = locale.url + '?include=translations&packages=embeddable_framework';
  return rest(url)
    .then(function(response) {
      process.stdout.write('.');
      return response;
    });
}

function generateLocaleIdMap(locales) {
  return _.chain(locales)
    .reduce(function(res, el) {
      res[el.locale] = el.id;
      return res;
    }, {})
    .value();
}

function getMissingTranslations(translations) {
  return _.chain(translations)
    .map(function(translation, key) {
      return {
        locale: key,
        strings: _.pickBy(translation, function(string, key) {
          return key !== 'rtl' && string.indexOf(translationMissingMessage) > -1;
        })
      };
    })
    .filter(function(translation) {
      return !_.isEmpty(translation.strings);
    })
    .value();
}

function transformTranslations(translations) {
  return _.reduce(translations, function(result, translation, locale) {
    _.forEach(translation, function(val, key) {
      // Filters out the automaticAnswers strings. Once they have their own package we can remove this.
      if (key.indexOf('automaticAnswers') === -1) {
        _.set(result, [key, locale].join('.'), val);
      }
    });

    return result;
  }, {});
}

function createIndividualFile(rootPath, json) {
  console.log('Writing individual locale files');

  _.forEach(json, (value, key) => {
    var translations = transformTranslations({ key: value });
    var localePath = rootPath + key + '/';
    var contents = JSON.stringify(translations, null, 2);

    fs.mkdir(localePath, (err) => {
      if (err && err.code !== 'EEXIST') {
        console.log('Error creating ' + key + ' path', err);
      } else {
        fs.writeFile(localePath + 'translations.js', contents, (err) => {
          if (err) {
            console.log('Error creating ' + key + ' translations', err);
          } else {
            process.stdout.write('.');
          }
        });
      }
    });
  });
}

function writeJsonToIndivdualFiles(globalName, json) {
  const rootPath = appRoot + '/src/translation/locales/';

  fs.mkdir(rootPath, (err) => {
    if (err && err.code !== 'EEXIST') {
      console.log('Error creating root path', err);
    } else {
      createIndividualFile(rootPath, json);
    }
  });
}

function writeJsonToGlobalFile(globalName, path, json) {
  var contents = 'window.'
               + globalName
               + ' = '
               + JSON.stringify(json, null, 2);

  fs.writeFile(path, contents);
}

function writeJsonToModuleFile(path, json) {
  var contents = 'module.exports = ' + JSON.stringify(json, null, 2);

  fs.writeFile(path, contents);
}

function writeJson(path, json, globalName) {
  if (isAssetComposerBuild) {
    writeJsonToGlobalFile(globalName, path, json);
  } else {
    writeJsonToModuleFile(path, json);
  }
}

console.log('Downloading https://support.zendesk.com/api/v2/rosetta/locales/public.json');

rest('https://support.zendesk.com/api/v2/rosetta/locales/public.json')
  .then(function(res) {
    var locales = filterLocales(JSON.parse(res.entity).locales);
    var requests = [];

    console.log('\nWriting to ' + localeIdMapPath);

    writeJson(localeIdMapPath, generateLocaleIdMap(locales), localeIdMapGlobal);

    console.log('Downloading individual locales');

    _.forEach(locales, function(locale) {
      requests.push(fetchLocale(locale));
    });

    when.all(requests).done(function(responses) {
      var translations = _.chain(responses)
        .map(function(res) {
          return JSON.parse(res.entity).locale;
        })
        .reduce(function(result, el) {
          result[el.locale] = _.reduce(el.translations, function(res, elem, key) {
            let string = elem;

            // For all french based languages any terminal request converts the space in front of any
            // punctuation marks into a no-break unicode space. This means triggers won't work on them.
            // This converts that space into the correct space character which shouldn't make a big
            // difference on how they're rendered.  http://jkorpela.fi/chars/spaces.html
            if (el.locale.indexOf('fr') === 0) {
              _.forEach(string, (char, index) => {
                if (char.charCodeAt(0) === '160') {
                  string[index] = '32';
                }
              });
            }

            res[key] = string;
            return res;
          }, {});
          result[el.locale].rtl = el.rtl;
          return result;
        }, {})
        .value();

      var missingTranslations = getMissingTranslations(translations);

      if (!_.isEmpty(missingTranslations)) {
        console.log('\nMissing translations found:');

        _.forEach(missingTranslations, function(translation) {
          console.log(translation.locale);
          _.forEach(translation.strings, function(string, key) {
            console.log('    ' + key + ' : ' + string);
          });
        });

        process.exit(1);
      } else {
        var locales = _.keys(translations);
        var transformed = _.extend({}, transformTranslations(translations), { locales: locales });

        console.log('\nWriting to ' + translationsPath);

        writeJson(translationsPath, transformed, translationsGlobal);

        if (isAssetComposerBuild) {
          writeJsonToIndivdualFiles(translationsPath, translations, translationsGlobal);
        }
      }
    });
  });
