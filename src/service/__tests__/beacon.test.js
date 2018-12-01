import { beacon } from '../beacon';
import { store } from 'service/persistence';
import { http } from 'service/transport';
import { mediator } from 'service/mediator';
import { i18n } from 'service/i18n';
import * as pages from 'utility/pages';
import * as globals from 'utility/globals';

globals.navigator = {
  userAgent: 'myuseragent',
  language: 'th'
};

jest.mock('service/transport');

let oldDate;

beforeEach(() => {
  oldDate = Date.now;
  store.clear('session');
  store.clear();
  beacon.setConfig({
    reduceBlipping: false,
    throttleIdentify: false
  });
});

afterEach(() => {
  Date.now = oldDate;
});

test('identify', () => {
  i18n.getLocaleId = jest.fn(() => 12345);
  beacon.identify({
    name: 'hello',
    email: 'a@a.com'
  });

  expect(http.sendWithMeta)
    .toHaveBeenCalledWith(
      {
        method: 'GET',
        path: '/embeddable_identify',
        type: 'user',
        params: {
          user: {
            email: 'a@a.com',
            name: 'hello',
            localeId: 12345
          },
          userAgent: 'myuseragent'
        }
      }
    );
});

test('trackUserAction', () => {
  beacon.trackUserAction(
    'mycategory',
    'myaction',
    'mylabel',
    'myvalue'
  );

  expect(http.sendWithMeta)
    .toHaveBeenCalledWith(
      {
        method: 'GET',
        path: '/embeddable_blip',
        type: 'userAction',
        params: {
          channel: 'web_widget',
          userAction: {
            action: 'myaction',
            category: 'mycategory',
            label: 'mylabel',
            value: 'myvalue'
          }
        }
      }
    );
});

test('sendConfigLoadTime', () => {
  beacon.sendConfigLoadTime(100);

  expect(http.sendWithMeta)
    .toHaveBeenCalledWith({
      method: 'GET',
      path: '/embeddable_blip',
      type: 'performance',
      params: {
        performance: {
          configLoadTime: 100
        }
      }
    });
});

describe('init', () => {
  beforeEach(() => {
    beacon.init();
  });

  it('stores the current time in session storage', () => {
    expect(store.get('currentTime', 'session'))
      .not.toBeNull();
  });

  it('subscribes to beacon.identify', () => {
    i18n.getLocaleId = jest.fn(() => 12345);
    mediator.channel.broadcast('beacon.identify', {
      name: 'hello',
      email: 'a@a.com'
    });

    expect(http.sendWithMeta)
      .toHaveBeenCalledWith(
        {
          method: 'GET',
          path: '/embeddable_identify',
          type: 'user',
          params: {
            user: {
              email: 'a@a.com',
              name: 'hello',
              localeId: 12345
            },
            userAgent: 'myuseragent'
          }
        }
      );
  });

  it('subscribes to beacon.trackUserAction', () => {
    mediator.channel.broadcast('beacon.trackUserAction',
      'mycategory',
      'myaction',
      'mylabel',
      'myvalue'
    );

    expect(http.sendWithMeta)
      .toHaveBeenCalledWith(
        {
          method: 'GET',
          path: '/embeddable_blip',
          type: 'userAction',
          params: {
            channel: 'web_widget',
            userAction: {
              action: 'myaction',
              category: 'mycategory',
              label: 'mylabel',
              value: 'myvalue'
            }
          }
        }
      );
  });
});

