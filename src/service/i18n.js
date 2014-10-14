var translate = require('counterpart'),
    translations = require('translation/translations.json'),
    locale;

// Setting to something other than (.) as our translation hash
// is a flat structure and counterpart tries to look in object
translate.setSeparator('*');

function setLocale(loc = 'en-US') {
  if (!locale) {
    locale = loc;
    loc = regulateLocaleStringCase(loc);
    if (!translations[loc]) {
      loc = 'en-US';
    }
    translate.setLocale(loc);
    translate.registerTranslations(loc, translations[loc]);
  }
}

function regulateLocaleStringCase(locale) {
  var dashIndex = locale.indexOf('-');

  if (dashIndex < 0) {
    return locale.toLowerCase();
  }
  return locale.substring(0, dashIndex).toLowerCase() + locale.substring(dashIndex).toUpperCase();
}

export var i18n = {
  t: translate,
  setLocale: setLocale
};
