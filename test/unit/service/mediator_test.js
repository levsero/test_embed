describe('mediator', function() {
  let mockRegistry,
    mediator,
    c,
    authenticationSub,
    beaconSub,
    launcherSub,
    submitTicketSub,
    chatSub,
    helpCenterSub,
    npsSub,
    ipmSub,
    initSubscriptionSpies;

  const reset = function(spy) {
    spy.calls.reset();
  };
  const mediatorPath = buildSrcPath('service/mediator');

  beforeEach(function() {
    mockery.enable();

    mockRegistry = initMockRegistry({
      'utility/devices':  {
        isMobileBrowser: jasmine.createSpy().and.returnValue(false)
      },
      'utility/scrollHacks': jasmine.createSpyObj(
        'scrollHacks',
        ['setScrollKiller',
         'setWindowScroll',
         'revertWindowScroll']
      )
    });

    mediator = requireUncached(mediatorPath).mediator;

    c = mediator.channel;

    authenticationSub = jasmine.createSpyObj(
      'authentication',
      ['logout']
    );

    beaconSub = jasmine.createSpyObj(
      'beacon',
      ['identify']
    );

    launcherSub = jasmine.createSpyObj(
      'launcher',
      ['hide',
       'show',
       'setLabelChat',
       'setLabelHelp',
       'setLabelChatHelp',
       'setLabelUnreadMsgs']
    );

    submitTicketSub = jasmine.createSpyObj(
      'submitTicket',
      ['show',
       'showWithAnimation',
       'hide',
       'showBackButton',
       'setLastSearch',
       'prefill',
       'update']
    );

    chatSub = jasmine.createSpyObj(
      'chat',
      ['show',
       'showWithAnimation',
       'hide',
       'setUser']
    );

    helpCenterSub = jasmine.createSpyObj(
      'helpCenter',
      ['show',
       'showWithAnimation',
       'hide',
       'setNextToChat',
       'setNextToSubmitTicket']
    );

    npsSub = jasmine.createSpyObj(
      'nps',
      ['activate',
       'setSurvey',
       'show',
       'hide']
    );

    ipmSub = jasmine.createSpyObj(
      'ipm',
      ['activate',
       'setIpm',
       'show',
       'hide']
    );

    initSubscriptionSpies = function(names) {
      c.subscribe(`${names.beacon}.identify`, beaconSub.identify);

      c.subscribe(`${names.authentication}.logout`, authenticationSub.logout);

      c.subscribe(`${names.launcher}.hide`, launcherSub.hide);
      c.subscribe(`${names.launcher}.show`, launcherSub.show);
      c.subscribe(`${names.launcher}.setLabelChat`, launcherSub.setLabelChat);
      c.subscribe(`${names.launcher}.setLabelHelp`, launcherSub.setLabelHelp);
      c.subscribe(`${names.launcher}.setLabelChatHelp`, launcherSub.setLabelChatHelp);
      c.subscribe(`${names.launcher}.setLabelUnreadMsgs`, launcherSub.setLabelUnreadMsgs);

      c.subscribe(`${names.submitTicket}.show`, submitTicketSub.show);
      c.subscribe(`${names.submitTicket}.showWithAnimation`, submitTicketSub.show);
      c.subscribe(`${names.submitTicket}.hide`, submitTicketSub.hide);
      c.subscribe(`${names.submitTicket}.showBackButton`, submitTicketSub.showBackButton);
      c.subscribe(`${names.submitTicket}.setLastSearch`, submitTicketSub.setLastSearch);
      c.subscribe(`${names.submitTicket}.prefill`, submitTicketSub.prefill);
      c.subscribe(`${names.submitTicket}.update`, submitTicketSub.update);

      c.subscribe(`${names.chat}.show`, chatSub.show);
      c.subscribe(`${names.chat}.showWithAnimation`, chatSub.show);
      c.subscribe(`${names.chat}.hide`, chatSub.hide);
      c.subscribe(`${names.chat}.setUser`, chatSub.setUser);

      c.subscribe(`${names.helpCenter}.show`, helpCenterSub.show);
      c.subscribe(`${names.helpCenter}.showWithAnimation`, helpCenterSub.show);
      c.subscribe(`${names.helpCenter}.hide`, helpCenterSub.hide);
      c.subscribe(`${names.helpCenter}.setNextToChat`, helpCenterSub.setNextToChat);
      c.subscribe(`${names.helpCenter}.setNextToSubmitTicket`, helpCenterSub.setNextToSubmitTicket);

      c.subscribe(`${names.nps}.activate`, npsSub.activate);
      c.subscribe(`${names.nps}.setSurvey`, npsSub.setSurvey);
      c.subscribe(`${names.nps}.show`, npsSub.show);
      c.subscribe(`${names.nps}.hide`, npsSub.hide);

      c.subscribe(`${names.ipm}.activate`, ipmSub.activate);
      c.subscribe(`${names.ipm}.setIpm`, ipmSub.setIpm);
      c.subscribe(`${names.ipm}.show`, ipmSub.show);
      c.subscribe(`${names.ipm}.hide`, ipmSub.hide);
    };
  });

  afterEach(function() {
    jasmine.clock().uninstall();
    mockery.deregisterAll();
    mockery.disable();
  });

 /* ****************************************** *
  *                  IDENTIFY                  *
  * ****************************************** */

  describe('.onIdentify', function() {
    const submitTicket = 'ticketSubmissionForm';
    const chat = 'zopimChat';
    const beacon = 'beacon';

    const names = {
      submitTicket: submitTicket,
      chat: chat,
      beacon: beacon
    };

    beforeEach(function() {
      initSubscriptionSpies(names);
      mediator.init(false);
    });

    it('should broadcast beacon.identify with given params', function() {
      const params = {
        user: 'James Dean',
        email: 'james@dean.com'
      };

      c.broadcast('.onIdentify', params);

      expect(beaconSub.identify)
        .toHaveBeenCalledWith(params);
    });

    it('should broadcast submitTicket.prefill with given params', function() {
      const params = {
        user: 'James Dean',
        email: 'james@dean.com'
      };

      c.broadcast('.onIdentify', params);

      expect(submitTicketSub.prefill)
        .toHaveBeenCalledWith(params);
    });

    it('should broadcast chat.setUser with given params', function() {
      const params = {
        user: 'James Dean',
        email: 'james@dean.com'
      };

      c.broadcast('.onIdentify', params);

      expect(chatSub.setUser)
        .toHaveBeenCalledWith(params);
    });
  });

  describe('identify.onSuccess', function() {
    describe('nps', function() {
      const nps = 'nps';
      const names = {
        nps: nps
      };

      it('should broadcast nps.setSurvey with params', function() {
        initSubscriptionSpies(names);
        mediator.init(false);

        const survey = {
          npsSurvey: {
            id: 199
          }
        };

        c.broadcast('identify.onSuccess', survey);

        expect(npsSub.setSurvey)
          .toHaveBeenCalled();

        const params = npsSub.setSurvey.calls.mostRecent().args[0];

        expect(params.npsSurvey.id)
          .toEqual(199);
      });
    });

    describe('ipm', function() {
      const ipm = 'ipm';
      const names = {
        ipm: ipm
      };

      it('should broadcast ipm.setIpm with params', function() {
        initSubscriptionSpies(names);
        mediator.init(false);

        const response = {
          pendingCampaign: {
            id: 199
          }
        };

        c.broadcast('identify.onSuccess', response);

        expect(ipmSub.setIpm)
          .toHaveBeenCalled();

        const params = ipmSub.setIpm.calls.mostRecent().args[0];

        expect(params.pendingCampaign.id)
          .toEqual(199);
      });
    });
  });

 /* ****************************************** *
  *                 AUTHENTICATE               *
  * ****************************************** */

  describe('.onAuthenticate', function() {
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

    beforeEach(function() {
      initSubscriptionSpies(names);
      mediator.init(false);
    });

    describe('onSuccess', function() {
      it('should set helpCenterForm to available if sign in required is passed in', function() {
        mediator.init(true, { helpCenterSignInRequired: true });

        jasmine.clock().install();
        c.broadcast(`${launcher}.onClick`);
        jasmine.clock().tick(0);

        expect(helpCenterSub.show.calls.count())
          .toEqual(0);

        c.broadcast(`${submitTicket}.onClose`);
        c.broadcast('authentication.onSuccess');

        c.broadcast(`${launcher}.onClick`);
        jasmine.clock().tick(0);

        expect(helpCenterSub.show.calls.count())
          .toEqual(1);
      });

      it('should not set helpCenterForm to available if sign in required is not passed in', function() {
        mediator.init(false);

        jasmine.clock().install();
        c.broadcast(`${launcher}.onClick`);
        jasmine.clock().tick(0);

        expect(helpCenterSub.show.calls.count())
          .toEqual(0);

        c.broadcast(`${submitTicket}.onClose`);
        c.broadcast('authentication.onSuccess');

        c.broadcast(`${launcher}.onClick`);
        jasmine.clock().tick(0);

        expect(helpCenterSub.show.calls.count())
          .toEqual(0);
      });
    });
  });

  describe('.logout', function() {
    const names = {
      authentication: 'authentication'
    };

    beforeEach(function() {
      initSubscriptionSpies(names);
      mediator.init(false);
    });

    it('should broadcast authentication.logout', function() {
      c.broadcast('.logout');

      expect(authenticationSub.logout)
        .toHaveBeenCalled();
    });
  });

 /* ****************************************** *
  *                     NPS                    *
  * ****************************************** */

  describe('nps', function() {
    const nps = 'nps';
    const launcher = 'launcher';
    const submitTicket = 'ticketSubmissionForm';
    const chat = 'zopimChat';
    const helpCenter = 'helpCenterForm';

    const names = {
      launcher: launcher,
      submitTicket: submitTicket,
      chat: chat,
      helpCenter: helpCenter,
      nps: nps
    };

    beforeEach(function() {
      initSubscriptionSpies(names);
      mediator.init(true);
    });

    describe('.onActivate', function() {
      it('should broadcast nps.activate if identify.pending is false', function() {
        c.broadcast('identify.onSuccess', {});

        reset(npsSub.activate);

        jasmine.clock().install();
        c.broadcast('nps.onActivate');
        jasmine.clock().tick(2000);

        expect(npsSub.activate)
          .toHaveBeenCalled();
      });

      it('should not broadcast nps.activate if identify.pending is true', function() {
        c.broadcast('.onIdentify', {});

        reset(npsSub.activate);

        jasmine.clock().install();
        c.broadcast('nps.onActivate');
        jasmine.clock().tick(2000);

        expect(npsSub.activate)
          .not.toHaveBeenCalled();
      });

      it('should not broadcast nps.activate if an embed is visible', function() {
        c.broadcast('.onIdentify', {});

        // identify success, identify.pending => false
        c.broadcast('identify.onSuccess', {});

        // open helpCenter embed
        c.broadcast(`${launcher}.onClick`);

        reset(npsSub.activate);

        jasmine.clock().install();
        c.broadcast('nps.onActivate');
        jasmine.clock().tick(2000);

        expect(npsSub.activate)
          .not.toHaveBeenCalled();
      });

      it('should broadcast nps.activate if an embed is not visible', function() {
        c.broadcast('.onIdentify', {});

        // identify success, identify.pending => false
        c.broadcast('identify.onSuccess', {});

        c.broadcast(`${launcher}.onClick`);
        c.broadcast(`${helpCenter}.onNextClick`);
        c.broadcast(`${submitTicket}.onClose`);

        reset(npsSub.activate);

        jasmine.clock().install();
        c.broadcast('nps.onActivate');
        jasmine.clock().tick(2000);

        expect(npsSub.activate)
          .toHaveBeenCalled();
      });

      it('should not broadcast nps.activate if an embed was activated while identify.pending', function() {
        c.broadcast('.onIdentify', {});

        // identify still in-flight
        jasmine.clock().install();
        c.broadcast('nps.onActivate');

        expect(npsSub.activate)
          .not.toHaveBeenCalled();

        jasmine.clock().tick(1000);

        // embed visible while identify still inflight
        c.broadcast(`${launcher}.onClick`);

        jasmine.clock().tick(1000);

        // identify completed
        c.broadcast('identify.onSuccess', {});

        jasmine.clock().tick(1000);

        expect(npsSub.activate)
          .not.toHaveBeenCalled();
      });
    });

    describe('.onClose', function() {
      it('should broadcast launcher.show', function() {
        reset(launcherSub.show);

        c.broadcast('nps.onClose');

        expect(launcherSub.show)
          .toHaveBeenCalled();
      });
    });

    describe('.onShow', function() {
      it('should broadcast launcher.hide', function() {
        reset(launcherSub.hide);

        c.broadcast('nps.onShow');

        expect(launcherSub.hide)
          .toHaveBeenCalled();
      });
    });
  });

 /* ****************************************** *
  *                     IPM                    *
  * ****************************************** */

  describe('ipm', function() {
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

    beforeEach(function() {
      initSubscriptionSpies(names);
      mediator.init(true);
    });

    describe('.onActivate', function() {
      it('should broadcast ipm.activate if identify.pending is false', function() {
        c.broadcast('identify.onSuccess', {});

        reset(ipmSub.activate);

        jasmine.clock().install();
        c.broadcast('ipm.onActivate');
        jasmine.clock().tick(2000);

        expect(ipmSub.activate)
          .toHaveBeenCalled();
      });

      it('should not broadcast ipm.activate if identify.pending is true', function() {
        c.broadcast('.onIdentify', {});

        reset(ipmSub.activate);

        jasmine.clock().install();
        c.broadcast('ipm.onActivate');
        jasmine.clock().tick(2000);

        expect(ipmSub.activate)
          .not.toHaveBeenCalled();
      });

      it('should not broadcast ipm.activate if an embed is visible', function() {
        c.broadcast('.onIdentify', {});

        // identify success, identify.pending => false
        c.broadcast('identify.onSuccess', {});

        // open helpCenter embed
        c.broadcast(`${launcher}.onClick`);

        reset(ipmSub.activate);

        jasmine.clock().install();
        c.broadcast('ipm.onActivate');
        jasmine.clock().tick(2000);

        expect(ipmSub.activate)
          .not.toHaveBeenCalled();
      });

      it('should broadcast ipm.activate if an embed is not visible', function() {
        c.broadcast('.onIdentify', {});

        // identify success, identify.pending => false
        c.broadcast('identify.onSuccess', {});

        c.broadcast(`${launcher}.onClick`);
        c.broadcast(`${helpCenter}.onNextClick`);
        c.broadcast(`${submitTicket}.onClose`);

        reset(ipmSub.activate);

        jasmine.clock().install();
        c.broadcast('ipm.onActivate');
        jasmine.clock().tick(2000);

        expect(ipmSub.activate)
          .toHaveBeenCalled();
      });

      it('should not broadcast ipm.activate if an embed was activated while identify.pending', function() {
        c.broadcast('.onIdentify', {});

        // identify still in-flight
        jasmine.clock().install();
        c.broadcast('ipm.onActivate');

        expect(ipmSub.activate)
          .not.toHaveBeenCalled();

        jasmine.clock().tick(1000);

        // embed visible while identify still inflight
        c.broadcast(`${launcher}.onClick`);

        jasmine.clock().tick(1000);

        // identify completed
        c.broadcast('identify.onSuccess', {});

        jasmine.clock().tick(1000);

        expect(ipmSub.activate)
          .not.toHaveBeenCalled();
      });
    });

    describe('.onClose', function() {
      it('should broadcast launcher.show', function() {
        reset(launcherSub.show);

        c.broadcast('ipm.onClose');

        expect(launcherSub.show)
          .toHaveBeenCalled();
      });
    });

    describe('.onShow', function() {
      it('should broadcast launcher.hide', function() {
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

  describe('Launcher', function() {
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

    beforeEach(function() {
      initSubscriptionSpies(names);
    });

    describe('with Ticket Submission', function() {
      beforeEach(function() {
        mediator.init(false);
      });

      it('hides when a hide call is made', function() {
        c.broadcast('.hide');

        expect(launcherSub.hide.calls.count())
          .toEqual(1);
      });

      it('shows when a show call is made', function() {
        c.broadcast('.show');

        expect(launcherSub.show.calls.count())
          .toEqual(1);
      });

      it('shows and hides launcher when a activate call is made', function() {
        c.broadcast('.activate');

        expect(launcherSub.hide.calls.count())
          .toEqual(1);
      });

      it('hides when onClick is called on mobile', function() {
        mockRegistry['utility/devices'].isMobileBrowser
          .and.returnValue(true);

        c.broadcast(`${launcher}.onClick`);

        expect(launcherSub.hide.calls.count())
          .toEqual(1);
      });

      it('launches Ticket Submission', function() {
        jasmine.clock().install();
        c.broadcast(`${launcher}.onClick`);
        jasmine.clock().tick(0);

        expect(submitTicketSub.show.calls.count())
          .toEqual(1);
        expect(launcherSub.hide.calls.count())
          .toEqual(1);
      });

      it('activates setScrollKiller and setWindowScroll on mobile', function() {
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
    });

    describe('with Ticket Submission and Chat', function() {
      beforeEach(function() {
        mediator.init(false);
      });

      it('shows label "Chat" if chat is online', function() {
        c.broadcast(`${chat}.onOnline`);

        expect(launcherSub.setLabelChat)
          .toHaveBeenCalled();
      });

      it('resets label "Chat" on launcher.show if chat is online', function() {
        c.broadcast(`${chat}.onOnline`);
        reset(launcherSub.setLabelChat);

        c.broadcast(`${launcher}.show`);

        expect(launcherSub.setLabelChat.calls.count())
          .toEqual(1);
      });

      it('shows label "Help" if chat is offline', function() {
        c.broadcast(`${chat}.onOnline`);
        c.broadcast(`${chat}.onOffline`);

        expect(launcherSub.setLabelHelp.calls.count())
          .toEqual(1);
      });

      it('resets label "Help" on launcher.show if chat is offline', function() {
        c.broadcast(`${chat}.onOffline`);
        reset(launcherSub.setLabelHelp);

        c.broadcast(`${launcher}.show`);

        expect(launcherSub.setLabelHelp.calls.count())
          .toEqual(1);
      });

      it('launches Ticket Submission if chat is offline', function() {
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

      it('launches Chat if chat is online', function() {
        c.broadcast(`${chat}.onOnline`);

        jasmine.clock().install();
        c.broadcast(`${launcher}.onClick`);
        jasmine.clock().tick(0);

        expect(submitTicketSub.show.calls.count())
          .toEqual(0);
        expect(chatSub.show.calls.count())
          .toEqual(1);
      });

      it('does not hide if launching chat on mobile', function() {
        mockRegistry['utility/devices'].isMobileBrowser
          .and.returnValue(true);

        c.broadcast(`${chat}.onOnline`);
        c.broadcast(`${launcher}.onClick`);

        expect(launcherSub.hide.calls.count())
          .toEqual(0);
      });

      it('doesn\'t hide when onClick is called on mobile and chat is online', function() {
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

    describe('with Ticket Submission, Chat and Help Center', function() {
      beforeEach(function() {
        mediator.init(true);
      });

      it('shows label "ChatHelp" if chat is online', function() {
        c.broadcast(`${chat}.onOnline`);

        expect(launcherSub.setLabelChatHelp)
          .toHaveBeenCalled();
      });

      it('resets label "ChatHelp" on launcher.show if chat is online', function() {
        c.broadcast(`${chat}.onOnline`);
        reset(launcherSub.setLabelChatHelp);

        c.broadcast(`${launcher}.show`);

        expect(launcherSub.setLabelChatHelp.calls.count())
          .toEqual(1);
      });

      it('shows label "Help" if chat is offline', function() {
        c.broadcast(`${chat}.onOnline`);
        c.broadcast(`${chat}.onOffline`);

        expect(launcherSub.setLabelHelp.calls.count())
          .toEqual(1);
      });

      it('resets label "Help" on launcher.show if chat is offline', function() {
        c.broadcast(`${chat}.onOffline`);
        reset(launcherSub.setLabelHelp);

        c.broadcast(`${launcher}.show`);

        expect(launcherSub.setLabelHelp.calls.count())
          .toEqual(1);
      });

      it('shows unread messages on launcher.show if chat is online with unread messages', function() {
        c.broadcast(`${chat}.onOnline`);
        c.broadcast(`${chat}.onUnreadMsgs`, 1);
        reset(launcherSub.setLabelUnreadMsgs);

        c.broadcast(`${launcher}.show`);

        expect(launcherSub.setLabelUnreadMsgs.calls.count())
          .toEqual(1);
      });

      it('launches Help Center first', function() {
        jasmine.clock().install();
        c.broadcast(`${launcher}.onClick`);
        jasmine.clock().tick(0);

        expect(helpCenterSub.show.calls.count())
          .toEqual(1);
      });

      it('launches chat if user has moved on to chat and chat is online', function() {
        c.broadcast(`${chat}.onOnline`);
        c.broadcast(`${launcher}.onClick`);  // open
        c.broadcast(`${helpCenter}.onNextClick`);

        reset(chatSub.show);
        reset(helpCenterSub.show);

        c.broadcast(`${helpCenter}.onClose`); // close

        jasmine.clock().install();
        c.broadcast(`${launcher}.onClick`); // open
        jasmine.clock().tick(0);

        expect(chatSub.show.calls.count())
          .toEqual(1);

        expect(helpCenterSub.show.calls.count())
          .toEqual(0);
      });

      it('launches help center if user has moved on to chat and chat goes offline', function() {
        c.broadcast(`${chat}.onOnline`);
        c.broadcast(`${launcher}.onClick`);  // open
        c.broadcast(`${helpCenter}.onNextClick`);

        reset(helpCenterSub.show);
        c.broadcast(`${helpCenter}.onClose`); // close
        c.broadcast(`${chat}.onOffline`);

        jasmine.clock().install();
        c.broadcast(`${launcher}.onClick`); // open
        jasmine.clock().tick(0);

        expect(helpCenterSub.show.calls.count())
          .toEqual(1);
      });

      it('launches chat if chat is online and there are unread messages', function() {
        c.broadcast(`${chat}.onOnline`);
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

      it('launches help center if chat is offline and there are unread messages', function() {
        c.broadcast(`${chat}.onOnline`);
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
    });
  });

 /* ****************************************** *
  *             TICKET SUBMISSION              *
  * ****************************************** */

  describe('Ticket Submission', function() {
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

    beforeEach(function() {
      initSubscriptionSpies(names);
    });

    describe('standalone', function() {
      beforeEach(function() {
        mediator.init(false);
      });

      it('shows launcher on close', function() {
        jasmine.clock().install();
        c.broadcast(`${launcher}.onClick`);
        jasmine.clock().tick(0);

        expect(submitTicketSub.show.calls.count())
          .toEqual(1);
        expect(launcherSub.hide.calls.count())
          .toEqual(1);

        c.broadcast(`${submitTicket}.onClose`);

        expect(launcherSub.show.calls.count())
          .toEqual(1);
      });

      it('hides when a hide call is made', function() {
        c.broadcast('.hide');

        expect(submitTicketSub.hide.calls.count())
          .toEqual(1);
      });

      it('reverts setScrollKiller and setWindowScroll on mobile onClose', function() {
        const setScrollKiller = mockRegistry['utility/scrollHacks'].setScrollKiller;
        const revertWindowScroll = mockRegistry['utility/scrollHacks'].revertWindowScroll;

        mockRegistry['utility/devices'].isMobileBrowser
          .and.returnValue(true);

        c.broadcast(`${launcher}.onClick`);

        reset(setScrollKiller);
        reset(revertWindowScroll);

        c.broadcast(`${submitTicket}.onClose`);

        expect(setScrollKiller)
          .toHaveBeenCalledWith(false);

        expect(setScrollKiller.calls.count())
          .toEqual(1);

        expect(revertWindowScroll.calls.count())
          .toEqual(1);
      });

      it('shows after activate is called', function() {
        c.broadcast('.hide');

        reset(submitTicketSub.show);
        c.broadcast('.activate');

        expect(submitTicketSub.show.calls.count())
          .toEqual(1);
      });

      it('hides after show is called', function() {
        reset(submitTicketSub.hide);
        c.broadcast('.show');

        expect(submitTicketSub.hide.calls.count())
          .toEqual(1);
      });

      it('shows launcher on cancel if helpcenter is not available', function() {
        reset(launcherSub.show);
        c.broadcast(`${submitTicket}.onCancelClick`);

        expect(launcherSub.show.calls.count())
          .toEqual(1);
      });

      it('doesn\'t show launcher on cancel if .hideOnClose is true', function() {
        reset(launcherSub.show);

        c.broadcast('.activate', {hideOnClose: true});
        c.broadcast(`${submitTicket}.onCancelClick`);

        expect(launcherSub.show.calls.count())
          .toEqual(0);
      });

      it('shows after activate is called and chat is offline', function() {
        c.broadcast(`${chat}.onOffline`);
        c.broadcast(`${launcher}.onClick`);

        c.broadcast('.hide');

        reset(submitTicketSub.show);
        c.broadcast('.activate');

        expect(submitTicketSub.show.calls.count())
          .toEqual(1);
      });

      describe('.orientationChange', function() {
        it('calls update on submitTicket', function() {
          c.broadcast('.orientationChange');

          expect(submitTicketSub.update)
            .toHaveBeenCalled();
        });
      });
    });

    describe('with chat', function() {
      beforeEach(function() {
        mediator.init(false);
      });

      it('shows ticket submission if chat goes offline', function() {
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

    describe('with Help Center', function() {
      beforeEach(function() {
        mediator.init(true);
      });

      it('goes back to help center', function() {
        c.broadcast(`${launcher}.onClick`);
        c.broadcast(`${helpCenter}.onNextClick`);

        reset(helpCenterSub.show);
        reset(submitTicketSub.hide);

        jasmine.clock().install();
        c.broadcast(`${submitTicket}.onBackClick`);
        jasmine.clock().tick(10);

        expect(helpCenterSub.show.calls.count())
          .toEqual(1);

        expect(submitTicketSub.hide.calls.count())
          .toEqual(1);
      });

      it('sets Help Center as active embed after form submit', function() {
        c.broadcast(`${launcher}.onClick`);
        c.broadcast(`${helpCenter}.onNextClick`);

        c.broadcast(`${submitTicket}.onFormSubmitted`);

        reset(helpCenterSub.show);

        c.broadcast(`${submitTicket}.onClose`); // close

        jasmine.clock().install();
        c.broadcast(`${launcher}.onClick`); // open
        jasmine.clock().tick(0);

        expect(helpCenterSub.show.calls.count())
          .toEqual(1);
      });

      it('does not show after activate is called and was visible before hidden', function() {
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

  describe('Chat', function() {
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

    beforeEach(function() {
      initSubscriptionSpies(names);
    });

    describe('with Ticket Submission', function() {
      beforeEach(function() {
        mediator.init(false);
      });

      it('updates launcher with unread message count if chat is online', function() {
        c.broadcast(`${chat}.onOnline`);
        c.broadcast(`${chat}.onUnreadMsgs`, 5);

        expect(launcherSub.setLabelUnreadMsgs.calls.count())
          .toEqual(1);
        expect(launcherSub.setLabelUnreadMsgs)
          .toHaveBeenCalledWith(5);
      });

      it('resets launcher label to Chat when unread message count is 0', function() {
        c.broadcast(`${chat}.onOnline`);
        c.broadcast(`${chat}.onUnreadMsgs`, 5);

        reset(launcherSub.setLabelUnreadMsgs);
        reset(launcherSub.setLabelChat);

        c.broadcast(`${chat}.onUnreadMsgs`, 0);

        expect(launcherSub.setLabelUnreadMsgs.calls.count())
          .toEqual(0);
        expect(launcherSub.setLabelChat.calls.count())
          .toEqual(1);
      });

      it('hides the launcher when chat pops open from proactive chat', function() {
        c.broadcast(`${chat}.onOnline`);
        c.broadcast(`${chat}.onUnreadMsgs`, 1);

        expect(launcherSub.hide.calls.count())
          .toEqual(1);
      });

      it('doesn\'t close when chat is ended', function() {
        c.broadcast(`${chat}.onOnline`);
        c.broadcast(`${launcher}.onClick`);

        reset(chatSub.hide);
        reset(launcherSub.show);

        c.broadcast(`${chat}.onChatEnd`);

        expect(chatSub.hide.calls.count())
          .toEqual(0);

        expect(launcherSub.show.calls.count())
          .toEqual(0);
      });

      it('pops open proactive chat if user has not closed chat before', function() {
        c.broadcast(`${chat}.onOnline`);
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

      it('does not pop open chat if user has closed chat', function() {
        c.broadcast(`${chat}.onOnline`);
        c.broadcast(`${chat}.onUnreadMsgs`, 1);

        // chat is open at this point

        c.broadcast(`${chat}.onHide`); // close

        reset(chatSub.show);

        c.broadcast(`${chat}.onUnreadMsgs`, 1);

        expect(chatSub.show.calls.count())
          .toEqual(0);
      });

      it('pops open proactive chat after chat ends and user closes it', function() {
        c.broadcast(`${chat}.onOnline`);
        c.broadcast(`${chat}.onUnreadMsgs`, 1);

        // chat is open at this point

        c.broadcast(`${chat}.onChatEnd`);
        c.broadcast(`${chat}.onHide`);

        reset(chatSub.show);

        c.broadcast(`${chat}.onUnreadMsgs`, 1);

        expect(chatSub.show.calls.count())
          .toEqual(1);
      });

      it('does not pop open if ticket submission embed is visible', function() {
        jasmine.clock().install();
        c.broadcast(`${launcher}.onClick`);
        jasmine.clock().tick(0);

        // ticket submission is open at this point

        c.broadcast(`${chat}.onOnline`);

        reset(chatSub.show);

        c.broadcast(`${chat}.onUnreadMsgs`, 1);

        expect(chatSub.show.calls.count())
          .toEqual(0);
      });

      it('hides when a hide call is made', function() {
        c.broadcast('.hide');

        expect(chatSub.hide.calls.count())
          .toEqual(1);
      });

      it('hides after show is called and chat is online', function() {
        c.broadcast(`${chat}.onOnline`);

        reset(chatSub.hide);
        c.broadcast('.show');

        expect(chatSub.hide.calls.count())
          .toEqual(1);
      });

      it('shows after activate is called and chat is online', function() {
        c.broadcast(`${chat}.onOnline`);

        c.broadcast('.hide');

        reset(chatSub.show);
        c.broadcast('.activate');

        expect(chatSub.show.calls.count())
          .toEqual(1);
      });

      it('doesn\'t hide when launcher is pressed on mobile', function() {
        mockRegistry['utility/devices'].isMobileBrowser
          .and.returnValue(true);

        c.broadcast(`${chat}.onOnline`);
        c.broadcast(`${launcher}.onClick`);

        reset(chatSub.hide);
        reset(chatSub.show);

        c.broadcast(`${launcher}.onClick`);
        expect(chatSub.hide.calls.count())
          .toEqual(0);
        expect(chatSub.show.calls.count())
          .toEqual(1);
      });
    });

    describe('with Help Center', function() {
      beforeEach(function() {
        mediator.init(true);
      });

      it('resets launcher label to ChatHelp when unread message count is 0', function() {
        c.broadcast(`${chat}.onOnline`);
        c.broadcast(`${chat}.onUnreadMsgs`, 5);

        reset(launcherSub.setLabelUnreadMsgs);
        reset(launcherSub.setLabelChatHelp);

        c.broadcast(`${chat}.onUnreadMsgs`, 0);

        expect(launcherSub.setLabelUnreadMsgs.calls.count())
          .toEqual(0);
        expect(launcherSub.setLabelChatHelp.calls.count())
          .toEqual(1);
      });

      it('does not show after activate is called and was visible before hidden', function() {
        c.broadcast(`${chat}.onOnline`);
        c.broadcast(`${launcher}.onClick`);
        c.broadcast(`${helpCenter}.onNextClick`);

        c.broadcast('.hide');

        reset(chatSub.show);
        c.broadcast('.activate');

        expect(chatSub.show.calls.count())
          .toEqual(0);
      });

      it('doesn\'t reset the active embed if it goes offline and is not active', function() {
        c.broadcast(`${chat}.onOffline`);

        c.broadcast(`${launcher}.onClick`);
        c.broadcast(`${helpCenter}.onNextClick`);

        c.broadcast(`${chat}.onOnline`);
        c.broadcast(`${chat}.onOffline`);
        c.broadcast(`${helpCenter}.onClose`); // close

        reset(helpCenterSub.show);
        reset(submitTicketSub.show);

        jasmine.clock().install();
        c.broadcast(`${launcher}.onClick`); // open
        jasmine.clock().tick(0);

        expect(helpCenterSub.show.calls.count())
          .toEqual(0);
        expect(submitTicketSub.show.calls.count())
          .toEqual(1);
      });

      it('does not reset the active embed if it goes offline and was not online initally', function() {
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

      it('pops open proactive chat after chat ends and user closes it', function() {
        c.broadcast(`${chat}.onOnline`);
        c.broadcast(`${chat}.onUnreadMsgs`, 1);

        // chat is open at this point

        c.broadcast(`${chat}.onChatEnd`);
        c.broadcast(`${chat}.onHide`);

        reset(chatSub.show);

        c.broadcast(`${chat}.onUnreadMsgs`, 1);

        expect(chatSub.show.calls.count())
          .toEqual(1);
      });

      it('does not pop open if help center embed is visible', function() {
        c.broadcast(`${chat}.onOnline`);

        jasmine.clock().install();
        c.broadcast(`${launcher}.onClick`);
        jasmine.clock().tick(0);

        // help center is open at this point

        reset(chatSub.show);

        c.broadcast(`${chat}.onUnreadMsgs`, 1);

        expect(chatSub.show.calls.count())
          .toEqual(0);
      });
    });
  });

 /* ****************************************** *
  *                 HELP CENTER                *
  * ****************************************** */

  describe('Help Center', function() {
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

    beforeEach(function() {
      initSubscriptionSpies(names);
      mediator.init(true);
    });

    it('moves on to Chat if chat is online', function() {
      c.broadcast(`${chat}.onOnline`);
      c.broadcast(`${launcher}.onClick`);

      reset(helpCenterSub.hide);
      reset(chatSub.show);

      jasmine.clock().install();
      c.broadcast(`${helpCenter}.onNextClick`);
      jasmine.clock().tick(0);

      expect(helpCenterSub.hide.calls.count())
        .toEqual(1);
      expect(chatSub.show.calls.count())
        .toEqual(1);
    });

    it('moves on to Ticket Submission if chat is offline', function() {
      c.broadcast(`${chat}.onOffline`);
      c.broadcast(`${launcher}.onClick`);

      reset(helpCenterSub.hide);
      reset(submitTicketSub.show);

      jasmine.clock().install();
      c.broadcast(`${helpCenter}.onNextClick`);
      jasmine.clock().tick(0);

      expect(helpCenterSub.hide.calls.count())
        .toEqual(1);
      expect(submitTicketSub.show.calls.count())
        .toEqual(1);
    });

    it('displays "Live Chat" if chat is online', function() {
      c.broadcast(`${chat}.onOnline`);

      expect(helpCenterSub.setNextToChat.calls.count())
        .toEqual(1);
    });

    it('displays "Leave A Message" if chat is offline', function() {
      c.broadcast(`${chat}.onOnline`);
      c.broadcast(`${chat}.onOffline`);

      expect(helpCenterSub.setNextToSubmitTicket.calls.count())
        .toEqual(1);
    });

    it('does not show back button when transitioning to submit ticket embed', function() {
      reset(submitTicketSub.showBackButton);
      c.broadcast(`${helpCenter}.onNextClick`);

      expect(submitTicketSub.showBackButton.calls.count())
        .toEqual(0);
    });

    it('triggers Ticket Submission setLastSearch with last search params', function() {
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

    it('hides when a hide call is made', function() {
      c.broadcast('.hide');

      expect(helpCenterSub.hide.calls.count())
        .toEqual(1);
    });

    it('hides after show is called', function() {
      reset(helpCenterSub.hide);
      c.broadcast('.show');

      expect(helpCenterSub.hide.calls.count())
        .toEqual(1);
    });

    it('shows after activate is called', function() {
      c.broadcast('.hide');

      reset(helpCenterSub.show);
      c.broadcast('.activate');

      expect(helpCenterSub.show.calls.count())
        .toEqual(1);
    });

    it('reverts setScrollKiller and setWindowScroll on mobile onClose', function() {
      const setScrollKiller = mockRegistry['utility/scrollHacks'].setScrollKiller;
      const revertWindowScroll = mockRegistry['utility/scrollHacks'].revertWindowScroll;

      mockRegistry['utility/devices'].isMobileBrowser
        .and.returnValue(true);

      c.broadcast(`${launcher}.onClick`);

      reset(setScrollKiller);
      reset(revertWindowScroll);

      c.broadcast(`${helpCenter}.onClose`);

      expect(setScrollKiller)
        .toHaveBeenCalledWith(false);

      expect(setScrollKiller.calls.count())
        .toEqual(1);

      expect(revertWindowScroll.calls.count())
        .toEqual(1);
    });

    it('should not set helpCenterForm to available if sign in is required', function() {
      mediator.init(true, { helpCenterSignInRequired: true });

      jasmine.clock().install();
      c.broadcast(`${launcher}.onClick`);
      jasmine.clock().tick(0);

      expect(submitTicketSub.show.calls.count())
        .toEqual(1);

      expect(helpCenterSub.show.calls.count())
        .toEqual(0);
    });
  });

 /* ****************************************** *
  *                 NAKED ZOPIM                *
  * ****************************************** */

  describe('launcher final state depends on chat', function() {
    const launcher = 'launcher';
    const chat = 'zopimChat';
    const names = {
      launcher: launcher,
      chat: chat
    };

    beforeEach(function() {
      initSubscriptionSpies(names);
    });

    describe('launcher is not hidden by zE.hide() API call', function() {
      beforeEach(function() {
        mediator.init(false);
      });

      it('shows launcher when chat is online', function() {
        c.broadcast(`${chat}.onOnline`);

        expect(launcherSub.show.calls.count())
          .toEqual(1);
      });

      it('shows launcher after 3000ms if chat is offline', function() {
        jasmine.clock().install();
        c.broadcast(`${chat}.onOnline`);
        c.broadcast(`${chat}.onOffline`);
        jasmine.clock().tick(3000);

        expect(launcherSub.show.calls.count())
          .toEqual(1);
      });
    });

    describe('launcher is hidden by zE.hide() API call', function() {
      beforeEach(function() {
        mediator.init(false, { hideLauncher: true });
      });

      it('does not show launcher when chat is online', function() {
        c.broadcast(`${chat}.onOnline`);

        expect(launcherSub.show.calls.count())
          .toEqual(0);
      });

      it('does not show launcher after 3000ms when chat is offline', function() {
        jasmine.clock().install();
        c.broadcast(`${chat}.onOffline`);
        jasmine.clock().tick(3000);

        expect(launcherSub.show.calls.count())
          .toEqual(0);
      });
    });
  });

 /* ****************************************** *
  *                  ZOPIM API                 *
  * ****************************************** */

  describe('.zopimShow', function() {
    it('doesn\'t hide launcher when on mobile', function() {
      const launcher = 'launcher';
      const names = {
        launcher: launcher
      };

      mockRegistry['utility/devices'].isMobileBrowser = jasmine.createSpy().and.returnValue(true);

      mediator = requireUncached(mediatorPath).mediator;

      c = mediator.channel;
      initSubscriptionSpies(names);
      mediator.init(false);

      c.broadcast('.zopimShow');

      expect(launcherSub.hide.calls.count())
        .toEqual(0);
    });
  });
});
