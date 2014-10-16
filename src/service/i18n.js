var translate = require('counterpart'),
    translations = require('translation/translations.json'),
    currentLocale;

// Setting to something other than (.) as our translation hash
// is a flat structure and counterpart tries to look in object
translate.setSeparator('*');

function setLocale(locale = 'en-US') {
  if (!currentLocale) {
    currentLocale = locale;
    locale = regulateLocaleStringCase(locale);
    if (!translations[locale]) {
      locale = 'en-US';
    }
    translate.setLocale(locale);
    translate.registerTranslations(locale, translations[locale]);
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
