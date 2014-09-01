var when  = require('when'),
    rest  = require('rest'),
    _     = require('lodash'),
    fs    = require('fs'),
    puts  = require('sys').puts,
    print = require('sys').print,
    outputPath = __dirname + "/../src/translation/translations.json",
    defaultLocale = {
      "en": {
        "embeddable_framework.launcher.label.help": "Help",
        "embeddable_framework.launcher.label.chat": "Chat",
        "embeddable_framework.chat.title": "Live Chat",
        "embeddable_framework.chat.notification": "%(count)s new",
        "embeddable_framework.submitTicket.notify.message.success": "Message Sent",
        "embeddable_framework.submitTicket.notify.message.timeout": "It seems you have hit an internet blackspot! Please try again",
        "embeddable_framework.submitTicket.marketing.message": "Give this experience to your customers",
        "embeddable_framework.submitTicket.form.title": "Leave us a message",
        "embeddable_framework.submitTicket.form.submitButton.label": "Send",
        "embeddable_framework.submitTicket.form.submitButton.label.sending": "Submitting...",
        "embeddable_framework.submitTicket.field.name.label": "Your name",
        "embeddable_framework.submitTicket.field.description.label": "How can we help you?",
        "embeddable_framework.form.field.email.label": "Email Address",
        "embeddable_framework.helpCenter.search.label": "Search help articles",
        "embeddable_framework.helpCenter.submitButton.label.chat": "Live Chat",
        "embeddable_framework.helpCenter.submitButton.label.submitTicket": "Leave us a Message",
        "embeddable_framework.helpCenter.label.default": "Common Questions",
        "embeddable_framework.helpCenter.label.results": "Top Results",
        "embeddable_framework.helpCenter.label.showAll": "View all (%(count)s)",
        "embeddable_framework.navigation.back": "Back",
        "embeddable_framework.navigation.close": "Close"
      }
    };

function fetchLocale(locale) {
  var url = locale.url + '?include=translations&packages=embeddable_framework';
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
        .assign(defaultLocale)
        .value();

      puts("\nWriting to " + outputPath);

      fs.writeFile(
        outputPath,
        JSON.stringify(translations, null, 4)
      );
    });
  });
