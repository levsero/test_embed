import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import { getModifiedState } from 'src/fixtures/selectors-test-state';
import { wait } from 'react-testing-library';

import { setUpChat } from '../setUpChat';
import { win } from 'utility/globals';
import zopimApi from 'service/api/zopimApi';
import * as zChat from 'chat-web-sdk';
import slider from 'react-slick';

jest.mock('react-slick');
jest.mock('chat-web-sdk');
jest.mock('service/api/zopimApi');

zChat.getFirehose.mockImplementation(() => ({ on: jest.fn() }));

const dispatchAction = () => {
  const mockStore = configureMockStore([thunk]);
  const store = mockStore(getModifiedState());

  store.dispatch(setUpChat());

  return store;
};

describe('setupChat', () => {
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

  it('calls zChat setOnFirstReady with the correct params', async () => {
    dispatchAction();

    await wait(() => {
      expect(zChat.setOnFirstReady)
        .toHaveBeenCalledWith({
          fetchHistory: expect.any(Function)
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
    dispatchAction();

    await wait(() => {
      expect(zChat.getFirehose)
        .toHaveBeenCalled();
    });
  });
});
