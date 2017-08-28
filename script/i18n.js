var when = require('when'),
    rest = require('rest'),
    _ = require('lodash'),
    fs = require('fs'),
    localeIdMapPath = __dirname + "/../src/translation/localeIdMap.json",
    translationsPath = __dirname + "/../src/translation/translations.json",
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
      _.set(result, [key, locale].join('.'), val);
    });

    return result;
  }, {});
}

console.log('Downloading https://support.zendesk.com/api/v2/rosetta/locales/public.json');

rest('https://support.zendesk.com/api/v2/rosetta/locales/public.json')
  .then(function(res) {
    var locales = filterLocales(JSON.parse(res.entity).locales);
    var requests = [];

    console.log('\nWriting to ' + localeIdMapPath);

    fs.writeFile(
      localeIdMapPath,
      JSON.stringify(generateLocaleIdMap(locales), null, 2)
    );

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
          result[el.locale] = _.reduce(el.translations, function(res, el, key) {
            // TODO: There was once issues with the encoding of translations for certain
            // locales that caused strange characters to render in the widget. The workaround
            // for this was to encode all strings in a URI format. This makes the translations file
            // size bigger and may not be needed. If i18n and QA find no issues, we can remove this comment
            // and go forward with storing the strings in plain text.
            // PR: https://github.com/zendesk/embeddable_framework/pull/255
            // res[key] = encodeURIComponent(el);
            res[key] = el;
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

        fs.writeFile(
          translationsPath,
          JSON.stringify(transformed, null, 2)
        );
      }
    });
  });