describe('sendPageView', () => {
  describe('without referrer', () => {
    beforeEach(() => {
      Object.defineProperty(document, 'referrer', {
        value: '',
        configurable: true
      });
    });

    it('sends the expected payload', () => {
      document.title = 'hello world';
      document.t = 50;
      Date.now = jest.fn(() => 67);
      beacon.sendPageView();

      expect(http.sendWithMeta)
        .toHaveBeenCalledWith(
          ({
            method: 'GET',
            params: {
              pageView: {
                helpCenterDedup: false,
                pageTitle: 'hello world',
                referrer: 'http://localhost/',
                userAgent: 'myuseragent',
                loadTime: 17,
                navigatorLanguage: 'th',
                time: 0
              }
            },
            path: '/embeddable_blip',
            type: 'pageView'
          })
        );
    });

    it('sends difference between current time and sessionStorage currentTime as time', () => {
      Date.now = () => 100;
      store.set('currentTime', 88, 'session');
      beacon.sendPageView();

      expect(http.sendWithMeta)
        .toHaveBeenCalledWith(
          expect.objectContaining({
            params: {
              pageView: expect.objectContaining({
                time: 12
              })
            }
          })
        );
    });
  });

  describe('with referrer policy', () => {
    beforeEach(() => {
      Object.defineProperty(document, 'referrer', {
        value: 'http://www.example.com/path',
        configurable: true
      });
    });

    it('returns null when referrerPolicy specifies so', () => {
      store.set('referrerPolicy', 'same-origin', 'session');
      beacon.sendPageView();

      expect(http.sendWithMeta)
        .not.toHaveBeenCalledWith(
          expect.objectContaining({
            params: {
              pageView: expect.objectContaining({
                referrer: expect.stringContaining('http://www.example.com')
              })
            }
          })
        );
    });

    it('returns referrer origin when referrerPolicy specifies so', () => {
      store.set('referrerPolicy', 'strict-origin-when-cross-origin', 'session');
      beacon.sendPageView();

      expect(http.sendWithMeta)
        .toHaveBeenCalledWith(
          expect.objectContaining({
            params: {
              pageView: expect.objectContaining({
                referrer: 'http://www.example.com'
              })
            }
          })
        );
    });
  });

  describe('with different referrer', () => {
    beforeEach(() => {
      Object.defineProperty(document, 'referrer', {
        value: 'http://www.example.com/path',
        configurable: true
      });
    });

    it('sends the referrer', () => {
      beacon.sendPageView();

      expect(http.sendWithMeta)
        .toHaveBeenCalledWith(
          expect.objectContaining({
            params: {
              pageView: expect.objectContaining({
                referrer: 'http://www.example.com/path'
              })
            }
          })
        );
    });

    it('sets the initial time even if previous time already exists', () => {
      store.set('currentTime', 78, 'session');
      beacon.sendPageView();

      expect(http.sendWithMeta)
        .toHaveBeenCalledWith(
          expect.objectContaining({
            params: {
              pageView: expect.objectContaining({
                time: 0
              })
            }
          })
        );
    });
  });

  describe('with same referrer', () => {
    beforeEach(() => {
      Object.defineProperty(document, 'referrer', {
        value: 'http://localhost/path',
        configurable: true
      });
    });

    it('sends the referrer', () => {
      beacon.sendPageView();

      expect(http.sendWithMeta)
        .toHaveBeenCalledWith(
          expect.objectContaining({
            params: {
              pageView: expect.objectContaining({
                referrer: 'http://localhost/path'
              })
            }
          })
        );
    });

    it('sets the time duration', () => {
      store.set('currentTime', 78, 'session');
      Date.now = () => 100;
      beacon.sendPageView();

      expect(http.sendWithMeta)
        .toHaveBeenCalledWith(
          expect.objectContaining({
            params: {
              pageView: expect.objectContaining({
                time: 22
              })
            }
          })
        );
    });
  });

  it('sends helpCenterDedup as true when on HC', () => {
    pages.isOnHelpCenterPage = () => true;
    beacon.sendPageView();

    expect(http.sendWithMeta)
      .toHaveBeenCalledWith(
        expect.objectContaining({
          params: {
            pageView: expect.objectContaining({
              helpCenterDedup: true
            })
          }
        })
      );
  });

  it('does not send until page has loaded', (done) => {
    Object.defineProperty(document, 'readyState', {
      get() { return 'loading'; }
    });
    beacon.sendPageView();
    expect(http.sendWithMeta)
      .not.toHaveBeenCalled();
    document.dispatchEvent(new Event('DOMContentLoaded', {
      bubbles: true,
      cancelable: true
    }));
    setTimeout(() => {
      expect(http.sendWithMeta)
        .toHaveBeenCalled();
      done();
    }, 0);
  });
});

describe('trackSettings', () => {
  const settings = { webWidget: { viaId: 48 } };

  it('does not send anything when argument is empty', () => {
    beacon.trackSettings({});
    expect(http.sendWithMeta)
      .not.toHaveBeenCalled();
  });

  it('sends expected payload', () => {
    globals.win.zESettings = settings;
    beacon.trackSettings(settings);
    expect(http.sendWithMeta)
      .toHaveBeenCalledWith({
        callbacks: {
          done: expect.any(Function)
        },
        method: 'GET',
        path: '/embeddable_blip',
        type: 'settings',
        params: {
          settings: {
            webWidget: {
              viaId: 48
            }
          }
        }
      });
  });

  describe('multiple calls', () => {
    beforeEach(() => {
      globals.win.zESettings = settings;
      beacon.trackSettings(settings);
    });

    it('stores the settings in the store on success', () => {
      const success = http.sendWithMeta.mock.calls[0][0].callbacks.done;
      let stored = store.get('settings');

      expect(stored)
        .toBeNull();

      success();
      stored = store.get('settings');

      expect(stored)
        .not.toBeNull();
    });

    describe('next call', () => {
      beforeEach(() => {
        const success = http.sendWithMeta.mock.calls[0][0].callbacks.done;

        success();
        http.sendWithMeta.mockClear();
      });

      it('does not send another call again for the same setting', () => {
        beacon.trackSettings(settings);
        expect(http.sendWithMeta)
          .not.toHaveBeenCalled();
      });

      it('clears expired settings', () => {
        const previous = store.get('settings');

        previous.push(['expired', 0]);
        store.set('settings', previous);

        beacon.trackSettings(settings);
        const newSettings = store.get('settings');

        expect(newSettings.length)
          .toEqual(1);
        expect(newSettings[0][0])
          .not.toEqual('expired');
      });

      it('sends another call again for a new setting', () => {
        beacon.trackSettings({ webWidget: { viaId: 46 } });
        expect(http.sendWithMeta)
          .toHaveBeenCalled();
      });
    });
  });

  afterEach(() => {
    globals.win.zESettings = null;
  });
});

describe('setConfig', () => {
  it('does not send identify when throttleIdentify is true', () => {
    beacon.setConfig({ throttleIdentify: true });
    beacon.identify({ name: 'blah', email: 'a@b.com' });
    expect(http.sendWithMeta)
      .not.toHaveBeenCalled();
  });

  describe('reduceBlipping', () => {
    beforeEach(() => {
      beacon.setConfig({ reduceBlipping: true });
    });

    it('does not send trackUserAction', () => {
      beacon.trackUserAction('fasd', 'adsfsadf', 'afdasdf');
      expect(http.sendWithMeta)
        .not.toHaveBeenCalled();
    });

    it('does not send sendPageView', () => {
      beacon.sendPageView();
      expect(http.sendWithMeta)
        .not.toHaveBeenCalled();
    });

    it('does not send sendPageView', () => {
      beacon.sendConfigLoadTime(100);
      expect(http.sendWithMeta)
        .not.toHaveBeenCalled();
    });

    it('does not send trackSettings', () => {
      const settings = { webWidget: { viaId: 48 } };

      globals.win.zESettings = settings;
      beacon.trackSettings(settings);
      expect(http.sendWithMeta)
        .not.toHaveBeenCalled();
    });
  });
});
