let { mediator } = require('../mediator');

const c = mediator.channel;

const launcherUnreadMsgs = jest.fn();
const launcherUpdateSettings = jest.fn();
const chatRefreshLocale = jest.fn();
const webWidgetRefreshLocale = jest.fn();
const webWidgetUpdateSettings = jest.fn();
const webWidgetZopimChatStarted = jest.fn();
const webWidgetProactiveChat = jest.fn();
const webWidgetClearAttachments = jest.fn();

c.subscribe('launcher.setUnreadMsgs', launcherUnreadMsgs);
c.subscribe('launcher.updateSettings', launcherUpdateSettings);

c.subscribe('zopimChat.refreshLocale', chatRefreshLocale);

c.subscribe('webWidget.refreshLocale', webWidgetRefreshLocale);
c.subscribe('webWidget.updateSettings', webWidgetUpdateSettings);
c.subscribe('webWidget.zopimChatStarted', webWidgetZopimChatStarted);
c.subscribe('webWidget.proactiveChat', webWidgetProactiveChat);
c.subscribe('webWidget.clearAttachments', webWidgetClearAttachments);

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
