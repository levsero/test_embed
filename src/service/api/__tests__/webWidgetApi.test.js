import { webWidgetApi as api  } from '../webWidgetApi';
import * as apis from 'service/api/apis';
import tracker from 'service/logging/tracker';
import { apiResetWidget } from 'src/redux/modules/base';
import { API_GET_IS_CHATTING_NAME } from 'constants/api';

jest.mock('service/api/apis');
jest.mock('service/logging/tracker');
jest.mock('src/redux/modules/base/base-selectors');
jest.mock('src/redux/modules/base');
jest.mock('src/service/renderer');
jest.mock('src/service/mediator');

const baseSelectors = require('src/redux/modules/base/base-selectors');

const mockStore = {
  dispatch: jest.fn(),
  getState: jest.fn()
};

describe('handleQueue', () => {
  describe('when the queue method is a function', () => {
    const queueSpy = jest.fn();

    beforeEach(() => {
      api.handleQueue(null, [ [ queueSpy ] ]);
    });

    it('calls the function in the queue', () => {
      expect(queueSpy)
        .toHaveBeenCalled();
    });
  });

  describe('when the queue method is a string', () => {
    beforeEach(() => {
      api.handleQueue(mockStore, [ ['webWidget', 'hide'] ]);
    });

    it('handles the api call', () => {
      expect(apis.hideApi)
        .toHaveBeenCalled();
    });

    it('tracks the call', () => {
      expect(tracker.track)
        .toHaveBeenCalledWith('webWidget.hide');
    });
  });
});

describe('setupWidgetQueue', () => {
  describe('win.zEmbed', () => {
    let win = { zEmbed: {} };

    beforeEach(() => {
      api.setupWidgetQueue(win, [], mockStore);
    });

    describe('when a function is passed into zEmbed', () => {
      const zEFunctionSpy = jest.fn();

      beforeEach(() => {
        win.zEmbed(zEFunctionSpy);
      });

      it('calls the function passed in', () => {
        expect(zEFunctionSpy)
          .toHaveBeenCalled();
      });
    });

    describe('when a string is passed into zEmbed', () => {
      beforeEach(() => {
        win.zEmbed('webWidget', 'hide');
      });

      it('handles the api call', () => {
        expect(apis.hideApi)
          .toHaveBeenCalled();
      });
    });
  });
});

