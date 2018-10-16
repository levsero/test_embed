describe('mediator', () => {
  let mediator,
    c,
    beaconSub,
    launcherSub,
    webWidgetSub,
    chatSub,
    mockEmailValid,
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
      ['setUnreadMsgs']
    );

    chatSub = jasmine.createSpyObj(
      'chat',
      ['show', 'hide', 'setUser', 'refreshLocale', 'activate']
    );

    webWidgetSub = jasmine.createSpyObj(
      'webWidget',
      ['refreshLocale', 'zopimChatStarted', 'proactiveChat']
    );

    initSubscriptionSpies = function(names) {
      c.subscribe(`${names.beacon}.identify`, beaconSub.identify);

      c.subscribe(`${names.launcher}.setUnreadMsgs`, launcherSub.setUnreadMsgs);

      c.subscribe(`${names.chat}.show`, chatSub.show);
      c.subscribe(`${names.chat}.hide`, chatSub.hide);
      c.subscribe(`${names.chat}.activate`, chatSub.activate);
      c.subscribe(`${names.chat}.setUser`, chatSub.setUser);
      c.subscribe(`${names.chat}.refreshLocale`, chatSub.refreshLocale);

      c.subscribe(`${names.webWidget}.refreshLocale`, webWidgetSub.refreshLocale);
      c.subscribe(`${names.webWidget}.zopimChatStarted`, webWidgetSub.zopimChatStarted);
      c.subscribe(`${names.webWidget}.proactiveChat`, webWidgetSub.proactiveChat);
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
    });

    describe('when email is valid', () => {
      let params;

      beforeEach(() => {
        params = {
          name: 'James Dean',
          email: 'james@dean.com'
        };

        mockEmailValid = true;

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
      let params;

      beforeEach(() => {
        spyOn(console, 'warn');

        params = {
          name: 'James Dean',
          email: 'james@dean'
        };

        mockEmailValid = false;

        c.broadcast('.onIdentify', params);
      });

      it('should not broadcast beacon.identify with given params', () => {
        expect(beaconSub.identify)
          .not.toHaveBeenCalled();
      });

      it('should show a warning', () => {
        expect(console.warn) // eslint-disable-line no-console
          .toHaveBeenCalled();
      });

      describe('when name is valid', () => {
        it('should broadcast chat.setUser with name', () => {
          expect(chatSub.setUser)
            .toHaveBeenCalledWith({ name: params.name });
        });
      });

      describe('when name is invalid', () => {
        beforeEach(() => {
          params = {
            name: undefined,
            email: 'james@dean'
          };

          mockEmailValid = false;
          reset(chatSub.setUser);

          c.broadcast('.onIdentify', params);
        });

        it('should not broadcast chat.setUser', () => {
          expect(chatSub.setUser)
            .not.toHaveBeenCalled();
        });
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
