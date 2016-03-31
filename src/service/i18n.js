import _ from 'lodash';

import { settings } from 'service/settings';

const translate = require('counterpart');
const translations = require('translation/translations.json');
const localeIdMap = require('translation/localeIdMap.json');
let currentLocale;

// Setting to something other than (.) as our translation hash
// is a flat structure and counterpart tries to look in object
translate.setSeparator('*');

function init() {
  const newTranslations = settings.get('translations');

  if (newTranslations) {
    overrideTranslations(newTranslations);
    debugger
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

function getLocaleId() {
  return localeIdMap[currentLocale];
}

function isRTL() {
  return translations[getLocale()] && translations[getLocale()].rtl;
}

// private

function regulateLocaleStringCase(locale) {
  const dashIndex = locale.indexOf('-');

  if (dashIndex < 0) {
    return locale.toLowerCase();
  }
  return locale.substring(0, dashIndex).toLowerCase() + locale.substring(dashIndex).toUpperCase();
}

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
  } else if (str === 'tl') {
    return 'fil';
  } else {
    return 'en-US';
  }
}

function overrideTranslations(newTranslations) {
  const transLookupTable = {
    launcherText: 'embeddable_framework.launcher.label.[help,support,feedback]',
    launcherTextChat: 'embeddable_framework.launcher.label.chat'
  };

  const newTranslationLocales = _.keys(newTranslations);

  if (_.includes(newTranslationLocales, '*')) {
    const mappedTranslations = _.mapKeys(newTranslations['*'], (val, key) => {
      return transLookupTable[key];
    });

    for (let key in mappedTranslations) {
      const idx = key.indexOf('[');

      if (idx > -1) {
        const prefix = key.substring(0, idx);
        const newKeys = key.substring(idx+1, key.length-1).split(',');
        const newMapTranslations = {};

        _.forEach(newKeys, (newKey) => {
          newMapTranslations[`${prefix}${newKey}`] = mappedTranslations[key];
        });

        _.merge(mappedTranslations, newMapTranslations);
        delete mappedTranslations[key];
      }
    }

    for (let locale in translations) {
      _.merge(translations[locale], mappedTranslations);
    }
  }
}

export const i18n = {
  init: init,
  t: translate,
  getLocaleId: getLocaleId,
  setLocale: setLocale,
  getLocale: getLocale,
  isRTL: isRTL
};
