describe('mediator', function() {
  let mockRegistry,
    mediator,
    c,
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
       'prefill']
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

      c.subscribe(`${names.launcher}.hide`,       launcherSub.hide);
      c.subscribe(`${names.launcher}.show`,       launcherSub.show);
      c.subscribe(`${names.launcher}.setLabelChat`,       launcherSub.setLabelChat);
      c.subscribe(`${names.launcher}.setLabelHelp`,       launcherSub.setLabelHelp);
      c.subscribe(`${names.launcher}.setLabelChatHelp`,   launcherSub.setLabelChatHelp);
      c.subscribe(`${names.launcher}.setLabelUnreadMsgs`, launcherSub.setLabelUnreadMsgs);

      c.subscribe(`${names.submitTicket}.show`, submitTicketSub.show);
      c.subscribe(`${names.submitTicket}.showWithAnimation`, submitTicketSub.show);
      c.subscribe(`${names.submitTicket}.hide`, submitTicketSub.hide);
      c.subscribe(`${names.submitTicket}.showBackButton`, submitTicketSub.showBackButton);
      c.subscribe(`${names.submitTicket}.setLastSearch`, submitTicketSub.setLastSearch);
      c.subscribe(`${names.submitTicket}.prefill`, submitTicketSub.prefill);

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

  describe('Ticket Submission', function() {
    const launcher = 'launcher';
    const submitTicket = 'ticketSubmissionForm';
    const names = {
      launcher: launcher,
      submitTicket: submitTicket
    };

    beforeEach(function() {
      initSubscriptionSpies(names);
      mediator.init(false);
    });

    describe('launcher', function() {
      it('launches Ticket Submission', function() {
        jasmine.clock().install();
        c.broadcast(`${launcher}.onClick`);
        jasmine.clock().tick(0);

        expect(submitTicketSub.show.calls.count())
          .toEqual(1);
        expect(launcherSub.hide.calls.count())
          .toEqual(1);
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

      it('hides launcher when a activate call is made', function() {
        c.broadcast('.activate');

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

    describe('ticket submission', function() {
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
    });

  });

  describe('Chat, Ticket Submission', function() {
    const launcher = 'launcher';
    const submitTicket = 'ticketSubmissionForm';
    const chat = 'zopimChat';
    const names = {
      launcher: launcher,
      submitTicket: submitTicket,
      chat: chat
    };

    beforeEach(function() {
      initSubscriptionSpies(names);
      mediator.init(false);
    });

    describe('launcher', function() {
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

      it('hides when onClick is called on mobile and chat is offline', function() {
        mockRegistry['utility/devices'].isMobileBrowser
          .and.returnValue(true);

        c.broadcast(`${launcher}.onClick`);

        expect(launcherSub.hide.calls.count())
          .toEqual(1);
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

      it('hides when a hide call is made', function() {
        c.broadcast('.hide');

        expect(launcherSub.hide.calls.count())
          .toEqual(1);
      });

      it('shows when a activate call is made', function() {
        c.broadcast('.activate');

        expect(launcherSub.hide.calls.count())
          .toEqual(1);
      });

      it('shows when a show call is made', function() {
        c.broadcast('.show');

        expect(launcherSub.show.calls.count())
          .toEqual(1);
      });
    });

    describe('ticket submission', function() {
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

      it('hides after show is called and chat is offline', function() {
        c.broadcast(`${chat}.onOffline`);

        reset(submitTicketSub.hide);
        c.broadcast('.show');

        expect(submitTicketSub.hide.calls.count())
          .toEqual(1);
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
    });

    describe('chat', function() {
      it('sets launcher to "Chat" when chat comes online', function() {
        c.broadcast(`${chat}.onOnline`);
        expect(launcherSub.setLabelChat)
          .toHaveBeenCalled();
      });

      it('sets launcher to "Help" when chat goes offline', function() {
        c.broadcast(`${chat}.onOffline`);
        expect(launcherSub.setLabelHelp.calls.count())
          .toEqual(1);
      });

      it('updates launcher with unread message count if chat is online', function() {
        c.broadcast(`${chat}.onOnline`);
        c.broadcast(`${chat}.onUnreadMsgs`, 5);

        expect(launcherSub.setLabelUnreadMsgs.calls.count())
          .toEqual(1);
        expect(launcherSub.setLabelUnreadMsgs)
          .toHaveBeenCalledWith(5);
      });

      it('hides launcher when chat pops open', function() {
        c.broadcast(`${chat}.onOnline`);
        c.broadcast(`${chat}.onShow`);

        expect(launcherSub.hide.calls.count())
          .toEqual(1);
      });

      it('hides the launcher when chat pops open from proactive chat', function() {
        c.broadcast(`${chat}.onOnline`);
        c.broadcast(`${chat}.onUnreadMsgs`, 1);

        expect(launcherSub.hide.calls.count())
          .toEqual(1);
      });

      it('closes when chat is ended', function() {
        c.broadcast(`${chat}.onOnline`);
        c.broadcast(`${launcher}.onClick`);

        reset(chatSub.hide);
        reset(launcherSub.show);

        c.broadcast(`${chat}.onChatEnd`);

        expect(chatSub.hide.calls.count())
          .toEqual(1);

        expect(launcherSub.show.calls.count())
          .toEqual(1);

        reset(chatSub.show);

        jasmine.clock().install();
        c.broadcast(`${launcher}.onClick`); // open
        jasmine.clock().tick(0);

        expect(chatSub.show.calls.count())
          .toEqual(1);
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

  });

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
        c.broadcast(`${chat}.onOffline`);
        jasmine.clock().tick(3000);

        expect(launcherSub.show.calls.count())
          .toEqual(1);
      });
    });

    describe('launcher is hidden by zE.hide() API call', function() {
      beforeEach(function() {
        mediator.init(false, true);
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

  describe('Help Center, Ticket Submission', function() {
    const launcher = 'launcher';
    const submitTicket = 'ticketSubmissionForm';
    const helpCenter = 'helpCenterForm';
    const names = {
      launcher: launcher,
      submitTicket: submitTicket,
      helpCenter: helpCenter
    };

    beforeEach(function() {
      initSubscriptionSpies(names);
      mediator.init(true);
    });

    describe('launcher', function() {
      it('launches Help Center first', function() {
        jasmine.clock().install();
        c.broadcast(`${launcher}.onClick`);
        jasmine.clock().tick(0);

        expect(helpCenterSub.show.calls.count())
          .toEqual(1);
      });

      it('launches Ticket Submission if it is active', function() {
        c.broadcast(`${launcher}.onClick`);
        c.broadcast(`${helpCenter}.onNextClick`);

        reset(submitTicketSub.show);
        reset(helpCenterSub.show);
        c.broadcast(`${helpCenter}.onClose`); // close

        jasmine.clock().install();
        c.broadcast(`${launcher}.onClick`); // open
        jasmine.clock().tick(0);

        expect(helpCenterSub.show.calls.count())
          .toEqual(0);
        expect(submitTicketSub.show.calls.count())
          .toEqual(1);
      });

      it('hides when a hide call is made', function() {
        c.broadcast('.hide');

        expect(launcherSub.hide.calls.count())
          .toEqual(1);
      });

      it('shows and deactivates when a show call is made', function() {
        c.broadcast('.show');

        expect(launcherSub.show.calls.count())
          .toEqual(1);
      });

      it('shows and activates when a activate call is made', function() {
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

      it('shows helpcenter on cancel if helpcenter is available', function() {
        reset(helpCenterSub.show);
        reset(launcherSub.show);

        c.broadcast(`${submitTicket}.onCancelClick`);

        expect(helpCenterSub.show.calls.count())
          .toEqual(1);

        expect(launcherSub.show.calls.count())
          .toEqual(0);
      });
    });

    describe('help center', function() {
      it('moves on to Ticket Submission', function() {
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

    });

    describe('ticket submission', function() {
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

      it('hides when a hide call is made', function() {
        c.broadcast('.hide');

        expect(submitTicketSub.hide.calls.count())
          .toEqual(1);
      });

      it('hides when a show call is made', function() {
        c.broadcast('.show');

        expect(submitTicketSub.hide.calls.count())
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

  describe('Help Center, Chat, Ticket Submission', function() {
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
      mediator.init(true);
    });

    describe('launcher', function() {
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

      it('does not hide when chat is launched from launcher on mobile', function() {
        mockRegistry['utility/devices'].isMobileBrowser
          .and.returnValue(true);

        c.broadcast(`${chat}.onOnline`);
        c.broadcast(`${launcher}.onClick`);  // open
        c.broadcast(`${helpCenter}.onNextClick`);
        // chat opens in new tab
        // user switches back to widget

        expect(launcherSub.hide.calls.count())
          .toEqual(1);

        reset(launcherSub.hide);

        c.broadcast(`${launcher}.onClick`);

        expect(launcherSub.hide.calls.count())
          .toEqual(0);
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

      it('doesn\'t hide when onClick is called on mobile and chat is active', function() {
        mockRegistry['utility/devices'].isMobileBrowser
          .and.returnValue(true);

        c.broadcast(`${chat}.onOnline`);
        c.broadcast(`${helpCenter}.onNextClick`);

        c.broadcast(`${launcher}.onClick`);
        reset(launcherSub.hide);

        expect(launcherSub.hide.calls.count())
          .toEqual(0);
      });
    });

    describe('help center', function() {
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
        c.broadcast(`${chat}.onOffline`);

        expect(helpCenterSub.setNextToSubmitTicket.calls.count())
          .toEqual(1);
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
    });

    describe('chat', function() {
      it('sets launcher to "Chat" when chat comes online', function() {
        c.broadcast(`${chat}.onOnline`);
        expect(launcherSub.setLabelChatHelp)
          .toHaveBeenCalled();
      });

      it('sets launcher to "Help" when chat goes offline', function() {
        c.broadcast(`${chat}.onOffline`);
        expect(launcherSub.setLabelHelp.calls.count())
          .toEqual(1);
      });

      it('updates launcher with unread message count if chat is online', function() {
        c.broadcast(`${chat}.onOnline`);
        c.broadcast(`${chat}.onUnreadMsgs`, 5);

        expect(launcherSub.setLabelUnreadMsgs.calls.count())
          .toEqual(1);
        expect(launcherSub.setLabelUnreadMsgs)
          .toHaveBeenCalledWith(5);
      });

      it('hides launcher when chat pops open', function() {
        c.broadcast(`${chat}.onOnline`);
        c.broadcast(`${chat}.onShow`);

        expect(launcherSub.hide.calls.count())
          .toEqual(1);
      });

      it('hides launcher when chat pops open from proactive chat', function() {
        c.broadcast(`${chat}.onOnline`);
        c.broadcast(`${chat}.onUnreadMsgs`, 1);

        expect(launcherSub.hide.calls.count())
          .toEqual(1);
      });

      it('closes when chat is ended', function() {
        c.broadcast(`${chat}.onOnline`);
        c.broadcast(`${launcher}.onClick`);
        c.broadcast(`${helpCenter}.onNextClick`);

        c.broadcast(`${chat}.onChatEnd`);

        reset(helpCenterSub.show);
        c.broadcast(`${helpCenter}.onClose`); // close

        jasmine.clock().install();
        c.broadcast(`${launcher}.onClick`); // open
        jasmine.clock().tick(0);

        expect(helpCenterSub.show.calls.count())
          .toEqual(1);
      });

      it('pops open proactive chat if user has not closed chat before', function() {
        c.broadcast(`${chat}.onOnline`);
        c.broadcast(`${chat}.onUnreadMsgs`, 1);

        expect(chatSub.show.calls.count())
          .toEqual(1);
        expect(launcherSub.hide.calls.count())
          .toEqual(1);

        reset(chatSub.show);
        reset(launcherSub.show);
        reset(launcherSub.hide);

        c.broadcast(`${chat}.onHide`);

        jasmine.clock().install();
        c.broadcast(`${launcher}.onClick`); // open
        jasmine.clock().tick(0);

        expect(chatSub.show.calls.count())
          .toEqual(1);
        expect(launcherSub.hide.calls.count())
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

      it('hides when a show call is made', function() {
        c.broadcast('.show');

        expect(chatSub.hide.calls.count())
          .toEqual(1);
      });

      it('hides when a hide call is made', function() {
        c.broadcast('.hide');

        expect(chatSub.hide.calls.count())
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

      it('doesn\'t hide when launcher is pressed on mobile', function() {
        mockRegistry['utility/devices'].isMobileBrowser
          .and.returnValue(true);

        c.broadcast(`${chat}.onOnline`);
        c.broadcast(`${launcher}.onClick`);
        c.broadcast(`${helpCenter}.onNextClick`);

        reset(chatSub.hide);
        reset(chatSub.show);

        c.broadcast(`${launcher}.onClick`);
        expect(chatSub.hide.calls.count())
          .toEqual(0);
        expect(chatSub.show.calls.count())
          .toEqual(1);
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
    });

    describe('ticket submission', function() {
      it('goes back to help center', function() {
        c.broadcast(`${chat}.onOffline`);
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
        c.broadcast(`${chat}.onOffline`);
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

      it('hides when a show call is made', function() {
        c.broadcast('.show');

        expect(submitTicketSub.hide.calls.count())
          .toEqual(1);
      });

      it('hides when a hide call is made', function() {
        c.broadcast('.hide');

        expect(submitTicketSub.hide.calls.count())
          .toEqual(1);
      });

      it('does not show after activate is called and was visible before hidden', function() {
        c.broadcast(`${chat}.onOffline`);
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

});
