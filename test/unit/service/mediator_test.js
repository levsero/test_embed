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
    ipmSub,
    mockChatSuppressedValue,
    mockHelpCenterSuppressedValue,
    mockContactFormSuppressedValue,
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
       'setLabelChat',
       'setLabelHelp',
       'setLabelChatHelp',
       'setLabelUnreadMsgs',
       'refreshLocale']
    );

    submitTicketSub = jasmine.createSpyObj(
      'submitTicket',
      ['show',
       'showWithAnimation',
       'hide',
       'setLastSearch',
       'prefill',
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
      ['show',
       'showWithAnimation',
       'hide']
    );

    ipmSub = jasmine.createSpyObj(
      'ipm',
      ['activate',
       'identifying',
       'setIpm',
       'show',
       'hide']
    );

    webWidgetSub = jasmine.createSpyObj(
      'webWidget',
      ['show',
       'hide',
       'update',
       'refreshLocale',
       'setZopimOnline',
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
      c.subscribe(`${names.launcher}.setLabelChat`, launcherSub.setLabelChat);
      c.subscribe(`${names.launcher}.setLabelHelp`, launcherSub.setLabelHelp);
      c.subscribe(`${names.launcher}.setLabelChatHelp`, launcherSub.setLabelChatHelp);
      c.subscribe(`${names.launcher}.setLabelUnreadMsgs`, launcherSub.setLabelUnreadMsgs);
      c.subscribe(`${names.launcher}.refreshLocale`, launcherSub.refreshLocale);

      c.subscribe(`${names.submitTicket}.show`, submitTicketSub.show);
      c.subscribe(`${names.submitTicket}.showWithAnimation`, submitTicketSub.show);
      c.subscribe(`${names.submitTicket}.hide`, submitTicketSub.hide);
      c.subscribe(`${names.submitTicket}.setLastSearch`, submitTicketSub.setLastSearch);
      c.subscribe(`${names.submitTicket}.prefill`, submitTicketSub.prefill);
      c.subscribe(`${names.submitTicket}.update`, submitTicketSub.update);

      c.subscribe(`${names.chat}.show`, chatSub.show);
      c.subscribe(`${names.chat}.showWithAnimation`, chatSub.show);
      c.subscribe(`${names.chat}.hide`, chatSub.hide);
      c.subscribe(`${names.chat}.activate`, chatSub.activate);
      c.subscribe(`${names.chat}.setUser`, chatSub.setUser);
      c.subscribe(`${names.chat}.refreshLocale`, chatSub.refreshLocale);

      c.subscribe(`${names.helpCenter}.show`, helpCenterSub.show);
      c.subscribe(`${names.helpCenter}.showWithAnimation`, helpCenterSub.show);
      c.subscribe(`${names.helpCenter}.hide`, helpCenterSub.hide);

      c.subscribe(`${names.ipm}.activate`, ipmSub.activate);
      c.subscribe(`${names.ipm}.identifying`, ipmSub.identifying);
      c.subscribe(`${names.ipm}.setIpm`, ipmSub.setIpm);
      c.subscribe(`${names.ipm}.show`, ipmSub.show);
      c.subscribe(`${names.ipm}.hide`, ipmSub.hide);

      c.subscribe(`${names.webWidget}.hide`, webWidgetSub.hide);
      c.subscribe(`${names.webWidget}.show`, webWidgetSub.show);
      c.subscribe(`${names.webWidget}.update`, webWidgetSub.update);
      c.subscribe(`${names.webWidget}.refreshLocale`, webWidgetSub.refreshLocale);
      c.subscribe(`${names.webWidget}.setZopimOnline`, webWidgetSub.setZopimOnline);
      c.subscribe(`${names.webWidget}.zopimChatStarted`, webWidgetSub.zopimChatStarted);
      c.subscribe(`${names.webWidget}.zopimChatEnded`, webWidgetSub.zopimChatEnded);
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
    const ipm = 'ipm';

    const names = {
      submitTicket,
      chat,
      beacon,
      ipm
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

      it('should broadcast ipm.identifying with given params', () => {
        expect(ipmSub.identifying)
          .toHaveBeenCalledWith(params);
      });

      it('should broadcast beacon.identify with given params', () => {
        expect(beaconSub.identify)
          .toHaveBeenCalledWith(params);
      });

      it('should broadcast submitTicket.prefill with given params', () => {
        expect(submitTicketSub.prefill)
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
        it('should broadcast submitTicket.prefill with name', () => {
          expect(submitTicketSub.prefill)
            .toHaveBeenCalledWith({ name: params.name });
        });

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
          reset(submitTicketSub.prefill);

          c.broadcast('.onIdentify', params);
        });

        it('should not broadcast submitTicket.prefill', () => {
          expect(submitTicketSub.prefill)
            .not.toHaveBeenCalled();
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
    const names = {
      launcher: launcher,
      submitTicket: submitTicket,
      helpCenter: helpCenter,
      authentication: authentication
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

        expect(helpCenterSub.show.calls.count())
          .toEqual(0);

        c.broadcast('webWidget.onClose');
        c.broadcast('authentication.onSuccess');

        c.broadcast(`${launcher}.onClick`);
        jasmine.clock().tick(0);

        expect(helpCenterSub.show.calls.count())
          .toEqual(1);
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

      it('should not call launcher show if ipm.isVisible is true', () => {
        mediator.init({ helpCenter: true }, { helpCenterSignInRequired: true });

        c.broadcast('ipm.onShow');
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
  *                     IPM                    *
  * ****************************************** */

  describe('ipm', () => {
    const ipm = 'ipm';
    const launcher = 'launcher';
    const submitTicket = 'ticketSubmissionForm';
    const chat = 'zopimChat';
    const helpCenter = 'helpCenterForm';

    const names = {
      launcher: launcher,
      submitTicket: submitTicket,
      chat: chat,
      helpCenter: helpCenter,
      ipm: ipm
    };

    beforeEach(() => {
      mockEmailValid = true;
      initSubscriptionSpies(names);
      mediator.init({ submitTicket: true, helpCenter: true });
    });

    describe('.onActivate', () => {
      it('should not broadcast ipm.activate if an embed is visible', () => {
        c.broadcast('.onIdentify', {});

        // identify success
        c.broadcast('identify.onComplete', {});

        // open helpCenter embed
        jasmine.clock().install();
        c.broadcast(`${launcher}.onClick`);
        jasmine.clock().tick(0);

        reset(ipmSub.activate);

        c.broadcast('ipm.onActivate');
        jasmine.clock().tick(2000);

        expect(ipmSub.activate)
          .not.toHaveBeenCalled();
      });

      it('should broadcast ipm.activate if an embed is not visible', () => {
        c.broadcast('.onIdentify', {});

        // identify success
        c.broadcast('identify.onComplete', {});

        c.broadcast(`${launcher}.onClick`);
        c.broadcast('webWidget.onClose');

        reset(ipmSub.activate);

        jasmine.clock().install();
        c.broadcast('ipm.onActivate');
        jasmine.clock().tick(2000);

        expect(ipmSub.activate)
          .toHaveBeenCalled();
      });
    });

    describe('.onClose', () => {
      it('should broadcast launcher.show', () => {
        reset(launcherSub.show);

        c.broadcast('ipm.onClose');

        expect(launcherSub.show)
          .toHaveBeenCalled();
      });

      describe('when `hideOnClose` option is true', () => {
        it('should not broadcast launcher.show', () => {
          c.broadcast('.activate', { hideOnClose: true });

          c.broadcast('ipm.onClose');

          expect(launcherSub.show)
            .not.toHaveBeenCalled();
        });
      });

      describe('when zE.hide() has been called', () => {
        it('should not broadcast launcher.show', () => {
          mediator.init({ submitTicket: true, helpCenter: true }, { hideLauncher: true });

          c.broadcast('ipm.onClose');

          expect(launcherSub.show)
            .not.toHaveBeenCalled();
        });
      });
    });

    describe('.onShow', () => {
      it('should broadcast launcher.hide', () => {
        reset(launcherSub.hide);

        c.broadcast('ipm.onShow');

        expect(launcherSub.hide)
          .toHaveBeenCalled();
      });
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
    const names = {
      launcher: launcher,
      submitTicket: submitTicket,
      chat: chat,
      helpCenter: helpCenter,
      authentication: authentication,
      beacon: beacon
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
        mediator.init({ submitTicket: true, helpCenter: false });

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

        expect(submitTicketSub.show.calls.count())
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

    describe('with Ticket Submission and Chat', () => {
      beforeEach(() => {
        mediator.init({ submitTicket: true, helpCenter: false });
      });

      it('shows label "Chat" if chat is online', () => {
        c.broadcast(`${chat}.onOnline`);

        expect(launcherSub.setLabelChat)
          .toHaveBeenCalled();
      });

      it('resets label "Chat" on launcher.show if chat is online', () => {
        c.broadcast(`${chat}.onOnline`);
        reset(launcherSub.setLabelChat);

        c.broadcast(`${launcher}.show`);

        expect(launcherSub.setLabelChat.calls.count())
          .toEqual(1);
      });

      it('shows label "Help" if chat is offline', () => {
        c.broadcast(`${chat}.onOnline`);
        c.broadcast(`${chat}.onOffline`);

        expect(launcherSub.setLabelHelp.calls.count())
          .toEqual(1);
      });

      it('resets label "Help" on launcher.show if chat is offline', () => {
        c.broadcast(`${chat}.onOffline`);
        reset(launcherSub.setLabelHelp);

        c.broadcast(`${launcher}.show`);

        expect(launcherSub.setLabelHelp.calls.count())
          .toEqual(1);
      });

      it('launches Ticket Submission if chat is offline', () => {
        c.broadcast(`${chat}.onOffline`);

        jasmine.clock().install();
        c.broadcast(`${launcher}.onClick`);
        jasmine.clock().tick(0);

        expect(launcherSub.hide.calls.count())
          .toEqual(1);
        expect(submitTicketSub.show.calls.count())
          .toEqual(1);
        expect(chatSub.show.calls.count())
          .toEqual(0);
      });

      describe('when chat is online', () => {
        beforeEach(() => {
          c.broadcast(`${chat}.onOnline`);

          jasmine.clock().install();
          c.broadcast(`${launcher}.onClick`);
          jasmine.clock().tick(0);
        });

        it('sends a `chat launch` user action blip', () => {
          expect(beaconSub.trackUserAction.calls.count())
            .toEqual(1);
        });

        it('launches chat', () => {
          expect(submitTicketSub.show.calls.count())
            .toEqual(0);
          expect(chatSub.show.calls.count())
            .toEqual(1);
        });
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

        jasmine.clock().install();
        c.broadcast(`${launcher}.onClick`);
        jasmine.clock().tick(0);

        expect(launcherSub.hide.calls.count())
          .toEqual(0);
      });
    });

    describe('with Ticket Submission, Chat and Help Center', () => {
      beforeEach(() => {
        mediator.init({ submitTicket: true, helpCenter: true });
      });

      it('shows label "ChatHelp" if chat is online', () => {
        c.broadcast(`${chat}.onOnline`);

        expect(launcherSub.setLabelChatHelp)
          .toHaveBeenCalled();
      });

      it('resets label "ChatHelp" on launcher.show if chat is online', () => {
        c.broadcast(`${chat}.onOnline`);
        reset(launcherSub.setLabelChatHelp);

        c.broadcast(`${launcher}.show`);

        expect(launcherSub.setLabelChatHelp.calls.count())
          .toEqual(1);
      });

      it('shows label "Help" if chat is offline', () => {
        c.broadcast(`${chat}.onOnline`);
        c.broadcast(`${chat}.onOffline`);

        expect(launcherSub.setLabelHelp.calls.count())
          .toEqual(1);
      });

      it('resets label "Help" on launcher.show if chat is offline', () => {
        c.broadcast(`${chat}.onOffline`);
        reset(launcherSub.setLabelHelp);

        c.broadcast(`${launcher}.show`);

        expect(launcherSub.setLabelHelp.calls.count())
          .toEqual(1);
      });

      it('shows unread messages on launcher.show if chat is online with unread messages', () => {
        c.broadcast(`${chat}.onOnline`);
        c.broadcast(`${chat}.onConnected`);
        c.broadcast(`${chat}.onUnreadMsgs`, 1);
        reset(launcherSub.setLabelUnreadMsgs);

        c.broadcast(`${launcher}.show`);

        expect(launcherSub.setLabelUnreadMsgs.calls.count())
          .toEqual(1);
      });

      it('launches Help Center first', () => {
        jasmine.clock().install();
        c.broadcast(`${launcher}.onClick`);
        jasmine.clock().tick(0);

        expect(helpCenterSub.show.calls.count())
          .toEqual(1);
      });

      it('launches chat when the user moves on to chat and chat is online', () => {
        c.broadcast(`${chat}.onOnline`);
        c.broadcast(`${launcher}.onClick`);  // open
        c.broadcast(`${helpCenter}.onNextClick`);

        reset(chatSub.show);
        reset(helpCenterSub.show);

        c.broadcast(`${chat}.onHide`); // close

        jasmine.clock().install();
        c.broadcast(`${launcher}.onClick`); // open
        jasmine.clock().tick(0);

        expect(chatSub.show.calls.count())
          .toEqual(1);

        expect(helpCenterSub.show.calls.count())
          .toEqual(0);
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

        reset(helpCenterSub.show);
        c.broadcast('webWidget.onClose'); // close
        c.broadcast(`${chat}.onOffline`);

        jasmine.clock().install();
        c.broadcast(`${launcher}.onClick`); // open
        jasmine.clock().tick(0);

        expect(helpCenterSub.show.calls.count())
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
        reset(helpCenterSub.show);

        jasmine.clock().install();
        c.broadcast(`${launcher}.onClick`);
        jasmine.clock().tick(0);

        expect(helpCenterSub.show.calls.count())
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
        reset(helpCenterSub.show);

        jasmine.clock().install();
        c.broadcast(`${launcher}.onClick`);
        jasmine.clock().tick(0);

        expect(helpCenterSub.show.calls.count())
          .toEqual(1);

        expect(chatSub.show.calls.count())
         .toEqual(0);
      });

      it('onNextClick opens to chat always', () => {
        c.broadcast(`${chat}.onOnline`);
        c.broadcast(`${launcher}.onClick`);
        c.broadcast(`${helpCenter}.onNextClick`);

        expect(chatSub.show.calls.count())
          .toEqual(1);
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

        expect(submitTicketSub.show.calls.count())
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
          reset(submitTicketSub.show);
        });

        describe('when position is top', () => {
          it('calls show with `downShow` transition', () => {
            mockPositionValue.vertical = 'top';
            c.broadcast('.activate');

            const calls = submitTicketSub.show.calls;

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

            const calls = submitTicketSub.show.calls;

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

        reset(submitTicketSub.show);
        c.broadcast('.activate');

        expect(submitTicketSub.show.calls.count())
          .toEqual(0);
      });

      describe('when activate is called', () => {
        beforeEach(() => {
          c.broadcast(`${chat}.onOffline`);
          c.broadcast(`${launcher}.onClick`);
          c.broadcast('.hide');

          reset(submitTicketSub.show);
        });

        describe('when position is top', () => {
          it('calls show with `downShow` transition', () => {
            mockPositionValue.vertical = 'top';
            c.broadcast('.activate');

            const calls = submitTicketSub.show.calls;

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

            const calls = submitTicketSub.show.calls;

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

      it('shows ticket submission if chat goes offline', () => {
        c.broadcast(`${chat}.onOnline`);
        c.broadcast(`${chat}.onOffline`);

        reset(submitTicketSub.show);
        reset(chatSub.show);

        jasmine.clock().install();
        c.broadcast(`${launcher}.onClick`);
        jasmine.clock().tick(10);

        expect(submitTicketSub.show.calls.count())
          .toEqual(1);

        expect(chatSub.show.calls.count())
          .toEqual(0);
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

        reset(helpCenterSub.show);

        c.broadcast('webWidget.onClose'); // close

        jasmine.clock().install();
        c.broadcast(`${launcher}.onClick`); // open
        jasmine.clock().tick(0);

        expect(helpCenterSub.show.calls.count())
          .toEqual(1);
      });

      it('does not show after activate is called and was visible before hidden', () => {
        c.broadcast(`${launcher}.onClick`);
        c.broadcast(`${helpCenter}.onNextClick`);

        c.broadcast('.hide');

        reset(submitTicketSub.show);
        c.broadcast('.activate');

        expect(submitTicketSub.show.calls.count())
          .toEqual(0);
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
    const names = {
      launcher: launcher,
      submitTicket: submitTicket,
      chat: chat,
      helpCenter: helpCenter
    };

    beforeEach(() => {
      initSubscriptionSpies(names);
    });

    describe('standalone', () => {
      beforeEach(() => {
        mediator.init({ submitTicket: false, helpCenter: false });
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

      it('updates launcher with unread message count if chat is online', () => {
        c.broadcast(`${chat}.onOnline`);
        c.broadcast(`${chat}.onConnected`);
        c.broadcast(`${chat}.onUnreadMsgs`, 5);

        expect(launcherSub.setLabelUnreadMsgs.calls.count())
          .toEqual(1);
        expect(launcherSub.setLabelUnreadMsgs)
          .toHaveBeenCalledWith(5);
      });

      it('resets launcher label to Chat when unread message count is 0', () => {
        c.broadcast(`${chat}.onOnline`);
        c.broadcast(`${chat}.onConnected`);
        c.broadcast(`${chat}.onUnreadMsgs`, 5);

        reset(launcherSub.setLabelUnreadMsgs);
        reset(launcherSub.setLabelChat);

        c.broadcast(`${chat}.onUnreadMsgs`, 0);

        expect(launcherSub.setLabelUnreadMsgs.calls.count())
          .toEqual(0);
        expect(launcherSub.setLabelChat.calls.count())
          .toEqual(1);
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
              expect(submitTicketSub.show.calls.count())
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
        mediator.init({ submitTicket: true, helpCenter: true });
      });

      it('resets launcher label to ChatHelp when unread message count is 0', () => {
        c.broadcast(`${chat}.onOnline`);
        c.broadcast(`${chat}.onConnected`);
        c.broadcast(`${chat}.onUnreadMsgs`, 5);

        reset(launcherSub.setLabelUnreadMsgs);
        reset(launcherSub.setLabelChatHelp);

        c.broadcast(`${chat}.onUnreadMsgs`, 0);

        expect(launcherSub.setLabelUnreadMsgs.calls.count())
          .toEqual(0);
        expect(launcherSub.setLabelChatHelp.calls.count())
          .toEqual(1);
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

      it('does not reset the active embed if it goes offline and was not online initally', () => {
        c.broadcast('.zopimShow');
        c.broadcast(`${chat}.onOffline`);
        c.broadcast(`${chat}.onOnline`);

        jasmine.clock().install();
        c.broadcast(`${launcher}.onClick`); // open
        jasmine.clock().tick(0);

        expect(helpCenterSub.show.calls.count())
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
    const names = {
      launcher: launcher,
      submitTicket: submitTicket,
      helpCenter: helpCenter,
      chat: chat
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

        expect(helpCenterSub.show.calls.count())
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

        expect(helpCenterSub.show.calls.count())
          .toEqual(1);
      });
    });

    it('triggers Ticket Submission setLastSearch with last search params', () => {
      const params = {
        searchString: 'a search',
        searchLocale: 'en-US'
      };

      reset(submitTicketSub.setLastSearch);

      c.broadcast(`${helpCenter}.onSearch`, params);

      expect(submitTicketSub.setLastSearch.calls.count())
        .toEqual(1);

      expect(submitTicketSub.setLastSearch)
        .toHaveBeenCalledWith(params);
    });

    describe('when activate is called', () => {
      beforeEach(() => {
        c.broadcast('.hide');
        reset(helpCenterSub.show);
      });

      describe('when position is top', () => {
        it('calls show with `downShow` transition', () => {
          mockPositionValue.vertical = 'top';
          c.broadcast('.activate');

          const calls = helpCenterSub.show.calls;

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

          const calls = helpCenterSub.show.calls;

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

      reset(helpCenterSub.show);
      c.broadcast('.activate');

      expect(helpCenterSub.show.calls.count())
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
      mediator.init({ submitTicket: true, helpCenter: true }, { helpCenterSignInRequired: true });

      jasmine.clock().install();
      c.broadcast(`${launcher}.onClick`);
      jasmine.clock().tick(0);

      expect(submitTicketSub.show.calls.count())
        .toEqual(1);

      expect(helpCenterSub.show.calls.count())
        .toEqual(0);
    });

    it('should set helpCenterForm to available if sign in is required and is on a hc page', () => {
      mockOnHelpCenterPageValue = true;

      mediator.init({ submitTicket: true, helpCenter: true }, { helpCenterSignInRequired: true });

      jasmine.clock().install();
      c.broadcast(`${launcher}.onClick`);
      jasmine.clock().tick(0);

      expect(submitTicketSub.show.calls.count())
        .toEqual(0);

      expect(helpCenterSub.show.calls.count())
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

    it('broadcasts webWidget.setZopimOnline with false when zopimChat.onOffline is recieved', () => {
      c.broadcast('zopimChat.onOnline');
      c.broadcast('zopimChat.onOffline');

      expect(webWidgetSub.setZopimOnline)
        .toHaveBeenCalledWith(false);
    });

    it('broadcasts webWidget.setZopimOnline with true when zopimChat.onOnline is recieved', () => {
      c.broadcast('zopimChat.onOnline');

      expect(webWidgetSub.setZopimOnline)
        .toHaveBeenCalledWith(true);
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
    const names = {
      launcher: launcher,
      submitTicket: submitTicket,
      helpCenter: helpCenter,
      chat: chat
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
          mediator.init({ submitTicket: true, helpCenter: false });
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

          expect(helpCenterSub.show.calls.count())
            .toEqual(1);
        });
      });

      describe('when chat and help center are available', () => {
        beforeEach(() => {
          mediator.init({ submitTicket: true, helpCenter: true });
        });

        it('should open to help center', () => {
          c.broadcast(`${launcher}.onClick`);
          jasmine.clock().tick(0);

          expect(helpCenterSub.show.calls.count())
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

        expect(submitTicketSub.show.calls.count())
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
        it('should disable suppression', () => {
          c.broadcast(`${chat}.onIsChatting`);

          reset(chatSub.show);

          c.broadcast(`${chat}.onHide`); // close

          c.broadcast(`${launcher}.onClick`); // open
          jasmine.clock().tick(0);

          expect(chatSub.show.calls.count())
            .toEqual(1);
        });
      });
    });

    it('should not display help center if it is suppressed', () => {
      mockHelpCenterSuppressedValue = true;
      mediator.init({ submitTicket: true, helpCenter: true });

      c.broadcast(`${launcher}.onClick`);
      jasmine.clock().tick(0);

      expect(submitTicketSub.show.calls.count())
        .toEqual(1);
      expect(helpCenterSub.show.calls.count())
        .toEqual(0);
    });

    it('does not display chat or helpCenter if they are suppressed', () => {
      mockChatSuppressedValue = true;
      mockHelpCenterSuppressedValue = true;
      mediator.init({ submitTicket: true, helpCenter: true });

      c.broadcast(`${chat}.isOnline`);

      c.broadcast(`${launcher}.onClick`);
      jasmine.clock().tick(0);

      expect(submitTicketSub.show.calls.count())
        .toEqual(1);
      expect(chatSub.show.calls.count())
        .toEqual(0);
      expect(helpCenterSub.show.calls.count())
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
    const launcher = 'launcher';
    const submitTicket = 'ticketSubmissionForm';
    const beacon = 'beacon';
    const names = {
      launcher: launcher,
      submitTicket: submitTicket,
      beacon
    };

    beforeEach(() => {
      initSubscriptionSpies(names);
      mediator.init({ submitTicket: true, helpCenter: false });
      beaconSub.trackUserAction.calls.reset();
      c.broadcast('.activate');
    });

    it('should send an activate blip', () => {
      expect(beaconSub.trackUserAction)
        .toHaveBeenCalledWith('api', 'activate');
    });
  });
});
