import _ from 'lodash';

import { settings } from 'service/settings';

const translate = require('counterpart');
const translations = require('translation/translations.json');
const localeIdMap = require('translation/localeIdMap.json');

let currentLocale;

// Setting to something other than (.) as our translation hash
// is a flat structure and counterpart tries to look in object
translate.setSeparator('*');

function init(locale) {
  const customerTranslations = settings.getTranslations();

  if (!_.isEmpty(customerTranslations)) {
    overrideTranslations(customerTranslations);
  }

  setLocale(locale);
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
  const lowercaseLocale = locale.toLowerCase();
  const extractLang = (locale) => {
    return locale.substring(0, locale.indexOf('-'));
  };

  if (translations[locale]) {
    return locale;
  } else if (translations[lowercaseLocale]) {
    return lowercaseLocale;
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
  // override all locales if there are wild card translations
  _.forEach(newTranslations, (newTranslation, translationKey) => {
    if (newTranslation.hasOwnProperty('*')) {
      const globalOverrides = mappedTranslationsForLocale(newTranslation['*'], translationKey);

      for (let locale in translations) {
        _.merge(translations[locale], globalOverrides);
      }
    }

    // overrride any other specified locales
    for (let locale in newTranslation) {
      if (locale === '*') continue;

      const localeOverrides = mappedTranslationsForLocale(newTranslation[locale], translationKey);

      _.merge(translations[locale], localeOverrides);
    }
  });
}

function mappedTranslationsForLocale(localeOverride, translationKey) {
  const keyLookupTable = {
    'embeddable_framework.launcher.label.help': 'launcherLabel',
    'embeddable_framework.launcher.label.support': 'launcherLabel',
    'embeddable_framework.launcher.label.feedback': 'launcherLabel',
    'embeddable_framework.launcher.label.chat': 'launcherChatLabel',
    'embeddable_framework.helpCenter.form.title.help': 'helpCenterTitle',
    'embeddable_framework.helpCenter.form.title.support': 'helpCenterTitle',
    'embeddable_framework.helpCenter.form.title.feedback': 'helpCenterTitle',
    'embeddable_framework.helpCenter.submitButton.label.submitTicket.message': 'helpCenterMessageButton',
    'embeddable_framework.helpCenter.submitButton.label.submitTicket.contact': 'helpCenterMessageButton',
    'embeddable_framework.helpCenter.submitButton.label.chat': 'helpCenterChatButton',
    'embeddable_framework.submitTicket.form.title.message': 'contactFormTitle',
    'embeddable_framework.submitTicket.form.title.contact': 'contactFormTitle'
  };

  return _.chain(keyLookupTable)
    .map((value, key) => {
      if (value === translationKey) return key;
    })
    .compact()
    .reduce((obj, key) => {
      return _.merge(obj, { [key]: localeOverride });
    }, {})
    .value();
}

export const i18n = {
  init: init,
  t: translate,
  getLocaleId: getLocaleId,
  setLocale: setLocale,
  getLocale: getLocale,
  isRTL: isRTL
};