describe('pre render methods', () => {
  const enqueue = (call) => {
    api.handleQueue(mockStore, [call]);
    api.handlePostRenderQueue({}, [], mockStore);
  };

  describe('when that call is hide', () => {
    beforeEach(() => {
      const call = ['webWidget', 'hide'];

      enqueue(call);
    });

    it('calls hideApi', () => {
      expect(apis.hideApi)
        .toHaveBeenCalled();
    });

    it('tracks the call', () => {
      expect(tracker.track)
        .toHaveBeenCalledWith('webWidget.hide');
    });
  });

  describe('when that call is show', () => {
    beforeEach(() => {
      const call = ['webWidget', 'show'];

      enqueue(call);
    });

    it('calls showApi', () => {
      expect(apis.showApi)
        .toHaveBeenCalled();
    });

    it('tracks the call', () => {
      expect(tracker.track)
        .toHaveBeenCalledWith('webWidget.show');
    });
  });

  describe('when that call is open', () => {
    beforeEach(() => {
      const call = ['webWidget', 'open'];

      enqueue(call);
    });

    it('calls openApi', () => {
      expect(apis.openApi)
        .toHaveBeenCalled();
    });

    it('tracks the call', () => {
      expect(tracker.track)
        .toHaveBeenCalledWith('webWidget.open');
    });
  });

  describe('when that call is close', () => {
    beforeEach(() => {
      const call = ['webWidget', 'close'];

      enqueue(call);
    });

    it('calls closeApi', () => {
      expect(apis.closeApi)
        .toHaveBeenCalled();
    });

    it('tracks the call', () => {
      expect(tracker.track)
        .toHaveBeenCalledWith('webWidget.close');
    });
  });

  describe('when that call is toggle', () => {
    beforeEach(() => {
      const call = ['webWidget', 'toggle'];

      enqueue(call);
    });

    it('calls toggleApi', () => {
      expect(apis.toggleApi)
        .toHaveBeenCalled();
    });

    it('tracks the call', () => {
      expect(tracker.track)
        .toHaveBeenCalledWith('webWidget.toggle');
    });
  });

  describe('when that call is setLocale', () => {
    beforeEach(() => {
      enqueue(['webWidget', 'setLocale', 'fr']);
    });

    it('calls i18n setLocale with the locale', () => {
      expect(apis.setLocaleApi)
        .toHaveBeenCalledWith(mockStore, 'fr');
    });

    it('tracks the call', () => {
      expect(tracker.track)
        .toHaveBeenCalledWith('webWidget.setLocale', 'fr');
    });
  });

  describe('when the call is clear', () => {
    beforeEach(() => {
      enqueue(['webWidget', 'clear']);
    });

    it('calls clearFormState', () => {
      expect(apis.clearFormState)
        .toHaveBeenCalled();
    });

    it('tracks the call', () => {
      expect(tracker.track)
        .toHaveBeenCalledWith('webWidget.clear');
    });
  });

  describe('when that call is reset', () => {
    describe('and getLauncherVisible is true', () => {
      beforeEach(() => {
        baseSelectors.getLauncherVisible = jest.fn(() => true);
        enqueue(['webWidget', 'reset']);
      });

      it('calls resetWidget', () => {
        expect(apiResetWidget)
          .toHaveBeenCalled();
      });
    });

    describe('and getLauncherVisible is false', () => {
      beforeEach(() => {
        baseSelectors.getLauncherVisible = jest.fn(() => false);
        enqueue(['webWidget', 'reset']);
      });

      it('does not call resetWidget', () => {
        expect(apiResetWidget)
          .not.toHaveBeenCalled();
      });
    });
  });

  describe('methods that get queued', () => {
    describe('when that call is identity', () => {
      const user = { email: 'a2b.c' };

      beforeEach(() => {
        enqueue(['webWidget', 'identify', user]);
      });

      it('calls mediator onIdentify with the user', () => {
        expect(apis.identifyApi)
          .toHaveBeenCalledWith(mockStore, user);
      });
    });

    describe('when that call is prefill', () => {
      const payload = {
        name: { value: 'Terence', readOnly: true },
        email: { value: 'a2b.c' }
      };

      beforeEach(() => {
        enqueue(['webWidget', 'prefill', payload]);
      });

      it('calls prefill api with the user', () => {
        expect(apis.prefill)
          .toHaveBeenCalledWith(mockStore, payload);
      });

      it('tracks the call', () => {
        expect(tracker.track)
          .toHaveBeenCalledWith('webWidget.prefill', payload);
      });
    });

    describe('when that call is updateSettings', () => {
      const settings = { webWidget: { color: '#fff' } };

      beforeEach(() => {
        enqueue(['webWidget', 'updateSettings', settings]);
      });

      it('calls updateSettings with the settings', () => {
        expect(apis.updateSettingsApi)
          .toHaveBeenCalledWith(mockStore, settings);
      });

      it('tracks the call', () => {
        expect(tracker.track)
          .toHaveBeenCalledWith('webWidget.updateSettings', settings);
      });
    });

    describe('when that call is logout', () => {
      beforeEach(() => {
        enqueue(['webWidget', 'logout']);
      });

      it('calls logout', () => {
        expect(apis.logoutApi)
          .toHaveBeenCalled();
      });

      it('tracks the call', () => {
        expect(tracker.track)
          .toHaveBeenCalledWith('webWidget.logout');
      });
    });

    describe('when that call is setHelpCenterSuggestions', () => {
      const options = { url: true };

      beforeEach(() => {
        enqueue(['webWidget', 'helpCenter:setSuggestions', options]);
      });

      it('calls setHelpCenterSuggestions with the options', () => {
        expect(apis.setHelpCenterSuggestionsApi)
          .toHaveBeenCalledWith(mockStore, options);
      });

      it('tracks the call', () => {
        expect(tracker.track)
          .toHaveBeenCalledWith('webWidget.helpCenter:setSuggestions', options);
      });
    });

    describe('when that call is updatePath', () => {
      const options = { title: 'payments', url: 'https://zd.com#payments' };

      beforeEach(() => {
        enqueue(['webWidget', 'updatePath', options]);
      });

      it('calls updatePathApi with the options', () => {
        expect(apis.updatePathApi)
          .toHaveBeenCalledWith(mockStore, options);
      });

      it('tracks the call', () => {
        expect(tracker.track)
          .toHaveBeenCalledWith('webWidget.updatePath', options);
      });
    });
  });
});

