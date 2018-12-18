import { UPDATE_SETTINGS } from '../../settings-action-types';
import _ from 'lodash';

const initialState = {
  originalArticleButton: true,
  suppress: false,
  localeFallbacks: [],
  chatButton: null,
  sectionFilter: null,
  categoryFilter: null,
  labelFilter: null,
  messageButton: null,
  searchPlaceholder: null,
  title: null
};

const maxLocaleFallbacks = 3;

const helpCenter = (state = initialState, action) => {
  const { type, payload } = action;

  switch (type) {
    case UPDATE_SETTINGS:
      return {
        originalArticleButton: Boolean(
          _.get(payload, 'webWidget.helpCenter.originalArticleButton', state.originalArticleButton)
        ),
        suppress: Boolean(_.get(payload, 'webWidget.helpCenter.suppress', state.suppress)),
        localeFallbacks: _.take(
          _.get(payload, 'webWidget.helpCenter.localeFallbacks', state.localeFallbacks),
          maxLocaleFallbacks
        ),
        chatButton: _.get(payload, 'webWidget.helpCenter.chatButton', state.chatButton),
        sectionFilter: _.get(payload, 'webWidget.helpCenter.filter.section', state.sectionFilter),
        categoryFilter: _.get(payload, 'webWidget.helpCenter.filter.category', state.categoryFilter),
        labelFilter: _.get(payload, 'webWidget.helpCenter.filter.label_names', state.labeFilter),
        messageButton: _.get(payload, 'webWidget.helpCenter.messageButton', state.messageButton),
        searchPlaceholder: _.get(payload, 'webWidget.helpCenter.searchPlaceholder', state.searchPlaceholder),
        title: _.get(payload, 'webWidget.helpCenter.title', state.title)
      };
    default:
      return state;
  }
};

export default helpCenter;
