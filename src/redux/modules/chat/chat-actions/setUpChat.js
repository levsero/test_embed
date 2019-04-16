import _ from 'lodash';
import { logging } from 'service/logging';
import { store } from 'service/persistence';
import { settings } from 'service/settings';
import {
  getChatConfig,
  getBrandCount,
  getBrand
} from 'src/redux/modules/base/base-selectors';
import {
  fetchConversationHistory,
  handleChatVendorLoaded
} from 'src/redux/modules/chat';
import {
  SDK_ACTION_TYPE_PREFIX,
  JWT_ERROR,
} from 'constants/chat';
import { AUTHENTICATION_STARTED, AUTHENTICATION_FAILED } from 'src/redux/modules/chat/chat-action-types';
import zopimApi from 'service/api/zopimApi';
import { win, isPopout } from 'utility/globals';

function makeChatConfig(config) {
  /* eslint-disable camelcase */
  const jwtFn = _.get(config, 'authentication.jwtFn');
  const authentication = jwtFn ? { jwt_fn: jwtFn } : null;

  return _.omitBy({
    account_key: store.get('chatAccountKey') || config.zopimId,
    override_proxy: store.get('chatOverrideProxy') || config.overrideProxy,
    override_auth_server_host: store.get('chatOverrideAuthServerHost') || config.overrideAuthServerHost,
    authentication,
    activity_window: win,
    popout: isPopout()
  }, _.isNil);
  /* eslint-enable camelcase */
}

export function setUpChat() {
  return (dispatch, getState) => {
    const authentication = settings.getChatAuthSettings();
    const state = getState();

    const config = { ...getChatConfig(state).props, authentication };

    const brandCount = getBrandCount(state);
    const brand = getBrand(state);
    let brandName;

    if (brandCount === undefined || brandCount > 1) {
      brandName = brand;
    }

    const onChatImported = (zChat, slider) => {
      dispatch(handleChatVendorLoaded({ zChat, slider: slider.default }));

      if (config.authentication) {
        const onAuthFailure = (e) => {
          if (_.get(e, 'extra.reason') === JWT_ERROR) {
            _.unset(config, 'authentication');
            dispatch({
              type: AUTHENTICATION_FAILED
            });

            zChat.init(makeChatConfig(config));
            if (brandName) zChat.addTag(brandName);
          }
        };

        zChat.on('error', onAuthFailure);

        dispatch({
          type: AUTHENTICATION_STARTED
        });
      }
      zChat.init(makeChatConfig(config));
      zopimApi.handleZopimQueue(win);
      zChat.setOnFirstReady({
        fetchHistory: () => {
          if (_.get(config, 'authentication.jwtFn')) {
            if (brandName) zChat.addTags([brandName]);
            dispatch(fetchConversationHistory());
          }
        }
      });

      if (brandName && !_.get(config, 'authentication.jwtFn')) {
        zChat.addTags([brandName]);
      }

      zChat.getFirehose().on('data', (data) => {
        let actionType;

        if (data.type === 'history') {
          actionType = `${SDK_ACTION_TYPE_PREFIX}/history/${data.detail.type}`;
        } else {
          actionType = data.detail.type
            ? `${SDK_ACTION_TYPE_PREFIX}/${data.detail.type}`
            : `${SDK_ACTION_TYPE_PREFIX}/${data.type}`;
        }

        if (data.type === 'chat' && data.detail) {
          data.detail.timestamp = data.detail.timestamp || Date.now();
        }
        dispatch({ type: actionType, payload: data });
      });
    };
    const onFailure = (err) => {
      logging.error(err);
    };

    Promise.all([import('chat-web-sdk'), import('react-slick')])
      .then((arr)=> onChatImported(...arr))
      .catch(onFailure);
  };
}
