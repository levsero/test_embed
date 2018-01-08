import _ from 'lodash';
import { sprintf } from 'sprintf-js';

import { settings } from 'service/settings';
import zETranslations from 'translation/ze_translations';
import zELocaleIdMap from 'translation/ze_localeIdMap';

const keyLookupTable = {
  launcherLabel: [
    'embeddable_framework.launcher.label.help',
    'embeddable_framework.launcher.label.support',
    'embeddable_framework.launcher.label.feedback'
  ],
  launcherChatLabel: ['embeddable_framework.launcher.label.chat'],
  helpCenterTitle: [
    'embeddable_framework.helpCenter.form.title.help',
    'embeddable_framework.helpCenter.form.title.support',
    'embeddable_framework.helpCenter.form.title.feedback'
  ],
  helpCenterMessageButton: [
    'embeddable_framework.helpCenter.submitButton.label.submitTicket.message',
    'embeddable_framework.helpCenter.submitButton.label.submitTicket.contact'
  ],
  helpCenterContactButton: ['embeddable_framework.helpCenter.submitButton.label.submitTicket.contact'],
  helpCenterChatButton: ['embeddable_framework.common.button.chat'],
  contactFormTitle: [
    'embeddable_framework.submitTicket.form.title.message',
    'embeddable_framework.submitTicket.form.title.contact'
  ],
  contactFormSelectTicketForm: ['embeddable_framework.submitTicket.ticketForms.title'],
  helpCenterSearchPlaceholder: ['embeddable_framework.helpCenter.search.label.how_can_we_help'],
  contactOptionsContactFormLabel: ['embeddable_framework.channelChoice.button.label.submitTicket'],
  contactOptionsChatLabelOnline: ['embeddable_framework.common.button.chat'],
  contactOptionsChatLabelOffline: ['embeddable_framework.channelChoice.button.label.chat_offline_v2']
};

let currentLocale;

// The force argument is for post-render setLocale function so that
// it can override the locale if it has previously been set.
function setLocale(str = 'en-US', force = false) {
  if (!currentLocale || force) {
    currentLocale = parseLocale(str);
  }
}

function translate(key, params = {}) {
  const keyForLocale = `${key}.${currentLocale}`;
  const translation = _.get(zETranslations, keyForLocale);

  if (_.isUndefined(translation)) {
    return params.fallback || getMissingTranslationString(key, currentLocale);
  }

  return interpolateTranslation(translation, params);
}

function setCustomTranslations() {
  const customerTranslations = settings.getTranslations();

  if (!_.isEmpty(customerTranslations)) {
    overrideTranslations(customerTranslations);
  }
}

function getLocale() {
  return currentLocale;
}

function getLocaleId() {
  return zELocaleIdMap[currentLocale];
}

function isRTL() {
  return !!zETranslations.rtl[currentLocale];
}

// private

function getMissingTranslationString(key, locale) {
  return `Missing translation (${locale}): ${key}`;
}

function interpolateTranslation(translation, args) {
  try {
    return sprintf(translation, args);
  } catch (_) {
    return translation;
  }
}

function regulateLocaleStringCase(locale) {
  const dashIndex = locale.indexOf('-');

  if (dashIndex < 0) {
    return locale.toLowerCase();
  }
  return locale.substring(0, dashIndex).toLowerCase() + locale.substring(dashIndex).toUpperCase();
}

function parseLocale(str) {
  const locales = zETranslations.locales;
  const locale = regulateLocaleStringCase(str);
  const lowercaseLocale = locale.toLowerCase();
  const extractLang = (locale) => {
    return locale.substring(0, locale.indexOf('-'));
  };

  if (_.includes(locales, locale)) {
    return locale;
  } else if (_.includes(locales, lowercaseLocale)) {
    return lowercaseLocale;
  } else if (_.includes(locales, extractLang(locale))) {
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
  // Override all locales if there are wild card translations.
  _.forEach(newTranslations, (newTranslation, translationKey) => {
    const keys = keyLookupTable[translationKey];

    if (newTranslation.hasOwnProperty('*')) {
      _.forEach(keys, (key) => {
        const overridenStrings = _.mapValues(_.get(zETranslations, key), () => newTranslation['*']);

        _.set(zETranslations, key, overridenStrings);
      });
    }

    // Overrride any other specified locales.
    for (let locale in newTranslation) {
      if (locale === '*') continue;

      _.forEach(keys, (key) => {
        _.set(zETranslations, `${key}.${locale}`, newTranslation[locale]);
      });
    }
  });
}

export const i18n = {
  t: translate,
  getLocaleId: getLocaleId,
  setLocale: setLocale,
  getLocale: getLocale,
  isRTL: isRTL,
  setCustomTranslations: setCustomTranslations
};
