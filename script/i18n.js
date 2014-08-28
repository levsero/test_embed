var when  = require('when'),
    rest  = require('rest'),
    _     = require('lodash'),
    fs    = require('fs'),
    puts  = require('sys').puts,
    print = require('sys').print,
    outputPath = __dirname + "/../src/translations/translations.json";

function fetchLocale(locale) {
  var url = locale.url + '?include=translations&packages=ce_toolkit';
  return rest(url)
    .then(function(response) {
      print('.');
      return response;
    });
};

puts('Downloading https://support.zendesk.com/api/v2/rosetta/locales/agent.json');

rest('https://support.zendesk.com/api/v2/rosetta/locales/agent.json')
  .then(function(res) {
    var locales = JSON.parse(res.entity).locales;
    var requests = [];

    print('Downloading individual locales');

    _.forEach(locales, function(locale) {
      requests.push(fetchLocale(locale));
    });

    when.all(requests).done(function(responses) {
      var translations = _.chain(responses)
        .map(function(res) {
          return JSON.parse(res.entity).locale;
        })
        .reduce(function(result, el) {
          result[el.locale] = el.translations;
          return result;
        }, {})
        .value();

      puts("\nWriting src/translations/translations.json");

      fs.writeFile(
        outputPath,
        JSON.stringify(translations, null, 4)
      );
    });
  });
