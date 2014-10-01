var translate = require('counterpart'),
    translations = require('translation/translations.json');

// Setting to something other than (.) as our translation hash
// is a flat structure and counterpart tries to look in object
translate.setSeparator('*');

function init() {
  setLocale();
}

function setLocale(locale = 'en-US') {
  locale = uppercaseRegionCode(locale);
  translate.setLocale(locale);
  translate.registerTranslations(locale, translations[locale]);
}

function uppercaseRegionCode(locale) {
  var dashIndex = locale.indexOf('-') + 1;

  if (dashIndex <= 0) {
    return locale;
  }
  return locale.substring(0, dashIndex) + locale.substring(dashIndex).toUpperCase();
}

export var i18n = {
  init: init,
  t: translate,
  setLocale: setLocale
};

