describe('mediator', () => {
  let mediator,
    c,
    beaconSub,
    launcherSub,
    webWidgetSub,
    chatSub,
    mockEmailValid,
    mockIsString,
    initSubscriptionSpies;

  const reset = function(spy) {
    spy.calls.reset();
  };
  const mediatorPath = buildSrcPath('service/mediator');

  beforeEach(() => {
    mockery.enable();

    initMockRegistry({
      'src/redux/modules/chat': {
        proactiveMessageRecieved: jasmine.createSpy().and.returnValue(false)
      },
      'src/redux/modules/zopimChat': {
        zopimProactiveMessageRecieved: jasmine.createSpy().and.returnValue(false)
      },
      'utility/utils': {
        emailValid: () => mockEmailValid
      },
      'utility/devices': {
        isMobileBrowser: () => false
      },
      'lodash': {
        isString: () => mockIsString
      },
      'src/util/utils': {

      }
    });

    mediator = requireUncached(mediatorPath).mediator;

    c = mediator.channel;

    beaconSub = jasmine.createSpyObj(
      'beacon',
      ['identify']
    );

    launcherSub = jasmine.createSpyObj(
      'launcher',
      ['setUnreadMsgs', 'updateSettings']
    );

    chatSub = jasmine.createSpyObj(
      'chat',
      ['show', 'hide', 'setUser', 'refreshLocale', 'activate']
    );

    webWidgetSub = jasmine.createSpyObj(
      'webWidget',
      ['refreshLocale', 'zopimChatStarted', 'proactiveChat', 'updateSettings', 'clearAttachments']
    );

    initSubscriptionSpies = function(names) {
      c.subscribe(`${names.beacon}.identify`, beaconSub.identify);

      c.subscribe(`${names.launcher}.setUnreadMsgs`, launcherSub.setUnreadMsgs);
      c.subscribe(`${names.launcher}.updateSettings`, launcherSub.updateSettings);

      c.subscribe(`${names.chat}.show`, chatSub.show);
      c.subscribe(`${names.chat}.hide`, chatSub.hide);
      c.subscribe(`${names.chat}.activate`, chatSub.activate);
      c.subscribe(`${names.chat}.setUser`, chatSub.setUser);
      c.subscribe(`${names.chat}.refreshLocale`, chatSub.refreshLocale);

      c.subscribe(`${names.webWidget}.refreshLocale`, webWidgetSub.refreshLocale);
      c.subscribe(`${names.webWidget}.updateSettings`, webWidgetSub.updateSettings);
      c.subscribe(`${names.webWidget}.zopimChatStarted`, webWidgetSub.zopimChatStarted);
      c.subscribe(`${names.webWidget}.proactiveChat`, webWidgetSub.proactiveChat);
      c.subscribe(`${names.webWidget}.clearAttachments`, webWidgetSub.clearAttachments);
    };
  });

  afterEach(() => {
    jasmine.clock().uninstall();
    mockery.deregisterAll();
    mockery.disable();
  });

  /* ****************************************** *
  *                  IDENTIFY                  *
  * ****************************************** */

  describe('.onIdentify', () => {
    let params;

    const submitTicket = 'ticketSubmissionForm';
    const chat = 'zopimChat';
    const beacon = 'beacon';

    const names = {
      submitTicket,
      chat,
      beacon
    };

    beforeEach(() => {
      initSubscriptionSpies(names);
      mediator.init({ submitTicket: true, helpCenter: false });
      spyOn(console, 'warn');
    });

    describe('when email and name are valid', () => {
      let params;

      beforeEach(() => {
        params = {
          name: 'James Dean',
          email: 'james@dean.com'
        };

        mockEmailValid = true;
        mockIsString = true;

        c.broadcast('.onIdentify', params);
      });

      it('should broadcast beacon.identify with given params', () => {
        expect(beaconSub.identify)
          .toHaveBeenCalledWith(params);
      });

      it('should broadcast chat.setUser with given params', () => {
        expect(chatSub.setUser)
          .toHaveBeenCalledWith(params);
      });
    });

    describe('when email is invalid', () => {
      beforeEach(() => {
        params = {
          name: 'James Dean',
          email: 'james@dean'
        };

        mockEmailValid = false;
        mockIsString = true;

        c.broadcast('.onIdentify', params);
      });

      it('does not not broadcast beacon.identify', () => {
        expect(beaconSub.identify)
          .not.toHaveBeenCalled();
      });

      it('shows a warning with "invalid email passed into zE.identify"', () => {
        expect(console.warn) // eslint-disable-line no-console
          .toHaveBeenCalledWith('invalid email passed into zE.identify', params.email);
      });

      it('broadcasts chat.setUser', () => {
        expect(chatSub.setUser)
          .toHaveBeenCalled();
      });
    });

    describe('when name is invalid', () => {
      beforeEach(() => {
        params = {
          name: undefined,
          email: 'james@dean.com'
        };

        mockIsString = false;
        mockEmailValid = true;
        reset(chatSub.setUser);

        c.broadcast('.onIdentify', params);
      });

      it('does not broadcast beacon.identify', () => {
        expect(beaconSub.identify)
          .not.toHaveBeenCalled();
      });

      it('shows a warning with "invalid name passed into zE.identify"', () => {
        expect(console.warn) // eslint-disable-line no-console
          .toHaveBeenCalledWith('invalid name passed into zE.identify', params.name);
      });

      it('broadcasts chat.setUser', () => {
        expect(chatSub.setUser)
          .toHaveBeenCalled();
      });
    });

    describe('when both are invalid', () => {
      beforeEach(() => {
        params = {
          name: null,
          email: null
        };

        mockEmailValid = false;
        mockIsString = false;
        reset(chatSub.setUser);

        c.broadcast('.onIdentify', params);
      });

      it('does not broadcast beacon.identify', () => {
        expect(beaconSub.identify)
          .not.toHaveBeenCalled();
      });

      it('show a warning with "invalid params passed into zE.identify"', () => {
        expect(console.warn) // eslint-disable-line no-console
          .toHaveBeenCalledWith('invalid params passed into zE.identify', params);
      });

      it('broadcasts chat.setUser', () => {
        expect(chatSub.setUser)
          .not.toHaveBeenCalled();
      });
    });
  });

  /* ****************************************** *
  *                 SET LOCALE                 *
  * ****************************************** */

  describe('.onSetLocale', () => {
    const launcher = 'launcher';
    const submitTicket = 'ticketSubmissionForm';
    const helpCenter = 'helpCenterForm';
    const chat = 'zopimChat';
    const names = {
      launcher: launcher,
      submitTicket: submitTicket,
      helpCenter: helpCenter,
      chat: chat
    };

    beforeEach(() => {
      initSubscriptionSpies(names);
      mediator.init({ submitTicket: true, helpCenter: false });

      c.broadcast('.onSetLocale');
    });

    it('should broadcast zopimChat.refreshLocale', () => {
      expect(chatSub.refreshLocale)
        .toHaveBeenCalled();
    });
  });

  /* ****************************************** *
  *                 ON UPDATE SETTINGS         *
  * ****************************************** */

  describe('.onUpdateSettings', () => {
    const launcher = 'launcher';
    const webWidget = 'webWidget';
    const names = {
      launcher,
      webWidget
    };

    beforeEach(() => {
      initSubscriptionSpies(names);
      mediator.init({ submitTicket: true, helpCenter: false });

      c.broadcast('.onUpdateSettings');
    });

    it('should broadcast webWidget.updateSettings', () => {
      expect(webWidgetSub.updateSettings)
        .toHaveBeenCalled();
    });

    it('should broadcast launcher.updateSettings', () => {
      expect(launcherSub.updateSettings)
        .toHaveBeenCalled();
    });
  });

  /* ****************************************** *
  *                  CLEAR API                  *
  * ****************************************** */

  describe('.clear', () => {
    const launcher = 'launcher';
    const webWidget = 'webWidget';
    const names = {
      launcher,
      webWidget
    };

    beforeEach(() => {
      initSubscriptionSpies(names);
      mediator.init({ submitTicket: true, helpCenter: true });

      c.broadcast('.clear');
    });

    it('broadcasts webWidget.clearAttachments', () => {
      expect(webWidgetSub.clearAttachments)
        .toHaveBeenCalled();
    });
  });

  /* ****************************************** *
  *                 NAKED ZOPIM                *
  * ****************************************** */

  describe('naked zopim', () => {
    describe('launcher final state depends on chat', () => {
      const launcher = 'launcher';
      const chat = 'zopimChat';
      const names = {
        launcher: launcher,
        chat: chat
      };

      beforeEach(() => {
        initSubscriptionSpies(names);
      });

      describe('should use zE hide, show, and activate methods as an alias for zopim show / hide functionality', () => {
        beforeEach(() => {
          mediator.initZopimStandalone();
        });

        it('should hide when a call to zE.hide() is made', () => {
          c.broadcast('.hide');

          expect(chatSub.hide.calls.count())
            .toEqual(1);
        });

        it('should show when a call to zE.show() is made', () => {
          c.broadcast('.show');

          expect(chatSub.show.calls.count())
            .toEqual(1);
        });

        it('should activate when a call to zE.activate() is made', () => {
          c.broadcast('.activate');

          expect(chatSub.activate.calls.count())
            .toEqual(1);
        });
      });
    });
  });
});
