import _ from 'lodash';

import {
  handlePrefillReceived,
  logout,
  apiClearForm,
  showRecieved,
  hideRecieved,
  openReceived,
  closeReceived,
  toggleReceived } from 'src/redux/modules/base';
import { chatLogout, sendVisitorPath, endChat, sendMsg } from 'src/redux/modules/chat';
import { getWidgetDisplayInfo } from 'src/redux/modules/selectors';
import { getIsChatting } from 'src/redux/modules/chat/chat-selectors';
import { updateSettings } from 'src/redux/modules/settings';
import { setContextualSuggestionsManually } from 'src/redux/modules/helpCenter';

import { i18n } from 'service/i18n';
import { mediator } from 'service/mediator';

export const endChatApi = (reduxStore) => {
  reduxStore.dispatch(endChat());
};

export const sendChatMsgApi = (reduxStore, msg) => {
  const message = (_.isString(msg)) ? msg : '';

  reduxStore.dispatch(sendMsg(message));
};

export const identifyApi = (reduxStore, user) => {
  mediator.channel.broadcast('.onIdentify', user);
};

export const openApi = (reduxStore) => {
  reduxStore.dispatch(openReceived());
};

export const closeApi = (reduxStore) => {
  reduxStore.dispatch(closeReceived());
};

export const toggleApi = (reduxStore) => {
  reduxStore.dispatch(toggleReceived());
};

export const setLocaleApi = (_, locale) => {
  i18n.setLocale(locale, true);
  mediator.channel.broadcast('.onSetLocale', locale);
};

export const updateSettingsApi = (reduxStore, newSettings) => {
  reduxStore.dispatch(updateSettings(newSettings));
};

export const logoutApi = (reduxStore) => {
  reduxStore.dispatch(logout());
  mediator.channel.broadcast('.logout');
  reduxStore.dispatch(chatLogout());
};

export const setHelpCenterSuggestionsApi = (reduxStore, options) => {
  const onDone = () => mediator.channel.broadcast('.setHelpCenterSuggestions');

  reduxStore.dispatch(setContextualSuggestionsManually(options, onDone));
};

export const prefill = (reduxStore, payload) => {
  reduxStore.dispatch(handlePrefillReceived(payload));
};

export const hideApi = (reduxStore) => {
  reduxStore.dispatch(hideRecieved());
};

export const showApi = (reduxStore) => {
  reduxStore.dispatch(showRecieved());
};

export const updatePathApi = (reduxStore, page = {}) => {
  reduxStore.dispatch(sendVisitorPath(page));
};

export const clearFormState = (reduxStore) => {
  reduxStore.dispatch(apiClearForm());
};

export const displayApi = (reduxStore, ...args) => getWidgetDisplayInfo(reduxStore.getState(), ...args);

export const isChattingApi = (reduxStore, ...args) => getIsChatting(reduxStore.getState(), ...args);
