require('imports?_=lodash!lodash');

var translate = require('counterpart'),
    translations = require('translation/translations.json'),
    localeIdMap = require('translation/localeIdMap.json'),
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
  } else if (str === 'zh') {
    return 'zh-CN';
  } else if (str === 'nb' || str === 'nn') {
    return 'no';
  } else {
    return 'en-US';
  }
}

function setLocale(str = 'en-US') {
  if (!currentLocale) {
    currentLocale = parseLocale(str);
    translate.setLocale(currentLocale);

    // To avoid weird encoding issues we deliver the strings uri encoded
    // when setting the strings we then decode them in memory
    var decodedStrings = _.reduce(translations[currentLocale], function(res, el, key) {
      res[key] = decodeURIComponent(el);
      return res;
    }, {});

    translate.registerTranslations(currentLocale, decodedStrings);
  }
}

function getLocale() {
  return translate.getLocale();
}

function isRTL() {
  return translations[getLocale()].rtl;
}

function regulateLocaleStringCase(locale) {
  var dashIndex = locale.indexOf('-');

  if (dashIndex < 0) {
    return locale.toLowerCase();
  }
  return locale.substring(0, dashIndex).toLowerCase() + locale.substring(dashIndex).toUpperCase();
}

function getLocaleId() {
  return localeIdMap[currentLocale];
}

export var i18n = {
  t: translate,
  getLocaleId: getLocaleId,
  setLocale: setLocale,
  getLocale: getLocale,
  isRTL: isRTL
};
