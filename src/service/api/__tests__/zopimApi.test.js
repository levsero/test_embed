import { zopimApi } from '../zopimApi';

jest.mock('src/service/api/apis');

import * as apis from 'src/service/api/apis';

const mockStore = {
  dispatch: jest.fn()
};

beforeEach(() => {
  zopimApi.setZopimExistsOnPage(false);
});

describe('handleZopimQueue', () => {
  it('calls queue item if it is function', () => {
    const methodSpy = jest.fn();

    zopimApi.handleZopimQueue([ methodSpy ]);

    expect(methodSpy)
      .toHaveBeenCalled();
  });

  it('throws an error if queue item is not function', () => {
    expect(() => {
      zopimApi.handleZopimQueue([ undefined ]);
    }).toThrowError('An error occurred in your use of the $zopim Widget API');
  });
});

describe('setupZopimQueue', () => {
  describe('when $zopim has not been defined on the window', () => {
    const mockWin = {};

    beforeEach(() => {
      zopimApi.setupZopimQueue(mockWin, []);
    });

    describe('creates a zopim global function with', () => {
      it('a queue', () => {
        expect(mockWin.$zopim._)
          .toEqual([]);
      });

      it('a set function', () => {
        expect(mockWin.$zopim.set)
          .toEqual(expect.any(Function));
      });

      it('a set function queue', () => {
        expect(mockWin.$zopim.set._)
          .toEqual([]);
      });
    });

    describe('when the $zopim global function is called', () => {
      beforeEach(() => {
        mockWin.$zopim('mockApiCall');
      });

      it('queues the call', () => {
        expect(mockWin.$zopim._)
          .toContain('mockApiCall');
      });
    });

    describe('when $zopim has already been defined on the window', () => {
      const mockWin = { $zopim: 'already defined!!' };

      beforeEach(() => {
        zopimApi.setupZopimQueue(mockWin, mockStore);
      });

      it('does not override $zopim on win', () => {
        expect(mockWin.$zopim)
          .toEqual('already defined!!');
      });
    });
  });

  describe('setUpZopimApiMethods', () => {
    const mockWin = {};

    beforeEach(() => {
      zopimApi.setUpZopimApiMethods(mockWin, mockStore);
    });

    describe('window', () => {
      test('toggle method', () => {
        mockWin.$zopim.livechat.window.toggle();

        expect(apis.toggleApi)
          .toHaveBeenCalled();
      });

      test('hide method', () => {
        mockWin.$zopim.livechat.window.hide();

        expect(apis.hideApi)
          .toHaveBeenCalled();
      });

      test('show method', () => {
        mockWin.$zopim.livechat.window.show();

        expect(apis.openApi)
          .toHaveBeenCalled();
      });

      test('getDisplay method', () => {
        mockWin.$zopim.livechat.window.getDisplay();

        expect(apis.displayApi)
          .toHaveBeenCalled();
      });
    });

    describe('button', () => {
      test('hide method', () => {
        mockWin.$zopim.livechat.button.hide();

        expect(apis.hideApi)
          .toHaveBeenCalled();
      });

      test('show method', () => {
        mockWin.$zopim.livechat.button.show();

        expect(apis.showApi)
          .toHaveBeenCalled();
        expect(apis.closeApi)
          .toHaveBeenCalled();
      });
    });

    test('hideAll method', () => {
      mockWin.$zopim.livechat.hideAll();

      expect(apis.hideApi)
        .toHaveBeenCalled();
    });

    test('set method', () => {
      mockWin.$zopim.livechat.set({ x: 1 });

      expect(apis.updateSettingsApi)
        .toHaveBeenCalledWith(mockStore, { x: 1 });
    });

    test('isChatting method', () => {
      mockWin.$zopim.livechat.isChatting();

      expect(apis.isChattingApi)
        .toHaveBeenCalled();
    });

    test('say method', () => {
      mockWin.$zopim.livechat.say('duran duran');

      expect(apis.sendChatMsgApi)
        .toHaveBeenCalledWith(mockStore, 'duran duran');
    });

    test('endChat method', () => {
      mockWin.$zopim.livechat.endChat();

      expect(apis.endChatApi)
        .toHaveBeenCalled();
    });

    describe('removeTags method', () => {
      let store;

      beforeEach(() => {
        zopimApi.setZopimExistsOnPage(false);
        store = {
          getState: () => ({
            settings: {
              chat: {
                tags: ['old', 'state', 'zopim']
              }
            }
          })
        };

        zopimApi.setUpZopimApiMethods(mockWin, store);
      });

      it('removes tags sent as parameter', () => {
        mockWin.$zopim.livechat.removeTags('zopim', 'another');

        expect(apis.updateSettingsApi)
          .toHaveBeenCalledWith(store, {
            webWidget: {
              chat: {
                tags: ['old', 'state']
              }
            }
          });
      });
    });

    describe('addTags method', () => {
      let store;

      beforeEach(() => {
        zopimApi.setZopimExistsOnPage(false);
        store = {
          getState: () => ({
            settings: {
              chat: {
                tags: ['old', 'state', 'zopim']
              }
            }
          })
        };

        zopimApi.setUpZopimApiMethods(mockWin, store);
      });

      it('adds tags sent as parameter', () => {
        mockWin.$zopim.livechat.addTags('zopim2', 'another');

        expect(apis.updateSettingsApi)
          .toHaveBeenCalledWith(store, {
            webWidget: {
              chat: {
                tags: ['old', 'state', 'zopim', 'zopim2', 'another']
              }
            }
          });
      });
    });
  });
});
