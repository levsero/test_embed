let { mediator } = require('../mediator');

const c = mediator.channel;

const identify = jest.fn();
const launcherUnreadMsgs = jest.fn();
const launcherUpdateSettings = jest.fn();
const chatRefreshLocale = jest.fn();
const chatSetUser = jest.fn();
const webWidgetRefreshLocale = jest.fn();
const webWidgetUpdateSettings = jest.fn();
const webWidgetZopimChatStarted = jest.fn();
const webWidgetProactiveChat = jest.fn();
const webWidgetClearAttachments = jest.fn();

c.subscribe('beacon.identify', identify);

c.subscribe('launcher.setUnreadMsgs', launcherUnreadMsgs);
c.subscribe('launcher.updateSettings', launcherUpdateSettings);

c.subscribe('zopimChat.setUser', chatSetUser);
c.subscribe('zopimChat.refreshLocale', chatRefreshLocale);

c.subscribe('webWidget.refreshLocale', webWidgetRefreshLocale);
c.subscribe('webWidget.updateSettings', webWidgetUpdateSettings);
c.subscribe('webWidget.zopimChatStarted', webWidgetZopimChatStarted);
c.subscribe('webWidget.proactiveChat', webWidgetProactiveChat);
c.subscribe('webWidget.clearAttachments', webWidgetClearAttachments);

describe('.onIdentify', () => {
  beforeEach(() => {
    mediator.init();
  });

  describe('when valid', () => {
    let params;

    beforeEach(() => {
      params = {
        name: 'James Dean',
        email: 'james@dean.com'
      };

      c.broadcast('.onIdentify', params);
    });

    it('calls identify and chatSetUser', () => {
      expect(identify)
        .toHaveBeenCalledWith(params);
      expect(chatSetUser)
        .toHaveBeenCalledWith(params);
    });
  });

  describe('when email is invalid', () => {
    let params,
      warn = jest.fn();

    beforeEach(() => {
      params = {
        name: 'James Dean',
        email: 'james@dean'
      };

      console.warn = warn; // eslint-disable-line no-console

      c.broadcast('.onIdentify', params);
    });

    it('does not call identify', () => {
      expect(identify)
        .not.toHaveBeenCalled();
    });

    it('prints a warning', () => {
      expect(warn)
        .toHaveBeenCalledWith('invalid email passed into zE.identify', params.email);
    });

    it('calls chatSetUser', () => {
      expect(chatSetUser)
        .toHaveBeenCalledWith(params);
    });
  });

  describe('when name is invalid', () => {
    let params,
      warn = jest.fn();

    beforeEach(() => {
      params = {
        name: undefined,
        email: 'james@dean.com'
      };

      console.warn = warn; // eslint-disable-line no-console

      c.broadcast('.onIdentify', params);
    });

    it('does not call identify', () => {
      expect(identify)
        .not.toHaveBeenCalled();
    });

    it('prints a warning', () => {
      expect(warn)
        .toHaveBeenCalledWith('invalid name passed into zE.identify', params.name);
    });

    it('calls chatSetUser', () => {
      expect(chatSetUser)
        .toHaveBeenCalledWith(params);
    });
  });

  describe('when both are invalid', () => {
    let params,
      warn = jest.fn();

    beforeEach(() => {
      params = {
        name: undefined,
        email: undefined
      };

      console.warn = warn; // eslint-disable-line no-console

      c.broadcast('.onIdentify', params);
    });

    it('does not call identify', () => {
      expect(identify)
        .not.toHaveBeenCalled();
    });

    it('prints a warning', () => {
      expect(warn)
        .toHaveBeenCalledWith('invalid params passed into zE.identify', params);
    });

    it('does not call chatSetUser', () => {
      expect(chatSetUser)
        .not.toHaveBeenCalledWith(params);
    });
  });
});

describe('.onSetLocale', () => {
  beforeEach(() => {
    mediator.init();

    c.broadcast('.onSetLocale');
  });

  it('broadcasts zopimChat.refreshLocale', () => {
    expect(chatRefreshLocale)
      .toHaveBeenCalled();
  });
});

describe('.onUpdateSettings', () => {
  beforeEach(() => {
    mediator.init();

    c.broadcast('.onUpdateSettings');
  });

  it('broadcasts webWidget.updateSettings', () => {
    expect(webWidgetUpdateSettings)
      .toHaveBeenCalled();
  });

  it('broadcasts launcher.updateSettings', () => {
    expect(launcherUpdateSettings)
      .toHaveBeenCalled();
  });
});

describe('.clear', () => {
  beforeEach(() => {
    mediator.init();

    c.broadcast('.clear');
  });

  it('broadcasts webWidget.clearAttachments', () => {
    expect(webWidgetClearAttachments)
      .toHaveBeenCalled();
  });
});

describe('naked zopim', () => {
  const chatShow = jest.fn();
  const chatHide = jest.fn();
  const chatActivate = jest.fn();
  let c;

  beforeEach(() => {
    jest.resetModules();
    mediator = require('../mediator').mediator;

    c = mediator.channel;
    c.subscribe('zopimChat.show', chatShow);
    c.subscribe('zopimChat.hide', chatHide);
    c.subscribe('zopimChat.activate', chatActivate);
    mediator.initZopimStandalone();
  });

  it('hides when a call to zE.hide() is made', () => {
    c.broadcast('.hide');

    expect(chatHide)
      .toHaveBeenCalled();
  });

  it('shows when a call to zE.show() is made', () => {
    c.broadcast('.show');

    expect(chatShow)
      .toHaveBeenCalled();
  });

  it('activates when a call to zE.activate() is made', () => {
    c.broadcast('.activate');

    expect(chatActivate)
      .toHaveBeenCalled();
  });
});
