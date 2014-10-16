var translate = require('counterpart'),
    translations = require('translation/translations.json'),
    currentLocale;

// Setting to something other than (.) as our translation hash
// is a flat structure and counterpart tries to look in object
translate.setSeparator('*');

function parseLocale(str) {
  var locale = regulateLocaleStringCase(str);

  if (translations[locale]) {
    return locale;
  } else if (translations[locale.substr(0, 2)]) {
    return locale.substr(0, 2);
  } else {
    return 'en-US';
  }
}

function setLocale(str = 'en-US') {
  if (!currentLocale) {
    currentLocale = parseLocale(str);
    translate.setLocale(currentLocale);
    translate.registerTranslations(currentLocale, translations[currentLocale]);
  }
}

function getLocale() {
  return translate.getLocale();
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
  setLocale: setLocale,
  getLocale: getLocale
};
