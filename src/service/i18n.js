import _ from 'lodash';

const translate = require('counterpart');
const translations = require('translation/translations.json');
const localeIdMap = require('translation/localeIdMap.json');
let currentLocale;

// Setting to something other than (.) as our translation hash
// is a flat structure and counterpart tries to look in object
translate.setSeparator('*');

function parseLocale(str) {
  const locale = regulateLocaleStringCase(str);
  const extractLang = function(locale) {
    return locale.substring(0, locale.indexOf('-'));
  };

  if (translations[locale]) {
    return locale;
  } else if (translations[extractLang(locale)]) {
    return extractLang(locale);
  } else if (str === 'zh') {
    return 'zh-CN';
  } else if (str === 'nb' || str === 'nn') {
    return 'no';
  } else {
    return 'en-US';
  }
}

// force is for the nps preview use case where multiple embeds are rendered
// in multiple locales.
function setLocale(str = 'en-US', force = false) {
  if (!currentLocale || force) {
    currentLocale = parseLocale(str);
    translate.setLocale(currentLocale);

    // To avoid weird encoding issues we deliver the strings uri encoded
    // when setting the strings we then decode them in memory
    const decodedStrings = _.reduce(translations[currentLocale], function(res, el, key) {
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
  const dashIndex = locale.indexOf('-');

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
