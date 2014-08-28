var translate = require('counterpart'),
    translations = require('translation/translations.json');

// Setting to something other than (.) as our translation hash
// is a flat structure and counterpart tries to look in object
translate.setSeparator('*');

function init() {
  setLocale();
}

function setLocale(locale = 'en-US') {
  translate.setLocale(locale);
  translate.registerTranslations(locale, translations[locale]);
}

export var i18n = {
  init: init,
  translate: translate,
  setLocale: setLocale
};

