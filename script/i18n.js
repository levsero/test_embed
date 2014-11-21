var when  = require('when'),
    rest  = require('rest'),
    _     = require('lodash'),
    fs    = require('fs'),
    puts  = require('sys').puts,
    print = require('sys').print,
    localeIdMapPath = __dirname + "/../src/translation/localeIdMap.json",
    translationsPath = __dirname + "/../src/translation/translations.json";

function fetchLocale(locale) {
  var url = locale.url + '?include=translations&packages=embeddable_framework';
  return rest(url)
    .then(function(response) {
      print('.');
      return response;
    });
};

function generateLocaleIdMap(locales) {
  return _.chain(locales)
    .reduceRight(function(res, el) {
      res[el.locale] = el.id;
      return res;
    }, {})
    .value();
}

puts('Downloading https://support.zendesk.com/api/v2/rosetta/locales/public.json');

rest('https://support.zendesk.com/api/v2/rosetta/locales/public.json')
  .then(function(res) {
    var locales = JSON.parse(res.entity).locales;
    var requests = [];

    puts("\nWriting to " + localeIdMapPath);

    fs.writeFile(
      localeIdMapPath,
      JSON.stringify(generateLocaleIdMap(locales), null, 2)
    );

    print('Downloading individual locales');

    _.forEach(locales, function(locale) {
      requests.push(fetchLocale(locale));
    });

    when.all(requests).done(function(responses) {
      var translations = _.chain(responses)
        .map(function(res) {
          return JSON.parse(res.entity).locale;
        })
        .reduceRight(function(result, el) {
          result[el.locale] = el.translations;
          return result;
        }, {})
        .value();

      puts("\nWriting to " + translationsPath);

      fs.writeFile(
        translationsPath,
        JSON.stringify(translations, null, 2)
      );
    });
  });