describe('post render methods', () => {
  let result;
  let win = { zEmbed: {} };

  const callAfterRender = (call) => {
    api.setupWidgetQueue(win, [], mockStore);
    result = win.zEmbed(...call);
  };

  describe('when that call is hide', () => {
    beforeEach(() => {
      callAfterRender(['webWidget', 'hide']);
    });

    it('calls hideApi', () => {
      expect(apis.hideApi)
        .toHaveBeenCalled();
    });

    it('tracks the call', () => {
      expect(tracker.track)
        .toHaveBeenCalledWith('webWidget.hide');
    });
  });

  describe('when that call is show', () => {
    beforeEach(() => {
      callAfterRender(['webWidget', 'show']);
    });

    it('calls showApi', () => {
      expect(apis.showApi)
        .toHaveBeenCalled();
    });

    it('tracks the call', () => {
      expect(tracker.track)
        .toHaveBeenCalledWith('webWidget.show');
    });
  });

  describe('when that call is open', () => {
    beforeEach(() => {
      callAfterRender(['webWidget', 'open']);
    });

    it('calls openApi', () => {
      expect(apis.openApi)
        .toHaveBeenCalled();
    });

    it('tracks the call', () => {
      expect(tracker.track)
        .toHaveBeenCalledWith('webWidget.open');
    });
  });

  describe('when that call is close', () => {
    beforeEach(() => {
      callAfterRender(['webWidget', 'close']);
    });

    it('calls close', () => {
      expect(apis.closeApi)
        .toHaveBeenCalled();
    });

    it('tracks the call', () => {
      expect(tracker.track)
        .toHaveBeenCalledWith('webWidget.close');
    });
  });

  describe('when that call is toggle', () => {
    beforeEach(() => {
      callAfterRender(['webWidget', 'toggle']);
    });

    it('calls toggleApi', () => {
      expect(apis.toggleApi)
        .toHaveBeenCalled();
    });

    it('tracks the call', () => {
      expect(tracker.track)
        .toHaveBeenCalledWith('webWidget.toggle');
    });
  });

  describe('when that call is reset', () => {
    describe('and getLauncherVisible is true', () => {
      it('calls resetWidget', () => {
        baseSelectors.getLauncherVisible = jest.fn(() => true);
        callAfterRender(['webWidget', 'reset']);
        expect(apiResetWidget).toHaveBeenCalled();
      });
    });

    describe('and getLauncherVisible is false', () => {
      it('does not call resetWidget', () => {
        baseSelectors.getLauncherVisible = jest.fn(() => false);
        callAfterRender(['webWidget', 'reset']);
        expect(apiResetWidget).not.toHaveBeenCalled();
      });
    });
  });

  describe('when that call is setLocale', () => {
    beforeEach(() => {
      callAfterRender(['webWidget', 'setLocale', 'fr']);
    });

    it('calls i18n setLocale with the locale', () => {
      expect(apis.setLocaleApi)
        .toHaveBeenCalledWith(mockStore, 'fr');
    });

    it('tracks the call', () => {
      expect(tracker.track)
        .toHaveBeenCalledWith('webWidget.setLocale', 'fr');
    });
  });

  describe('when that call is identify', () => {
    const user = { email: 'a2b.c' };

    beforeEach(() => {
      callAfterRender(['webWidget', 'identify', user]);
    });

    it('calls mediator onIdentify with the user', () => {
      expect(apis.identifyApi)
        .toHaveBeenCalledWith(mockStore, user);
    });
  });

  describe('when that call is prefill', () => {
    const payload = {
      name: { value: 'T-bone', readOnly: true },
      email: { value: 'a2b.c' }
    };

    beforeEach(() => {
      callAfterRender(['webWidget', 'prefill', payload]);
    });

    it('calls prefill api with the user', () => {
      expect(apis.prefill)
        .toHaveBeenCalledWith(mockStore, payload);
    });

    it('tracks the call', () => {
      expect(tracker.track)
        .toHaveBeenCalledWith('webWidget.prefill', payload);
    });
  });

  describe('when that call is updateSettings', () => {
    const settings = { webWidget: { color: '#fff' } };

    beforeEach(() => {
      callAfterRender(['webWidget', 'updateSettings', settings]);
    });

    it('calls updateSettings with the settings', () => {
      expect(apis.updateSettingsApi)
        .toHaveBeenCalledWith(mockStore, settings);
    });

    it('tracks the call', () => {
      expect(tracker.track)
        .toHaveBeenCalledWith('webWidget.updateSettings', settings);
    });
  });

  describe('when that call is logout', () => {
    beforeEach(() => {
      callAfterRender(['webWidget', 'logout']);
    });

    it('calls logout', () => {
      expect(apis.logoutApi)
        .toHaveBeenCalled();
    });

    it('tracks the call', () => {
      expect(tracker.track)
        .toHaveBeenCalledWith('webWidget.logout');
    });
  });

  describe('when that call is setHelpCenterSuggestions', () => {
    const options = { url: true };

    beforeEach(() => {
      callAfterRender(['webWidget', 'helpCenter:setSuggestions', options]);
    });

    it('calls setHelpCenterSuggestions with the options', () => {
      expect(apis.setHelpCenterSuggestionsApi)
        .toHaveBeenCalledWith(mockStore, options);
    });

    it('tracks the call', () => {
      expect(tracker.track)
        .toHaveBeenCalledWith('webWidget.helpCenter:setSuggestions', options);
    });
  });

  describe('when that call is updatePath', () => {
    const options = { title: 'payments', url: 'https://zd.com#payments' };

    beforeEach(() => {
      callAfterRender(['webWidget', 'updatePath', options]);
    });

    it('calls updatePath with the options', () => {
      expect(apis.updatePathApi)
        .toHaveBeenCalledWith(mockStore, options);
    });

    it('tracks the call', () => {
      expect(tracker.track)
        .toHaveBeenCalledWith('webWidget.updatePath', options);
    });
  });

  describe('when that call is endChat', () => {
    beforeEach(() => {
      callAfterRender(['webWidget', 'chat:end']);
    });

    it('calls endChat with the options', () => {
      expect(apis.endChatApi)
        .toHaveBeenCalled();
    });

    it('tracks the call', () => {
      expect(tracker.track)
        .toHaveBeenCalledWith('webWidget.chat:end');
    });
  });

  describe('when that call is sendChatMsg', () => {
    beforeEach(() => {
      callAfterRender(['webWidget', 'chat:send']);
    });

    it('calls sendMsg with the options', () => {
      expect(apis.sendChatMsgApi)
        .toHaveBeenCalled();
    });

    it('tracks the call', () => {
      expect(tracker.track)
        .toHaveBeenCalledWith('webWidget.chat:send');
    });
  });

  describe('when that call is on', () => {
    beforeEach(() => {
      callAfterRender(['webWidget:on', 'close', () => {}]);
    });

    it('tracks the call', () => {
      expect(tracker.track)
        .toHaveBeenCalledWith('webWidget:on.close', expect.any(Function));
    });
  });

  describe('when that call is get', () => {
    describe('when the param is part of the allowList', () => {
      beforeEach(() => {
        apis.isChattingApi.mockReturnValue('1234');
        callAfterRender(['webWidget:get', `chat:${API_GET_IS_CHATTING_NAME}`]);
      });

      it('calls isChattingApi', () => {
        expect(apis.isChattingApi)
          .toHaveBeenCalled();
      });

      it('returns the expected value', () => {
        expect(result)
          .toEqual('1234');
      });

      it('tracks the call', () => {
        expect(tracker.track)
          .toHaveBeenCalledWith(`webWidget:get.chat:${API_GET_IS_CHATTING_NAME}`);
      });
    });

    describe('when the param is not part of the allowList', () => {
      beforeEach(() => {
        callAfterRender(['webWidget:get', 'something else']);
      });

      it('returns undefined', () => {
        expect(result)
          .toBe(undefined);
      });
    });
  });
});

describe('legacy apis', () => {
  let win = { zE: {} };
  const user = {
    name: 'Jane Doe',
    email: 'a@b.c'
  };

  beforeEach(() => {
    api.setupWidgetApi(win, mockStore);
  });

  describe('zE.identify', () => {
    beforeEach(() => {
      win.zE.identify(user);
    });

    it('calls tracker on win.zE', () => {
      expect(tracker.addTo)
        .toHaveBeenCalledWith(win.zE, 'zE');
    });

    it('calls handlePrefillReceived with the formatted user object', () => {
      const expected = {
        name: { value: 'Jane Doe' },
        email: { value: 'a@b.c' }
      };

      expect(apis.prefill)
        .toHaveBeenCalledWith(mockStore, expected);
    });
  });
});
