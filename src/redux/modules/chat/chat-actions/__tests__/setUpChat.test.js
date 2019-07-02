import _ from 'lodash';
import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import { getModifiedState } from 'src/fixtures/selectors-test-state';
import { wait } from 'react-testing-library';

import { setUpChat } from '../setUpChat';
import { win } from 'utility/globals';
import zopimApi from 'service/api/zopimApi';
import * as zChat from 'chat-web-sdk';
import slider from 'react-slick';
import { settings } from 'service/settings';
import firehoseListener from 'src/redux/modules/chat/helpers/firehoseListener';

jest.mock('react-slick');
jest.mock('chat-web-sdk');
jest.mock('service/api/zopimApi');
jest.mock('src/redux/modules/chat/helpers/firehoseListener');

zChat.getFirehose.mockImplementation(() => ({ on: jest.fn() }));
zChat.setOnFirstReady.mockImplementation((readyObj) => {
  _.forEach(readyObj, (val) => val());
});

const dispatchAction = (customState = {}) => {
  const mockStore = configureMockStore([thunk]);
  const store = mockStore(getModifiedState(customState));

  store.dispatch(setUpChat());

  return store;
};

describe('setupChat', () => {
  it('calls handleChatSDKInitialized', async () => {
    dispatchAction();

    await wait(() => {
      expect(zopimApi.handleChatSDKInitialized)
        .toHaveBeenCalled();
    });
  });

  it('dispatches the handleChatVendorLoaded action creator with zChat and slider vendor', async () => {
    const store = dispatchAction();

    await wait(() => {
      expect(store.getActions()[0])
        .toEqual({
          type: 'widget/chat/CHAT_VENDOR_LOADED',
          payload: {
            zChat,
            slider
          }
        });
    });
  });

  it('calls zChat init with the correct params', async () => {
    dispatchAction();

    await wait(() => {
      expect(zChat.init)
        .toHaveBeenCalledWith({
          account_key: '123abc',
          activity_window: win,
          popout: false
        });
    });
  });

  it('calls zChat init with overrides when they\'re set within the embeddable config', async () => {
    const stagingState = {
      base: {
        embeddableConfig: {
          embeds: {
            zopimChat: {
              props: {
                overrideProxy: 'staging.example.com',
                overrideAuthServerHost: 'staging.auth.example.com'
              }
            }
          }
        }
      }
    };

    dispatchAction(stagingState);

    await wait(() => {
      expect(zChat.init)
        .toHaveBeenCalledWith({
          account_key: '123abc',
          activity_window: win,
          override_proxy: 'staging.example.com',
          override_auth_server_host: 'staging.auth.example.com',
          popout: false
        });
    });
  });

  it('calls zChat setOnFirstReady with the correct params', async () => {
    dispatchAction();

    await wait(() => {
      expect(zChat.setOnFirstReady)
        .toHaveBeenCalledWith({
          fetchHistory: expect.any(Function),
          ready: expect.any(Function)
        });
    });
  });

  describe('brands', () => {
    describe('when a brand exists', () => {
      it('calls zChat addTags with the current brand if it exists', async () => {
        dispatchAction();

        await wait(() => {
          expect(zChat.addTags)
            .toHaveBeenCalledWith(['ACME']);
        });
      });
    });

    describe('when a brand does not exist', () => {
      it('does not call zChat addTags', async () => {
        dispatchAction({
          base: {
            embeddableConfig: {
              brandCount: 1,
              brand: undefined
            }
          }
        });

        await wait(() => {
          expect(zChat.addTags)
            .not.toHaveBeenCalled();
        });
      });
    });
  });

  it('calls zopimApi handleZopimQueue with the window', async () => {
    dispatchAction();

    await wait(() => {
      expect(zopimApi.handleZopimQueue)
        .toHaveBeenCalledWith(win);
    });
  });

  it('calls zChat getFirehose', async () => {
    const mockListener = jest.fn();
    const on = jest.fn();

    zChat.getFirehose.mockClear().mockImplementation(() => ({ on }));

    firehoseListener.mockReturnValue(mockListener);

    dispatchAction();

    await wait(() => {
      expect(on)
        .toHaveBeenCalledWith('data', mockListener);
    });
  });

  describe('adding brand tag', () => {
    describe('with no jwtFn in settings', () => {
      it('calls zopimApi handleZopimQueue with the window', async () => {
        dispatchAction({
          base: {
            embeddableConfig: {
              brandCount: 2,
              brand: 'brand 1'
            }
          }
        });

        await wait(() => {
          expect(zChat.addTags)
            .toHaveBeenCalledWith(['brand 1']);
        });
      });
    });

    describe('with a jwtFn in settings', () => {
      beforeEach(() => {
        settings.getChatAuthSettings = () => ({ jwtFn: noop });
      });

      it('calls zopimApi handleZopimQueue with the window', async () => {
        dispatchAction({
          base: {
            embeddableConfig: {
              brandCount: 2,
              brand: 'brand 1'
            }
          }
        });

        await wait(() => {
          expect(zChat.addTags)
            .not.toHaveBeenCalled();
        });
      });
    });
  });
});
