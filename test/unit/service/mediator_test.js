describe('mediator', () => {
  let mockRegistry,
    mediator,
    c,
    authenticationSub,
    beaconSub,
    launcherSub,
    webWidgetSub,
    submitTicketSub,
    chatSub,
    helpCenterSub,
    talkSub,
    mockChatSuppressedValue,
    mockHelpCenterSuppressedValue,
    mockContactFormSuppressedValue,
    mockTalkSuppressedValue,
    mockOnHelpCenterPageValue,
    mockPositionValue,
    mockEmailValid,
    initSubscriptionSpies;

  const reset = function(spy) {
    spy.calls.reset();
  };
  const mediatorPath = buildSrcPath('service/mediator');

  beforeEach(() => {
    mockery.enable();

    mockChatSuppressedValue = false;
    mockHelpCenterSuppressedValue = false;
    mockContactFormSuppressedValue = false;
    mockTalkSuppressedValue = false;
    mockOnHelpCenterPageValue = false;
    mockPositionValue = { horizontal: 'right', vertical: 'bottom' };

    mockRegistry = initMockRegistry({
      'service/settings': {
        settings : {
          get: (value) => {
            return _.get({
              chat: { suppress: mockChatSuppressedValue },
              helpCenter: { suppress: mockHelpCenterSuppressedValue },
              contactForm: { suppress: mockContactFormSuppressedValue },
              talk: { suppress: mockTalkSuppressedValue },
              position: mockPositionValue
            }, value, null);
          }
        }
      },
      'utility/devices': {
        isMobileBrowser: jasmine.createSpy().and.returnValue(false)
      },
      'utility/scrollHacks': jasmine.createSpyObj(
        'scrollHacks',
        ['setScrollKiller',
         'setWindowScroll',
         'revertWindowScroll']
      ),
      'utility/pages': {
        isOnHelpCenterPage: () => {
          return mockOnHelpCenterPageValue;
        }
      },
      'utility/utils': {
        emailValid: () => mockEmailValid
      }
    });

    mediator = requireUncached(mediatorPath).mediator;

    c = mediator.channel;

    authenticationSub = jasmine.createSpyObj(
      'authentication',
      ['logout',
       'renew']
    );

    beaconSub = jasmine.createSpyObj(
      'beacon',
      ['identify', 'trackUserAction']
    );

    launcherSub = jasmine.createSpyObj(
      'launcher',
      ['hide',
       'show',
       'setUnreadMsgs',
       'refreshLocale']
    );

    submitTicketSub = jasmine.createSpyObj(
      'submitTicket',
      ['hide',
       'update',
       'refreshLocale']
    );

    chatSub = jasmine.createSpyObj(
      'chat',
      ['show',
       'showWithAnimation',
       'hide',
       'activate',
       'setUser',
       'refreshLocale']
    );

    helpCenterSub = jasmine.createSpyObj(
      'helpCenter',
      ['hide']
    );

    talkSub = jasmine.createSpyObj(
      'talk',
      ['show',
      'hide']
    );

    webWidgetSub = jasmine.createSpyObj(
      'webWidget',
      ['show',
       'hide',
       'update',
       'refreshLocale',
       'zopimChatStarted',
       'zopimChatEnded']
    );

    initSubscriptionSpies = function(names) {
      c.subscribe(`${names.beacon}.identify`, beaconSub.identify);
      c.subscribe(`${names.beacon}.trackUserAction`, beaconSub.trackUserAction);

      c.subscribe(`${names.authentication}.logout`, authenticationSub.logout);
      c.subscribe(`${names.authentication}.renew`, authenticationSub.renew);

      c.subscribe(`${names.launcher}.hide`, launcherSub.hide);
      c.subscribe(`${names.launcher}.show`, launcherSub.show);
      c.subscribe(`${names.launcher}.setUnreadMsgs`, launcherSub.setUnreadMsgs);
      c.subscribe(`${names.launcher}.refreshLocale`, launcherSub.refreshLocale);

      c.subscribe(`${names.submitTicket}.hide`, submitTicketSub.hide);
      c.subscribe(`${names.submitTicket}.update`, submitTicketSub.update);

      c.subscribe(`${names.chat}.show`, chatSub.show);
      c.subscribe(`${names.chat}.showWithAnimation`, chatSub.show);
      c.subscribe(`${names.chat}.hide`, chatSub.hide);
      c.subscribe(`${names.chat}.activate`, chatSub.activate);
      c.subscribe(`${names.chat}.setUser`, chatSub.setUser);
      c.subscribe(`${names.chat}.refreshLocale`, chatSub.refreshLocale);

      c.subscribe(`${names.helpCenter}.hide`, helpCenterSub.hide);

      c.subscribe(`${names.webWidget}.hide`, webWidgetSub.hide);
      c.subscribe(`${names.webWidget}.show`, webWidgetSub.show);
      c.subscribe(`${names.webWidget}.update`, webWidgetSub.update);
      c.subscribe(`${names.webWidget}.refreshLocale`, webWidgetSub.refreshLocale);
      c.subscribe(`${names.webWidget}.setZopimOnline`, webWidgetSub.setZopimOnline);
      c.subscribe(`${names.webWidget}.zopimChatStarted`, webWidgetSub.zopimChatStarted);
      c.subscribe(`${names.webWidget}.zopimChatEnded`, webWidgetSub.zopimChatEnded);

      c.subscribe(`${names.talk}.show`, talkSub.show);
    };
  });

  afterEach(() => {
    jasmine.clock().uninstall();
    mockery.deregisterAll();
    mockery.disable();
  });

 /* ****************************************** *
  *                   zE API                   *
  * ****************************************** */

  describe('.show', () => {
    const beacon = 'beacon';
    const names = { beacon };

    beforeEach(() => {
      initSubscriptionSpies(names);
      mediator.init({});

      c.broadcast('.show');
    });

    it('broadcasts beacon.trackUserAction with expected params', () => {
      const expected = ['api', 'show'];

      expect(beaconSub.trackUserAction)
        .toHaveBeenCalledWith(...expected);
    });
  });

  describe('.hide', () => {
    const beacon = 'beacon';
    const names = { beacon };

    beforeEach(() => {
      initSubscriptionSpies(names);
      mediator.init({});

      c.broadcast('.hide');
    });

    it('broadcasts beacon.trackUserAction with expected params', () => {
      const expected = ['api', 'hide'];

      expect(beaconSub.trackUserAction)
        .toHaveBeenCalledWith(...expected);
    });
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
  *                 AUTHENTICATE               *
  * ****************************************** */

  describe('.onAuthenticate', () => {
    const launcher = 'launcher';
    const submitTicket = 'ticketSubmissionForm';
    const helpCenter = 'helpCenterForm';
    const authentication = 'authentication';
    const webWidget = 'webWidget';
    const names = {
      launcher,
      submitTicket,
      helpCenter,
      authentication,
      webWidget
    };

    beforeEach(() => {
      initSubscriptionSpies(names);
      mediator.init({ submitTicket: true, helpCenter: false });
    });

    describe('onSuccess', () => {
      it('should set helpCenterForm to available if sign in required is passed in', () => {
        mediator.init({ submitTicket: true, helpCenter: true }, { helpCenterSignInRequired: true });

        jasmine.clock().install();
        c.broadcast(`${launcher}.onClick`);
        jasmine.clock().tick(0);

        expect(webWidgetSub.show.calls.count())
          .toEqual(1);

        c.broadcast('webWidget.onClose');
        c.broadcast('authentication.onSuccess');

        c.broadcast(`${launcher}.onClick`);
        jasmine.clock().tick(0);

        expect(webWidgetSub.show.calls.count())
          .toEqual(2);
      });

      it('should call launcher show if there is no embed visible', () => {
        mediator.init({ submitTicket: false, helpCenter: true }, { helpCenterSignInRequired: true });

        c.broadcast('authentication.onSuccess');

        expect(launcherSub.show.calls.count())
          .toEqual(1);
      });

      it('should not call launcher show if launcher.userHidden is true', () => {
        mediator.init(
          { submitTicket: false, helpCenter: true },
          { helpCenterSignInRequired: true, hideLauncher: true }
        );

        c.broadcast('authentication.onSuccess');

        expect(launcherSub.show.calls.count())
          .toEqual(0);
      });

      it('should not call launcher show if chat.connectionPending is true', () => {
        mediator.init({ chat: true, helpCenter: true }, { helpCenterSignInRequired: true });

        c.broadcast('authentication.onSuccess');

        expect(launcherSub.show.calls.count())
          .toEqual(0);
      });
    });
  });

  describe('.logout', () => {
    const names = {
      authentication: 'authentication'
    };

    beforeEach(() => {
      initSubscriptionSpies(names);
      mediator.init({ submitTicket: true, helpCenter: false });
    });

    it('should broadcast authentication.logout', () => {
      c.broadcast('authentication.logout');

      expect(authenticationSub.logout)
        .toHaveBeenCalled();
    });
  });

  describe('.renew', () => {
    const names = {
      authentication: 'authentication'
    };

    beforeEach(() => {
      initSubscriptionSpies(names);
      mediator.init({ submitTicket: true, helpCenter: false });
    });

    it('should broadcast authentication.renew', () => {
      c.broadcast('authentication.renew');

      expect(authenticationSub.renew)
        .toHaveBeenCalled();
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

    it('should broadcast launcher.refreshLocale', () => {
      expect(launcherSub.refreshLocale)
        .toHaveBeenCalled();
    });

    it('should broadcast zopimChat.refreshLocale', () => {
      expect(chatSub.refreshLocale)
        .toHaveBeenCalled();
    });
  });

 /* ****************************************** *
  *                  LAUNCHER                  *
  * ****************************************** */

  describe('Launcher', () => {
    const launcher = 'launcher';
    const submitTicket = 'ticketSubmissionForm';
    const chat = 'zopimChat';
    const helpCenter = 'helpCenterForm';
    const authentication = 'authentication';
    const beacon = 'beacon';
    const webWidget = 'webWidget';
    const talk = 'talk';
    const names = {
      launcher,
      submitTicket,
      chat,
      helpCenter,
      authentication,
      beacon,
      webWidget,
      talk
    };

    beforeEach(() => {
      initSubscriptionSpies(names);
    });

    describe('with Ticket Submission', () => {
      beforeEach(() => {
        mediator.init({ submitTicket: true, helpCenter: false });
      });

      it('hides when a hide call is made', () => {
        c.broadcast('.hide');

        expect(launcherSub.hide.calls.count())
          .toEqual(1);
      });

      it('shows when a show call is made', () => {
        c.broadcast('.show');

        expect(launcherSub.show.calls.count())
          .toEqual(1);
      });

      it('shows and hides launcher when a activate call is made', () => {
        c.broadcast('.activate');

        expect(launcherSub.hide.calls.count())
          .toEqual(1);
      });

      it('does not show when a show call is made if everything is suppressed', () => {
        mockContactFormSuppressedValue = true;
        mediator.init({ submitTicket: true, helpCenter: false, talk: false });

        c.broadcast('.show');

        expect(launcherSub.show.calls.count())
          .toEqual(0);
      });

      describe('when onClick is called', () => {
        beforeEach(() => {
          launcherSub.hide.calls.reset();
          jasmine.clock().install();
        });

        describe('when position is top', () => {
          it('calls hide with `upHide` transition', () => {
            mockPositionValue.vertical = 'top';
            c.broadcast(`${launcher}.onClick`);

            jasmine.clock().tick(0);

            const calls = launcherSub.hide.calls;

            expect(calls.mostRecent().args[0])
              .toEqual(jasmine.objectContaining({ transition: 'upHide' }));

            expect(calls.count())
              .toEqual(1);
          });
        });

        describe('when position is bottom', () => {
          it('calls hide with `upHide` transition', () => {
            mockPositionValue.vertical = 'bottom';
            c.broadcast(`${launcher}.onClick`);

            jasmine.clock().tick(0);

            const calls = launcherSub.hide.calls;

            expect(calls.mostRecent().args[0])
              .toEqual(jasmine.objectContaining({ transition: 'downHide' }));

            expect(calls.count())
              .toEqual(1);
          });
        });
      });

      it('hides when onClick is called on mobile', () => {
        mockRegistry['utility/devices'].isMobileBrowser
          .and.returnValue(true);

        jasmine.clock().install();

        c.broadcast(`${launcher}.onClick`);

        jasmine.clock().tick(0);

        expect(launcherSub.hide.calls.count())
          .toEqual(1);
      });

      it('launches Ticket Submission', () => {
        jasmine.clock().install();
        c.broadcast(`${launcher}.onClick`);
        jasmine.clock().tick(0);

        expect(webWidgetSub.show.calls.count())
          .toEqual(1);
        expect(launcherSub.hide.calls.count())
          .toEqual(1);
      });

      it('activates setScrollKiller and setWindowScroll on mobile', () => {
        const setScrollKiller = mockRegistry['utility/scrollHacks'].setScrollKiller;
        const setWindowScroll = mockRegistry['utility/scrollHacks'].setWindowScroll;

        mockRegistry['utility/devices'].isMobileBrowser
          .and.returnValue(true);

        jasmine.clock().install();
        c.broadcast(`${launcher}.onClick`);
        jasmine.clock().tick(1); // 1 because of a double setTimeout

        expect(setScrollKiller)
          .toHaveBeenCalledWith(true);

        expect(setScrollKiller.calls.count())
          .toEqual(1);

        expect(setWindowScroll)
          .toHaveBeenCalledWith(0);

        expect(setWindowScroll.calls.count())
          .toEqual(1);
      });

      it('activates setScrollKiller and setWindowScroll on mobile', () => {
        const setScrollKiller = mockRegistry['utility/scrollHacks'].setScrollKiller;
        const setWindowScroll = mockRegistry['utility/scrollHacks'].setWindowScroll;

        mockRegistry['utility/devices'].isMobileBrowser
          .and.returnValue(true);

        jasmine.clock().install();
        c.broadcast('.activate');
        jasmine.clock().tick(0);

        expect(setScrollKiller)
          .toHaveBeenCalledWith(true);

        expect(setWindowScroll)
          .toHaveBeenCalledWith(0);
      });
    });

    describe('with Ticket Submission and Talk', () => {
      beforeEach(() => {
        jasmine.clock().install();
        mediator.init({ submitTicket: true, helpCenter: false, talk: true });
      });

      it('shows after 3000ms if talk does not connect', () => {
        expect(launcherSub.show.calls.count())
          .toEqual(0);

        jasmine.clock().tick(3000);

        expect(launcherSub.show.calls.count())
          .toEqual(1);
      });
    });

    describe('with Ticket Submission and Chat', () => {
      beforeEach(() => {
        jasmine.clock().install();
        mediator.init({ submitTicket: true, helpCenter: false, chat: true, talk: false });
      });

      it('shows after 3000ms if chat does not connect', () => {
        expect(launcherSub.show.calls.count())
          .toEqual(0);

        jasmine.clock().tick(3000);

        expect(launcherSub.show.calls.count())
          .toEqual(1);
      });

      it('does not show after 3000ms if newChat is true', () => {
        mediator.init({ submitTicket: true, helpCenter: false, chat: true }, { newChat: true });

        expect(launcherSub.show.calls.count())
          .toEqual(0);

        jasmine.clock().tick(3000);

        expect(launcherSub.show.calls.count())
          .toEqual(0);
      });

      describe('when chat is offline', () => {
        describe('when there is not an active chat', () => {
          it('launches Ticket Submission', () => {
            c.broadcast(`${chat}.onOffline`);

            c.broadcast(`${launcher}.onClick`);
            jasmine.clock().tick(0);

            expect(launcherSub.hide.calls.count())
              .toEqual(1);
            expect(webWidgetSub.show.calls.count())
              .toEqual(1);
            expect(chatSub.show.calls.count())
              .toEqual(0);
          });
        });

        describe('when there is an active chat', () => {
          it('launches Chat', () => {
            c.broadcast(`${chat}.onIsChatting`);
            c.broadcast(`${chat}.onOffline`);

            c.broadcast(`${launcher}.onClick`);
            jasmine.clock().tick(0);

            expect(launcherSub.hide.calls.count())
              .toEqual(1);
            expect(webWidgetSub.show.calls.count())
              .toEqual(0);
            expect(chatSub.show.calls.count())
              .toEqual(1);
          });
        });
      });

      describe('when chat is online', () => {
        beforeEach(() => {
          c.broadcast(`${chat}.onOnline`);

          c.broadcast(`${launcher}.onClick`);
          jasmine.clock().tick(0);
        });

        it('sends a `chat launch` user action blip', () => {
          expect(beaconSub.trackUserAction.calls.count())
            .toEqual(1);
        });

        it('launches chat', () => {
          expect(webWidgetSub.show.calls.count())
            .toEqual(0);
          expect(chatSub.show.calls.count())
            .toEqual(1);
        });
      });

      it('updates launcher with unread message count', () => {
        c.broadcast(`${chat}.onOnline`);
        c.broadcast(`${chat}.onConnected`);
        c.broadcast(`${chat}.onUnreadMsgs`, 5);

        expect(launcherSub.setUnreadMsgs.calls.count())
          .toEqual(1);
        expect(launcherSub.setUnreadMsgs)
          .toHaveBeenCalledWith(5);
      });

      it('does not hide if launching chat on mobile', () => {
        mockRegistry['utility/devices'].isMobileBrowser
          .and.returnValue(true);

        c.broadcast(`${chat}.onOnline`);
        c.broadcast(`${launcher}.onClick`);

        expect(launcherSub.hide.calls.count())
          .toEqual(0);
      });

      it('doesn\'t hide when onClick is called on mobile and chat is online', () => {
        mockRegistry['utility/devices'].isMobileBrowser
          .and.returnValue(true);

        c.broadcast(`${chat}.onOnline`);

        c.broadcast(`${launcher}.onClick`);
        jasmine.clock().tick(0);

        expect(launcherSub.hide.calls.count())
          .toEqual(0);
      });
    });

    describe('with Ticket Submission, Chat and Help Center', () => {
      beforeEach(() => {
        mediator.init({ submitTicket: true, helpCenter: true, talk: false });
      });

      it('launches Help Center first', () => {
        jasmine.clock().install();
        c.broadcast(`${launcher}.onClick`);
        jasmine.clock().tick(0);

        expect(webWidgetSub.show.calls.count())
          .toEqual(1);
      });

      it('launches chat when the user moves on to chat and chat is online', () => {
        c.broadcast(`${chat}.onOnline`);
        c.broadcast(`${launcher}.onClick`);  // open
        c.broadcast(`${helpCenter}.onNextClick`);

        reset(chatSub.show);
        reset(webWidgetSub.show);

        c.broadcast(`${chat}.onHide`); // close

        jasmine.clock().install();
        c.broadcast(`${launcher}.onClick`); // open
        jasmine.clock().tick(0);

        expect(chatSub.show.calls.count())
          .toEqual(1);

        expect(webWidgetSub.show.calls.count())
          .toEqual(0);
      });

      it('can still activate embed after switching to chat from help center and minimizing chat', () => {
        jasmine.clock().install();
        c.broadcast(`${chat}.onOnline`);
        c.broadcast(`${launcher}.onClick`);  // open
        jasmine.clock().tick(0);
        c.broadcast(`${helpCenter}.onNextClick`);

        reset(webWidgetSub.show);

        c.broadcast(`${chat}.onHide`); // close

        c.broadcast(`.activate`); // open
        jasmine.clock().tick(0);

        expect(webWidgetSub.show.calls.count())
          .toEqual(1);
      });

      it('sends a `chat launch` user action blip on next click to open chat', () => {
        c.broadcast(`${chat}.onOnline`);
        c.broadcast(`${launcher}.onClick`);  // open
        c.broadcast(`${helpCenter}.onNextClick`);

        expect(beaconSub.trackUserAction.calls.count())
          .toEqual(1);
      });

      it('launches help center if user has moved on to chat and chat goes offline', () => {
        c.broadcast(`${chat}.onOnline`);
        c.broadcast(`${launcher}.onClick`);  // open
        c.broadcast(`${helpCenter}.onNextClick`);

        reset(webWidgetSub.show);
        c.broadcast('webWidget.onClose'); // close
        c.broadcast(`${chat}.onOffline`);

        jasmine.clock().install();
        c.broadcast(`${launcher}.onClick`); // open
        jasmine.clock().tick(0);

        expect(webWidgetSub.show.calls.count())
          .toEqual(1);
      });

      it('launches chat if chat is online and there are unread messages', () => {
        c.broadcast(`${chat}.onOnline`);
        c.broadcast(`${chat}.onConnected`);
        c.broadcast(`${launcher}.onClick`);

        // help center is open at this point

        c.broadcast(`${chat}.onUnreadMsgs`, 1);

        c.broadcast(`${helpCenter}.onHide`);

        reset(chatSub.show);
        reset(webWidgetSub.show);

        jasmine.clock().install();
        c.broadcast(`${launcher}.onClick`);
        jasmine.clock().tick(0);

        expect(webWidgetSub.show.calls.count())
          .toEqual(0);

        expect(chatSub.show.calls.count())
          .toEqual(1);
      });

      it('launches help center if chat is offline and there are unread messages', () => {
        c.broadcast(`${chat}.onOnline`);
        c.broadcast(`${chat}.onConnected`);
        c.broadcast(`${launcher}.onClick`);
        c.broadcast(`${helpCenter}.onHide`);

        c.broadcast(`${chat}.onUnreadMsgs`, 1);

        c.broadcast(`${chat}.onHide`);
        c.broadcast(`${chat}.onOffline`);

        reset(chatSub.show);
        reset(webWidgetSub.show);

        jasmine.clock().install();
        c.broadcast(`${launcher}.onClick`);
        jasmine.clock().tick(0);

        expect(webWidgetSub.show.calls.count())
          .toEqual(1);

        expect(chatSub.show.calls.count())
         .toEqual(0);
      });

      it('causes onNextClick to open to chat always', () => {
        c.broadcast(`${chat}.onOnline`);
        c.broadcast(`${launcher}.onClick`);
        c.broadcast(`${helpCenter}.onNextClick`);

        expect(chatSub.show.calls.count())
          .toEqual(1);
      });

      describe('onNextClick', () => {
        it('shows launcher on mobile', () => {
          mockRegistry['utility/devices'].isMobileBrowser
            .and.returnValue(true);

          c.broadcast(`${chat}.onOnline`);
          c.broadcast(`${helpCenter}.onNextClick`);

          expect(launcherSub.show.calls.count())
            .toEqual(1);
        });

        it('does not show launcher on mobile if it was hidden', () => {
          mockRegistry['utility/devices'].isMobileBrowser
            .and.returnValue(true);

          reset(launcherSub.show);

          c.broadcast(`.hide`);
          c.broadcast(`${chat}.onOnline`);
          c.broadcast(`${helpCenter}.onNextClick`);

          expect(launcherSub.show.calls.count())
            .toEqual(0);
        });
      });
    });

    describe('with authenticated help center', () => {
      it('broadcasts authentication.renew when onClick is called', () => {
        mediator.init({ submitTicket: true, helpCenter: true }, { helpCenterSignInRequired: true });

        c.broadcast('authentication.onSuccess');
        c.broadcast(`${launcher}.onClick`);

        expect(authenticationSub.renew)
          .toHaveBeenCalled();
      });
    });

    describe('with Talk and Chat', () => {
      beforeEach(() => {
        mediator.init({ chat: true, talk: true });
      });

      describe('when chat is connected', () => {
        beforeEach(() => {
          reset(launcherSub.show);
          c.broadcast(`${chat}.onOnline`);
          c.broadcast(`${chat}.onConnected`);
        });

        it("shows launcher when talk's connection is not pending", () => {
          c.broadcast(`${talk}.enabled`, true);
          c.broadcast(`${talk}.agentAvailability`, true);

          expect(launcherSub.show.calls.count())
            .toEqual(1);
        });

        it("does not show launcher when talk's connection is pending", () => {
          expect(launcherSub.show.calls.count())
            .toEqual(0);
        });
      });

      describe('when talk has connected', () => {
        beforeEach(() => {
          reset(launcherSub.show);
          c.broadcast(`${talk}.enabled`, true);
          c.broadcast(`${talk}.agentAvailability`, true);
        });

        it("does not show launcher when chat's connection is pending", () => {
          expect(launcherSub.show.calls.count())
            .toEqual(0);
        });

        it("show launcher when chat's connection is not pending", () => {
          c.broadcast(`${chat}.onOnline`);
          c.broadcast(`${chat}.onConnected`);

          expect(launcherSub.show.calls.count())
            .toEqual(1);
        });
      });

      describe('does not show launcher when talk and chat are in connection pending', () => {
        beforeEach(() => {
          reset(launcherSub.show);
        });

        it('when chat loads first and then talk', () => {
          expect(launcherSub.show.calls.count())
            .toEqual(0);
        });
      });
    });
  });

 /* ****************************************** *
  *             TICKET SUBMISSION              *
  * ****************************************** */

  describe('Ticket Submission', () => {
    const launcher = 'launcher';
    const submitTicket = 'ticketSubmissionForm';
    const chat = 'zopimChat';
    const helpCenter = 'helpCenterForm';
    const webWidget = 'webWidget';
    const names = {
      launcher: launcher,
      submitTicket: submitTicket,
      chat: chat,
      helpCenter: helpCenter,
      webWidget: webWidget
    };

    beforeEach(() => {
      initSubscriptionSpies(names);
    });

    describe('standalone', () => {
      beforeEach(() => {
        mediator.init({ submitTicket: true, helpCenter: false });
      });

      it('shows launcher on close', () => {
        jasmine.clock().install();
        c.broadcast(`${launcher}.onClick`);
        jasmine.clock().tick(0);

        expect(webWidgetSub.show.calls.count())
          .toEqual(1);
        expect(launcherSub.hide.calls.count())
          .toEqual(1);

        c.broadcast('webWidget.onClose');
        jasmine.clock().tick(0);

        expect(launcherSub.show.calls.count())
          .toEqual(1);
      });

      it('reverts setScrollKiller and setWindowScroll on mobile onClose', () => {
        const setScrollKiller = mockRegistry['utility/scrollHacks'].setScrollKiller;
        const revertWindowScroll = mockRegistry['utility/scrollHacks'].revertWindowScroll;

        mockRegistry['utility/devices'].isMobileBrowser
          .and.returnValue(true);

        c.broadcast(`${launcher}.onClick`);

        reset(setScrollKiller);
        reset(revertWindowScroll);

        c.broadcast('webWidget.onClose');

        expect(setScrollKiller)
          .toHaveBeenCalledWith(false);

        expect(setScrollKiller.calls.count())
          .toEqual(1);

        expect(revertWindowScroll.calls.count())
          .toEqual(1);
      });

      describe('when activate is called', () => {
        beforeEach(() => {
          c.broadcast('.hide');
          reset(webWidgetSub.show);
        });

        describe('when position is top', () => {
          it('calls show with `downShow` transition', () => {
            mockPositionValue.vertical = 'top';
            c.broadcast('.activate');

            const calls = webWidgetSub.show.calls;

            expect(calls.mostRecent().args[0])
              .toEqual(jasmine.objectContaining({ transition: 'downShow' }));

            expect(calls.count())
              .toEqual(1);
          });
        });

        describe('when position is bottom', () => {
          it('calls show with `upShow` transition', () => {
            mockPositionValue.vertical = 'bottom';
            c.broadcast('.activate');

            const calls = webWidgetSub.show.calls;

            expect(calls.mostRecent().args[0])
              .toEqual(jasmine.objectContaining({ transition: 'upShow' }));

            expect(calls.count())
              .toEqual(1);
          });
        });
      });

      it('does not show after activate is called if it is suppressed', () => {
        mockContactFormSuppressedValue = true;
        mediator.init({ submitTicket: true, helpCenter: false });

        reset(webWidgetSub.show);
        c.broadcast('.activate');

        expect(webWidgetSub.show.calls.count())
          .toEqual(0);
      });

      describe('when activate is called', () => {
        beforeEach(() => {
          c.broadcast(`${chat}.onOffline`);
          c.broadcast(`${launcher}.onClick`);
          c.broadcast('.hide');

          reset(webWidgetSub.show);
        });

        describe('when position is top', () => {
          it('calls show with `downShow` transition', () => {
            mockPositionValue.vertical = 'top';
            c.broadcast('.activate');

            const calls = webWidgetSub.show.calls;

            expect(calls.mostRecent().args[0])
              .toEqual(jasmine.objectContaining({ transition: 'downShow' }));

            expect(calls.count())
              .toEqual(1);
          });
        });

        describe('when position is bottom', () => {
          it('calls show with `upShow` transition', () => {
            mockPositionValue.vertical = 'bottom';
            c.broadcast('.activate');

            const calls = webWidgetSub.show.calls;

            expect(calls.mostRecent().args[0])
              .toEqual(jasmine.objectContaining({ transition: 'upShow' }));

            expect(calls.count())
              .toEqual(1);
          });
        });
      });

      describe('.orientationChange', () => {
        it('calls update on submitTicket', () => {
          c.broadcast('.orientationChange');

          expect(webWidgetSub.update)
            .toHaveBeenCalled();
        });
      });
    });

    describe('with chat', () => {
      beforeEach(() => {
        mediator.init({ submitTicket: true, helpCenter: false });
      });

      describe('if chat goes offline', () => {
        describe('and there is not an active chat', () => {
          it('shows ticket submission', () => {
            c.broadcast(`${chat}.onOnline`);
            c.broadcast(`${chat}.onOffline`);

            reset(webWidgetSub.show);
            reset(chatSub.show);

            jasmine.clock().install();
            c.broadcast(`${launcher}.onClick`);
            jasmine.clock().tick(10);

            expect(webWidgetSub.show.calls.count())
              .toEqual(1);

            expect(chatSub.show.calls.count())
              .toEqual(0);
          });
        });

        describe('and there is an active chat', () => {
          it('still shows chat', () => {
            c.broadcast(`${chat}.onOnline`);
            c.broadcast(`${chat}.onIsChatting`);
            c.broadcast(`${chat}.onOffline`);

            reset(webWidgetSub.show);
            reset(chatSub.show);

            jasmine.clock().install();
            c.broadcast(`${launcher}.onClick`);
            jasmine.clock().tick(10);

            expect(webWidgetSub.show.calls.count())
              .toEqual(0);

            expect(chatSub.show.calls.count())
              .toEqual(1);
          });
        });
      });
    });

    describe('with Help Center', () => {
      beforeEach(() => {
        mediator.init({ submitTicket: true, helpCenter: true });
      });

      it('sets Help Center as active embed after form submit', () => {
        c.broadcast(`${launcher}.onClick`);
        c.broadcast(`${helpCenter}.onNextClick`);

        c.broadcast(`${submitTicket}.onFormSubmitted`);

        reset(webWidgetSub.show);

        c.broadcast('webWidget.onClose'); // close

        jasmine.clock().install();
        c.broadcast(`${launcher}.onClick`); // open
        jasmine.clock().tick(0);

        expect(webWidgetSub.show.calls.count())
          .toEqual(1);
      });
    });
  });

 /* ****************************************** *
  *                   CHAT                     *
  * ****************************************** */

  describe('Chat', () => {
    const launcher = 'launcher';
    const submitTicket = 'ticketSubmissionForm';
    const chat = 'zopimChat';
    const helpCenter = 'helpCenterForm';
    const webWidget = 'webWidget';
    const names = {
      launcher,
      submitTicket,
      chat,
      helpCenter,
      webWidget
    };

    beforeEach(() => {
      initSubscriptionSpies(names);
    });

    describe('standalone', () => {
      beforeEach(() => {
        mediator.init({ submitTicket: false, helpCenter: false, chat: true });
        jasmine.clock().install();
      });

      it('should open to chat if it is online', () => {
        c.broadcast(`${chat}.onOffline`);
        c.broadcast(`${chat}.onOnline`);

        c.broadcast(`${launcher}.onClick`);
        jasmine.clock().tick(0);

        expect(chatSub.show.calls.count())
          .toEqual(1);
      });

      it('should not show launcher if chat is offline', () => {
        c.broadcast(`${chat}.onOffline`);

        expect(launcherSub.show.calls.count())
          .toEqual(0);
      });

      it('should hide the launcher if chat goes offline', () => {
        c.broadcast(`${chat}.onOnline`);
        c.broadcast(`${chat}.onConnected`);

        expect(launcherSub.show.calls.count())
          .toEqual(1);

        reset(launcherSub.hide);
        c.broadcast(`${chat}.onOffline`);

        expect(launcherSub.hide.calls.count())
          .toEqual(1);
      });
    });

    describe('with Ticket Submission', () => {
      beforeEach(() => {
        mediator.init({ chat: true, submitTicket: true, helpCenter: false });
      });

      it('hides the launcher when chat pops open from proactive chat', () => {
        c.broadcast(`${chat}.onConnected`);
        c.broadcast(`${chat}.onUnreadMsgs`, 1);

        expect(launcherSub.hide.calls.count())
          .toEqual(1);
      });

      it('doesn\'t close when chat is ended', () => {
        c.broadcast(`${chat}.onOnline`);
        c.broadcast(`${chat}.onConnected`);
        c.broadcast(`${launcher}.onClick`);

        reset(chatSub.hide);
        reset(launcherSub.show);

        c.broadcast(`${chat}.onChatEnd`);

        expect(chatSub.hide.calls.count())
          .toEqual(0);

        expect(launcherSub.show.calls.count())
          .toEqual(0);
      });

      it('pops open proactive chat if user has not closed chat before', () => {
        c.broadcast(`${chat}.onOnline`);
        c.broadcast(`${chat}.onConnected`);
        c.broadcast(`${chat}.onUnreadMsgs`, 1);

        expect(launcherSub.hide.calls.count())
          .toEqual(1);

        reset(chatSub.show);

        c.broadcast(`${chat}.onHide`); // close

        jasmine.clock().install();
        c.broadcast(`${launcher}.onClick`); // open
        jasmine.clock().tick(0);

        expect(chatSub.show.calls.count())
          .toEqual(1);
      });

      it('does not pop open chat if user has closed chat', () => {
        c.broadcast(`${chat}.onOnline`);
        c.broadcast(`${chat}.onConnected`);
        c.broadcast(`${chat}.onUnreadMsgs`, 1);

        // chat is open at this point

        c.broadcast(`${chat}.onHide`); // close

        reset(chatSub.show);

        c.broadcast(`${chat}.onUnreadMsgs`, 1);

        expect(chatSub.show.calls.count())
          .toEqual(0);
      });

      it('pops open proactive chat after chat ends and user closes it', () => {
        c.broadcast(`${chat}.onOnline`);
        c.broadcast(`${chat}.onConnected`);
        c.broadcast(`${chat}.onUnreadMsgs`, 1);

        // chat is open at this point

        c.broadcast(`${chat}.onChatEnd`);
        c.broadcast(`${chat}.onHide`);

        reset(chatSub.show);

        c.broadcast(`${chat}.onUnreadMsgs`, 1);

        expect(chatSub.show.calls.count())
          .toEqual(1);
      });

      it('does not pop open if ticket submission embed is visible', () => {
        jasmine.clock().install();
        c.broadcast(`${launcher}.onClick`);
        jasmine.clock().tick(0);

        // ticket submission is open at this point

        c.broadcast(`${chat}.onOnline`);
        c.broadcast(`${chat}.onConnected`);

        reset(chatSub.show);

        c.broadcast(`${chat}.onUnreadMsgs`, 1);

        expect(chatSub.show.calls.count())
          .toEqual(0);
      });

      it('hides when a hide call is made', () => {
        c.broadcast('.hide');

        expect(chatSub.hide.calls.count())
          .toEqual(1);
      });

      it('hides after show is called and chat is online', () => {
        c.broadcast(`${chat}.onOnline`);

        reset(chatSub.hide);
        c.broadcast('.show');

        expect(chatSub.hide.calls.count())
          .toEqual(1);
      });

      it('shows after activate is called and chat is online', () => {
        c.broadcast(`${chat}.onOnline`);
        c.broadcast(`${chat}.onConnected`);

        c.broadcast('.hide');

        reset(chatSub.show);
        c.broadcast('.activate');

        expect(chatSub.show.calls.count())
          .toEqual(1);
      });

      it('does not show after activate is called if it is suppressed', () => {
        mockChatSuppressedValue = true;
        mediator.init({ submitTicket: false, helpCenter: false });

        c.broadcast(`${chat}.onOnline`);
        c.broadcast(`${chat}.onConnected`);

        c.broadcast('.hide');

        reset(chatSub.show);
        c.broadcast('.activate');

        expect(chatSub.show.calls.count())
          .toEqual(0);
      });

      it('doesn\'t hide when launcher is pressed on mobile', () => {
        mockRegistry['utility/devices'].isMobileBrowser
          .and.returnValue(true);

        c.broadcast(`${chat}.onOnline`);
        c.broadcast(`${launcher}.onClick`);

        reset(chatSub.hide);
        reset(chatSub.show);

        jasmine.clock().install();
        c.broadcast(`${launcher}.onClick`);
        jasmine.clock().tick(1);

        expect(chatSub.hide.calls.count())
          .toEqual(0);
        expect(chatSub.show.calls.count())
          .toEqual(1);
      });

      describe('when there is a zopim error', () => {
        it('should show the launcher', () => {
          c.broadcast(`${chat}.onError`);

          expect(launcherSub.show.calls.count())
            .toBe(1);
        });
      });

      describe('when chat comes online', () => {
        beforeEach(() => {
          jasmine.clock().install();
        });

        afterEach(() => {
          jasmine.clock().uninstall();
        });

        describe('when channel choice is available', () => {
          beforeEach(() => {
            mediator.init({
              chat: true,
              submitTicket: true,
              channelChoice: true,
              talk: true,
              helpCenter: false
            });

            c.broadcast(`${chat}.onOnline`);
            c.broadcast(`${launcher}.onClick`);
            jasmine.clock().tick(1);
          });

          it('sets the active embed to channel choice', () => {
            expect(chatSub.show.calls.count())
              .toBe(0);

            expect(webWidgetSub.show.calls.count())
              .toBe(1);
          });
        });

        describe('when channel choice is not available', () => {
          beforeEach(() => {
            c.broadcast(`${chat}.onOnline`);
            c.broadcast(`${launcher}.onClick`);
            jasmine.clock().tick(1);
          });

          it('sets the active embed to chat', () => {
            expect(webWidgetSub.show.calls.count())
              .toBe(0);

            expect(chatSub.show.calls.count())
              .toBe(1);
          });
        });
      });

      describe('when activate is called', () => {
        describe('when connection is pending', () => {
          beforeEach(() => {
            jasmine.clock().install();
          });

          describe('when chat is offline', () => {
            beforeEach(() => {
              c.broadcast('.activate');
              c.broadcast(`${chat}.onOffline`);
              c.broadcast(`${chat}.onConnected`);
            });

            it('shows contact form when chat connects', () => {
              expect(webWidgetSub.show.calls.count())
                .toBe(1);
            });
          });

          describe('when chat is online', () => {
            beforeEach(() => {
              c.broadcast('.activate');
              c.broadcast(`${chat}.onOnline`);
              c.broadcast(`${chat}.onConnected`);
            });

            it('shows chat when chat connects', () => {
              expect(chatSub.show.calls.count())
                .toBe(1);
            });
          });
        });
      });
    });

    describe('with Help Center', () => {
      beforeEach(() => {
        mediator.init({ submitTicket: true, helpCenter: true, chat: true });
      });

      it('does not show after activate is called and was visible before hidden', () => {
        c.broadcast(`${chat}.onOnline`);
        c.broadcast(`${launcher}.onClick`);
        c.broadcast(`${helpCenter}.onNextClick`);

        c.broadcast('.hide');

        reset(chatSub.show);
        c.broadcast('.activate');

        expect(chatSub.show.calls.count())
          .toEqual(0);
      });

      it('does not reset the active embed if it goes offline and was not online initially', () => {
        c.broadcast('.zopimShow');
        c.broadcast(`${chat}.onOffline`);
        c.broadcast(`${chat}.onOnline`);

        jasmine.clock().install();
        c.broadcast(`${launcher}.onClick`); // open
        jasmine.clock().tick(0);

        expect(webWidgetSub.show.calls.count())
          .toEqual(0);
        expect(chatSub.show.calls.count())
          .toEqual(1);
      });

      it('pops open proactive chat after chat ends and user closes it', () => {
        c.broadcast(`${chat}.onOnline`);
        c.broadcast(`${chat}.onConnected`);
        c.broadcast(`${chat}.onUnreadMsgs`, 1);

        // chat is open at this point

        c.broadcast(`${chat}.onChatEnd`);
        c.broadcast(`${chat}.onHide`);

        reset(chatSub.show);

        c.broadcast(`${chat}.onUnreadMsgs`, 1);

        expect(chatSub.show.calls.count())
          .toEqual(1);
      });

      it('does not pop open if help center embed is visible', () => {
        c.broadcast(`${chat}.onOnline`);
        c.broadcast(`${chat}.onConnected`);

        jasmine.clock().install();
        c.broadcast(`${launcher}.onClick`);
        jasmine.clock().tick(0);

        // help center is open at this point

        reset(chatSub.show);

        c.broadcast(`${chat}.onUnreadMsgs`, 1);

        expect(chatSub.show.calls.count())
          .toEqual(0);
      });

      describe('when there is a zopim error', () => {
        it('should show the launcher', () => {
          c.broadcast(`${chat}.onError`);

          expect(launcherSub.show.calls.count())
            .toBe(1);
        });
      });
    });
  });

 /* ****************************************** *
  *                 HELP CENTER                *
  * ****************************************** */

  describe('Help Center', () => {
    const launcher = 'launcher';
    const submitTicket = 'ticketSubmissionForm';
    const helpCenter = 'helpCenterForm';
    const chat = 'zopimChat';
    const webWidget = 'webWidget';
    const names = {
      launcher,
      submitTicket,
      helpCenter,
      chat,
      webWidget
    };

    beforeEach(() => {
      initSubscriptionSpies(names);
      mediator.init({ submitTicket: true, helpCenter: true });
    });

    describe('standalone', () => {
      beforeEach(() => {
        mediator.init({ submitTicket: false, helpCenter: true });
        jasmine.clock().install();
      });

      it('should open to help center', () => {
        c.broadcast(`${launcher}.onClick`);
        jasmine.clock().tick(0);

        expect(webWidgetSub.show.calls.count())
          .toEqual(1);
      });
    });

    describe('with chat and without ticket submission', () => {
      beforeEach(() => {
        mediator.init({ submitTicket: false, helpCenter: true });
        jasmine.clock().install();
      });

      it('should open to help center', () => {
        c.broadcast(`${launcher}.onClick`);
        jasmine.clock().tick(0);

        expect(webWidgetSub.show.calls.count())
          .toEqual(1);
      });
    });

    describe('when activate is called', () => {
      beforeEach(() => {
        c.broadcast('.hide');
        reset(webWidgetSub.show);
      });

      describe('when position is top', () => {
        it('calls show with `downShow` transition', () => {
          mockPositionValue.vertical = 'top';
          c.broadcast('.activate');

          const calls = webWidgetSub.show.calls;

          expect(calls.mostRecent().args[0])
            .toEqual(jasmine.objectContaining({ transition: 'downShow' }));

          expect(calls.count())
            .toEqual(1);
        });
      });

      describe('when position is bottom', () => {
        it('calls show with `upShow` transition', () => {
          mockPositionValue.vertical = 'bottom';
          c.broadcast('.activate');

          const calls = webWidgetSub.show.calls;

          expect(calls.mostRecent().args[0])
            .toEqual(jasmine.objectContaining({ transition: 'upShow' }));

          expect(calls.count())
            .toEqual(1);
        });
      });
    });

    it('does not show after activate is called if it is suppressed', () => {
      mockHelpCenterSuppressedValue = true;
      mediator.init({ submitTicket: false, helpCenter: true });

      reset(webWidgetSub.show);
      c.broadcast('.activate');

      expect(webWidgetSub.show.calls.count())
        .toEqual(0);
    });

    it('reverts setScrollKiller and setWindowScroll on mobile onClose', () => {
      const setScrollKiller = mockRegistry['utility/scrollHacks'].setScrollKiller;
      const revertWindowScroll = mockRegistry['utility/scrollHacks'].revertWindowScroll;

      mockRegistry['utility/devices'].isMobileBrowser
        .and.returnValue(true);

      c.broadcast(`${launcher}.onClick`);

      reset(setScrollKiller);
      reset(revertWindowScroll);

      c.broadcast('webWidget.onClose');

      expect(setScrollKiller)
        .toHaveBeenCalledWith(false);

      expect(setScrollKiller.calls.count())
        .toEqual(1);

      expect(revertWindowScroll.calls.count())
        .toEqual(1);
    });

    it('should not set helpCenterForm to available if sign in is required', () => {
      mediator.init({ submitTicket: true, chat: true, helpCenter: true }, { helpCenterSignInRequired: true });
      c.broadcast(`${chat}.onOnline`);
      c.broadcast(`${chat}.onConnected`);

      jasmine.clock().install();
      c.broadcast(`${launcher}.onClick`);
      jasmine.clock().tick(0);

      expect(webWidgetSub.show.calls.count())
        .toEqual(0);
    });

    it('should set helpCenterForm to available if sign in is required and is on a hc page', () => {
      mockOnHelpCenterPageValue = true;

      mediator.init({ submitTicket: true, chat: true, helpCenter: true }, { helpCenterSignInRequired: true });

      c.broadcast('zopimChat.onOnline');
      c.broadcast('zopimChat.onConnected');

      jasmine.clock().install();
      c.broadcast(`${launcher}.onClick`);
      jasmine.clock().tick(0);

      expect(chatSub.show.calls.count())
        .toEqual(0);

      expect(webWidgetSub.show.calls.count())
        .toEqual(1);
    });
  });

  /* ****************************************** *
  *                  WEB WIDGET                 *
  * ****************************************** */

  describe('Web Widget', () => {
    const launcher = 'launcher';
    const webWidget = 'webWidget';
    const chat = 'zopimChat';
    const names = {
      launcher: launcher,
      chat: chat,
      webWidget: webWidget
    };

    beforeEach(() => {
      initSubscriptionSpies(names);
      mediator.init({ submitTicket: true, helpCenter: true });
      jasmine.clock().install();
    });

    it('hides when a hide call is made', () => {
      c.broadcast('.hide');

      expect(webWidgetSub.hide.calls.count())
        .toEqual(1);
    });

    it('hides when a show call is made', () => {
      c.broadcast('.show');

      expect(webWidgetSub.hide.calls.count())
        .toEqual(1);
    });

    it('shows when a launcherClick call is made', () => {
      c.broadcast(`${launcher}.onClick`);

      jasmine.clock().tick(0);

      expect(webWidgetSub.show.calls.count())
        .toEqual(1);
    });

    it('shows when a activate call is made', () => {
      c.broadcast('.activate');

      expect(webWidgetSub.show.calls.count())
        .toEqual(1);
    });

    it('broadcasts webWidget.zopimChatStarted when zopimChat.onUnreadMsg is recieved', () => {
      c.broadcast('zopimChat.onConnected');
      c.broadcast('zopimChat.onUnreadMsgs', 1);

      expect(webWidgetSub.zopimChatStarted)
        .toHaveBeenCalled();
    });

    it('broadcasts webWidget.zopimChatEnded when zopimChat.onChatEnd is recieved', () => {
      c.broadcast('zopimChat.onChatEnd');

      expect(webWidgetSub.zopimChatEnded)
        .toHaveBeenCalled();
    });

    it('should broadcast webWidget.refreshLocale when onSetLocale is recieved', () => {
      c.broadcast('.onSetLocale');

      expect(webWidgetSub.refreshLocale)
        .toHaveBeenCalled();
    });

    it('broadcasts webWidget.zopimChatStarted with true when zopimChat.onIsChatting is recieved', () => {
      c.broadcast('zopimChat.onIsChatting');

      expect(webWidgetSub.zopimChatStarted)
        .toHaveBeenCalled();
    });
  });

 /* ****************************************** *
  *                  SUPPRESS                  *
  * ****************************************** */

  describe('suppress', () => {
    const launcher = 'launcher';
    const submitTicket = 'ticketSubmissionForm';
    const helpCenter = 'helpCenterForm';
    const chat = 'zopimChat';
    const webWidget = 'webWidget';
    const talk = 'talk';
    const names = {
      launcher,
      submitTicket,
      helpCenter,
      chat,
      webWidget,
      talk
    };

    beforeEach(() => {
      initSubscriptionSpies(names);
      jasmine.clock().install();
    });

    describe('when contact form is suppressed', () => {
      beforeEach(() => {
        mockContactFormSuppressedValue = true;
      });

      describe('when there is no chat or help center', () => {
        beforeEach(() => {
          mediator.init({ submitTicket: true, helpCenter: false });
        });

        it('should not show the launcher', () => {
          expect(launcherSub.show.calls.count())
            .toEqual(0);
        });
      });

      describe('when chat is available', () => {
        beforeEach(() => {
          mediator.init({ submitTicket: true, helpCenter: false, chat: true });
        });

        it('should open to chat if it is online', () => {
          c.broadcast(`${chat}.onOffline`);
          c.broadcast(`${chat}.onOnline`);

          c.broadcast(`${launcher}.onClick`);
          jasmine.clock().tick(0);

          expect(chatSub.show.calls.count())
            .toEqual(1);
        });

        it('should not show launcher if chat is offline', () => {
          c.broadcast(`${chat}.onOffline`);

          expect(launcherSub.show.calls.count())
            .toEqual(0);
        });

        it('should hide the launcher if chat goes offline', () => {
          c.broadcast(`${chat}.onOnline`);
          c.broadcast(`${chat}.onConnected`);

          expect(launcherSub.show.calls.count())
            .toEqual(1);

          reset(launcherSub.hide);
          c.broadcast(`${chat}.onOffline`);

          expect(launcherSub.hide.calls.count())
            .toEqual(1);
        });
      });

      describe('when help center is available', () => {
        beforeEach(() => {
          mediator.init({ submitTicket: true, helpCenter: true });
        });

        it('should open to help center', () => {
          c.broadcast(`${launcher}.onClick`);
          jasmine.clock().tick(0);

          expect(webWidgetSub.show.calls.count())
            .toEqual(1);
        });
      });

      describe('when chat and help center are available', () => {
        beforeEach(() => {
          mediator.init({ submitTicket: true, helpCenter: true, chat: true });
        });

        it('should open to help center', () => {
          c.broadcast(`${launcher}.onClick`);
          jasmine.clock().tick(0);

          expect(webWidgetSub.show.calls.count())
            .toEqual(1);
        });
      });
    });

    describe('when chat is suppressed', () => {
      beforeEach(() => {
        mockChatSuppressedValue = true;
        mediator.init({ submitTicket: true, helpCenter: false });

        c.broadcast(`${chat}.onOffline`);
        c.broadcast(`${chat}.onOnline`);
      });

      it('does not display chat if it is suppressed', () => {
        c.broadcast(`${launcher}.onClick`);
        jasmine.clock().tick(0);

        expect(webWidgetSub.show.calls.count())
          .toEqual(1);
        expect(chatSub.show.calls.count())
          .toEqual(0);
      });

      describe('there is a proactive chat', () => {
        it('should disable suppression', () => {
          c.broadcast(`${chat}.onConnected`);
          c.broadcast(`${chat}.onUnreadMsgs`, 1);

          reset(chatSub.show);

          c.broadcast(`${chat}.onHide`); // close

          c.broadcast(`${launcher}.onClick`); // open
          jasmine.clock().tick(0);

          expect(chatSub.show.calls.count())
            .toEqual(1);
        });
      });

      describe('there is an ongoing chat', () => {
        it('disables suppression', () => {
          c.broadcast(`${chat}.onIsChatting`);

          reset(chatSub.show);

          c.broadcast(`${chat}.onHide`); // close

          c.broadcast(`${launcher}.onClick`); // open
          jasmine.clock().tick(0);

          expect(chatSub.show.calls.count())
            .toEqual(1);
        });

        describe('and the agent marks him or herself invisible', () => {
          it('still disables suppression', () => {
            c.broadcast(`${chat}.onIsChatting`);
            c.broadcast(`${chat}.onOffline`);

            c.broadcast(`${chat}.onHide`); // close

            c.broadcast(`${launcher}.onClick`); // open
            jasmine.clock().tick(0);

            expect(chatSub.show.calls.count())
              .toEqual(1);
          });
        });
      });
    });

    it('should not display help center if it is suppressed', () => {
      mockHelpCenterSuppressedValue = true;
      mediator.init({ submitTicket: true, chat: true, helpCenter: true });

      c.broadcast(`${chat}.onOnline`);
      c.broadcast(`${chat}.onConnected`);

      c.broadcast(`${launcher}.onClick`);
      jasmine.clock().tick(0);

      expect(chatSub.show.calls.count())
        .toEqual(1);
      expect(webWidgetSub.show.calls.count())
        .toEqual(0);
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

      describe('launcher is not hidden by zE.hide() API call', () => {
        beforeEach(() => {
          mediator.init({ submitTicket: true, helpCenter: false });
        });

        it('shows launcher when chat is connected', () => {
          c.broadcast(`${chat}.onConnected`);

          expect(launcherSub.show.calls.count())
            .toEqual(1);
        });
      });

      describe('launcher is hidden by zE.hide() API call', () => {
        beforeEach(() => {
          mediator.init({ submitTicket: true, helpCenter: false }, { hideLauncher: true });
        });

        it('does not show launcher when chat is online', () => {
          c.broadcast(`${chat}.onConnected`);

          expect(launcherSub.show.calls.count())
            .toEqual(0);
        });
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

 /* ****************************************** *
  *                  ZOPIM API                 *
  * ****************************************** */

  describe('.zopimShow', () => {
    it('doesn\'t hide launcher when on mobile', () => {
      const launcher = 'launcher';
      const names = {
        launcher: launcher
      };

      mockRegistry['utility/devices'].isMobileBrowser = jasmine.createSpy().and.returnValue(true);

      mediator = requireUncached(mediatorPath).mediator;

      c = mediator.channel;
      initSubscriptionSpies(names);
      mediator.init({ submitTicket: true, helpCenter: false });

      c.broadcast('.zopimShow');

      expect(launcherSub.hide.calls.count())
        .toEqual(0);
    });
  });

  describe('.activate', () => {
    const webWidget = 'webWidget';
    const submitTicket = 'ticketSubmissionForm';
    const chat = 'zopimChat';
    const talk = 'talk';
    const beacon = 'beacon';
    const names = {
      webWidget,
      submitTicket,
      chat,
      beacon
    };

    beforeEach(() => {
      initSubscriptionSpies(names);
    });

    it('sends an activate blip', () => {
      mediator.init({ submitTicket: true, helpCenter: false });
      beaconSub.trackUserAction.calls.reset();
      c.broadcast('.activate');

      expect(beaconSub.trackUserAction)
        .toHaveBeenCalledWith('api', 'activate');
    });

    describe('chat and talk used', () => {
      beforeEach(() => {
        mediator.init({ chat: true, talk: true });
      });

      it('show widget when talk and chat are not in connection pending', () => {
        c.broadcast(`${talk}.enabled`, true);
        c.broadcast(`${talk}.agentAvailability`, true);
        c.broadcast(`${chat}.onOnline`);
        c.broadcast(`${chat}.onConnected`);
        c.broadcast('.activate');

        expect(webWidgetSub.show.calls.count())
          .toEqual(1);
      });

      it('does not show widget when talk is in connection pending and chat is not in connection pending', () => {
        c.broadcast(`${chat}.onOnline`);
        c.broadcast(`${chat}.onConnected`);
        c.broadcast('.activate');

        expect(webWidgetSub.show.calls.count())
          .toEqual(0);
      });

      it('does not show widget when talk is not in connection pending and chat is in connection pending', () => {
        c.broadcast(`${talk}.enabled`, true);
        c.broadcast(`${talk}.agentAvailability`, true);
        c.broadcast('.activate');

        expect(webWidgetSub.show.calls.count())
          .toEqual(0);
      });

      it('does not show widget when talk and chat are in connection pending', () => {
        c.broadcast('.activate');
        expect(webWidgetSub.show.calls.count())
          .toEqual(0);
      });
    });

    describe('chat is only used', () => {
      beforeEach(() => {
        mediator.init({ chat: true });
      });

      it('show chat when chat is not in connection pending', () => {
        c.broadcast(`${chat}.onOnline`);
        c.broadcast(`${chat}.onConnected`);
        c.broadcast('.activate');

        expect(chatSub.show.calls.count())
          .toEqual(1);
      });

      it('does not show chat when chat is in connection pending', () => {
        c.broadcast('.activate');

        expect(chatSub.show.calls.count())
          .toEqual(0);
      });
    });

    describe('talk is only used', () => {
      beforeEach(() => {
        mediator.init({ talk: true });
      });

      it('show widget when talk is not in connection pending', () => {
        c.broadcast(`${talk}.enabled`, true);
        c.broadcast(`${talk}.agentAvailability`, true);
        c.broadcast('.activate');

        expect(webWidgetSub.show.calls.count())
          .toEqual(1);
      });

      it('does not show widget when talk is in connection pending', () => {
        c.broadcast('.activate');

        expect(webWidgetSub.show.calls.count())
          .toEqual(0);
      });
    });

    it('not chat and talk used', () => {
      mediator.init({ ticket: true});
      c.broadcast('.activate');

      expect(webWidgetSub.show.calls.count())
        .toEqual(0);
    });
  });

  /* ****************************************** *
  *                     TALK                    *
  * ****************************************** */

  describe('talk.availability', () => {
    const launcher = 'launcher';
    const talk = 'talk';
    const webWidget = 'webWidget';
    const names = {
      launcher,
      talk,
      webWidget
    };

    beforeEach(() => {
      initSubscriptionSpies(names);
      jasmine.clock().install();

      mediator.init({ submitTicket: false, helpCenter: false, talk: true });
    });

    describe('talk.agentAvailability', () => {
      describe('when talk status is true', () => {
        beforeEach(() => {
          c.broadcast('talk.enabled', true);
          c.broadcast('talk.agentAvailability', true);
        });

        it('shows launcher', () => {
          expect(launcherSub.show)
            .toHaveBeenCalled();
        });
      });

      describe('when talk status is false', () => {
        beforeEach(() => {
          c.broadcast('talk.enabled', true);
          c.broadcast('talk.agentAvailability', false);
        });

        it('does not show launcher', () => {
          expect(launcherSub.show)
            .not.toHaveBeenCalled();
        });
      });
    });

    it('does not show launcher if an agent goes offline', () => {
      c.broadcast('talk.enabled', true);
      c.broadcast('talk.agentAvailability', true);

      c.broadcast(`${launcher}.onClick`);
      c.broadcast(`webWidget.onClose`);

      c.broadcast('talk.agentAvailability', false);

      expect(launcherSub.hide)
        .toHaveBeenCalled();
    });

    describe('talk suppress', () => {
      it('shows after activate is called if it is not suppressed', () => {
        mockTalkSuppressedValue = false;
        mediator.init({ submitTicket: false, talk: true });

        c.broadcast(`${talk}.enabled`, true);
        c.broadcast(`${talk}.agentAvailability`, true);

        c.broadcast('.activate');
        jasmine.clock().tick(0);

        expect(webWidgetSub.show.calls.count())
          .toEqual(1);
      });

      it('does not show after activate is called if it is suppressed', () => {
        mockTalkSuppressedValue = true;
        mediator.init({ submitTicket: false, talk: true });

        c.broadcast(`${talk}.enabled`, true);
        c.broadcast(`${talk}.agentAvailability`, true);

        c.broadcast('.activate');
        jasmine.clock().tick(0);

        expect(webWidgetSub.show.calls.count())
          .toEqual(0);
      });
    });
  });
});
