var requireUncached = require('require-uncached');

describe('mediator', function() {
  var mockRegistry,
      mediator,
      mediatorPath = buildSrcPath('service/mediator'),
      c,
      launcherSub,
      submitTicketSub,
      chatSub,
      helpCenterSub,
      initSubscriptionSpies,
      reset = function(spy) {
        spy.calls.reset();
      };

  beforeEach(function() {
    mockery.enable();

    mockRegistry = initMockRegistry({
      'utility/devices':  {
        isMobileBrowser: jasmine.createSpy().and.returnValue(false)
      }
    });

    mediator = requireUncached(mediatorPath).mediator;

    c = mediator.channel;

    launcherSub = jasmine.createSpyObj(
      'launcher',
      ['hide',
       'show',
       'activate',
       'deactivate',
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
       'showBackButton']
    );

    chatSub = jasmine.createSpyObj(
      'chat',
      ['show',
       'showWithAnimation',
       'hide']
    );

    helpCenterSub = jasmine.createSpyObj(
      'helpCenter',
      ['show',
       'showWithAnimation',
       'hide',
       'setNextToChat',
       'setNextToSubmitTicket'
      ]
    );

    initSubscriptionSpies = function(names) {
      c.subscribe(`${names.launcher}.hide`,       launcherSub.hide);
      c.subscribe(`${names.launcher}.show`,       launcherSub.show);
      c.subscribe(`${names.launcher}.activate`,   launcherSub.activate);
      c.subscribe(`${names.launcher}.deactivate`, launcherSub.deactivate);
      c.subscribe(`${names.launcher}.setLabelChat`,       launcherSub.setLabelChat);
      c.subscribe(`${names.launcher}.setLabelHelp`,       launcherSub.setLabelHelp);
      c.subscribe(`${names.launcher}.setLabelChatHelp`,   launcherSub.setLabelChatHelp);
      c.subscribe(`${names.launcher}.setLabelUnreadMsgs`, launcherSub.setLabelUnreadMsgs);

      c.subscribe(`${names.submitTicket}.show`, submitTicketSub.show);
      c.subscribe(`${names.submitTicket}.showWithAnimation`, submitTicketSub.show);
      c.subscribe(`${names.submitTicket}.hide`, submitTicketSub.hide);
      c.subscribe(`${names.submitTicket}.showBackButton`, submitTicketSub.showBackButton);

      c.subscribe(`${names.chat}.show`, chatSub.show);
      c.subscribe(`${names.chat}.showWithAnimation`, chatSub.show);
      c.subscribe(`${names.chat}.hide`, chatSub.hide);

      c.subscribe(`${names.helpCenter}.show`, helpCenterSub.show);
      c.subscribe(`${names.helpCenter}.showWithAnimation`, helpCenterSub.show);
      c.subscribe(`${names.helpCenter}.hide`, helpCenterSub.hide);
      c.subscribe(`${names.helpCenter}.setNextToChat`, helpCenterSub.setNextToChat);
      c.subscribe(`${names.helpCenter}.setNextToSubmitTicket`, helpCenterSub.setNextToSubmitTicket);
    };

  });

  afterEach(function() {
    mockery.deregisterAll();
    mockery.disable();
  });

  describe('Ticket Submission', function() {
    var launcher   = 'launcher',
        submitTicket = 'ticketSubmissionForm',
        names = {
          launcher: launcher,
          submitTicket: submitTicket
        };

    beforeEach(function() {
      initSubscriptionSpies(names);
      mediator.init(false);
    });

    describe('launcher', function() {
      it('launches Ticket Submission', function() {
        c.broadcast(`${launcher}.onClick`);

        expect(submitTicketSub.show.calls.count())
          .toEqual(1);
        expect(launcherSub.activate.calls.count())
          .toEqual(1);
      });

      it('closes Ticket Submission if it is open', function() {
        c.broadcast(`${launcher}.onClick`);
        c.broadcast(`${launcher}.onClick`);

        expect(submitTicketSub.hide.calls.count())
          .toEqual(1);
        expect(launcherSub.deactivate.calls.count())
          .toEqual(1);
      });

      it('toggles between Help and X', function() {
        c.broadcast(`${launcher}.onClick`);
        expect(launcherSub.activate.calls.count())
          .toEqual(1);
        expect(launcherSub.deactivate.calls.count())
          .toEqual(0);

        reset(launcherSub.activate);
        reset(launcherSub.deactivate);
        c.broadcast(`${launcher}.onClick`);

        expect(launcherSub.activate.calls.count())
          .toEqual(0);
        expect(launcherSub.deactivate.calls.count())
          .toEqual(1);
        expect(launcherSub.show.calls.count())
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
        expect(launcherSub.deactivate.calls.count())
          .toEqual(1);
      });

      it('shows and activates when a activate call is made', function() {
        c.broadcast('.activate');

        expect(launcherSub.show.calls.count())
          .toEqual(1);
        expect(launcherSub.activate.calls.count())
          .toEqual(1);
      });

      it('hides after it\'s clicked when activate hideOnClose is true', function() {
        c.broadcast('.activate', {hideOnClose: true});

        c.broadcast(`${launcher}.onClick`);

        expect(launcherSub.hide.calls.count())
          .toEqual(1);
      });

      it('does not hide after it\'s clicked when activate hideOnClose is false', function() {
        c.broadcast('.activate');

        c.broadcast(`${launcher}.onClick`);

        expect(launcherSub.hide.calls.count())
          .toEqual(0);
      });

      it('hides when onClick is called on mobile', function() {
        mockRegistry['utility/devices'].isMobileBrowser
          .and.returnValue(true);

        c.broadcast(`${launcher}.onClick`);

        expect(launcherSub.hide.calls.count())
          .toEqual(1);
      });
    });

    describe('ticket submission', function() {
      it('deactivates launcher and hides ticket submission on close', function() {
        c.broadcast(`${launcher}.onClick`);

        expect(submitTicketSub.show.calls.count())
          .toEqual(1);
        expect(launcherSub.activate.calls.count())
          .toEqual(1);

        c.broadcast(`${submitTicket}.onClose`);

        expect(submitTicketSub.hide.calls.count())
          .toEqual(1);
        expect(launcherSub.deactivate.calls.count())
          .toEqual(1);
      });

      it('hides when a hide call is made', function() {
        c.broadcast('.hide');

        expect(submitTicketSub.hide.calls.count())
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
    });

  });

  describe('Chat, Ticket Submission', function() {
    var launcher   = 'launcher',
        submitTicket = 'ticketSubmissionForm',
        chat       = 'zopimChat',
        names = {
          launcher: launcher,
          submitTicket: submitTicket,
          chat: chat
        };

    beforeEach(function() {
      initSubscriptionSpies(names);
      mediator.init(false);
    });

    describe('launcher', function() {
      it('deactivates to "Chat" if chat is online', function() {
        c.broadcast(`${chat}.onOnline`);

        reset(launcherSub.setLabelChat);
        c.broadcast(`${launcher}.deactivate`);

        expect(launcherSub.setLabelChat.calls.count())
          .toEqual(1);
      });

      it('deactivates to "Help" if chat is offline', function() {
        c.broadcast(`${chat}.onOffline`);

        reset(launcherSub.setLabelHelp);
        c.broadcast(`${launcher}.deactivate`);

        expect(launcherSub.setLabelHelp.calls.count())
          .toEqual(1);
      });

      it('launches Ticket Submission if chat is offline', function() {
        c.broadcast(`${chat}.onOffline`);
        c.broadcast(`${launcher}.onClick`);

        expect(launcherSub.activate.calls.count())
          .toEqual(1);
        expect(submitTicketSub.show.calls.count())
          .toEqual(1);
        expect(chatSub.show.calls.count())
          .toEqual(0);
      });

      it('launches Chat if chat is online', function() {
        c.broadcast(`${chat}.onOnline`);
        c.broadcast(`${launcher}.onClick`);

        expect(submitTicketSub.show.calls.count())
          .toEqual(0);
        expect(chatSub.show.calls.count())
          .toEqual(1);
      });

      it('does not activate if launching chat on mobile', function() {
        mockRegistry['utility/devices'].isMobileBrowser
          .and.returnValue(true);

        c.broadcast(`${chat}.onOnline`);
        c.broadcast(`${launcher}.onClick`);

        expect(launcherSub.activate)
          .not.toHaveBeenCalled();
      });

      it('hides after it\'s clicked when activate hideOnClose is true', function() {
        c.broadcast('.activate', {hideOnClose: true});

        c.broadcast(`${launcher}.onClick`);

        expect(launcherSub.hide.calls.count())
          .toEqual(1);
      });

      it('does not hide after it\'s clicked when activate hideOnClose is false', function() {
        c.broadcast('.activate');

        c.broadcast(`${launcher}.onClick`);

        expect(launcherSub.hide.calls.count())
          .toEqual(0);
      });

      it('hides when onClick is called on mobile', function() {
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

        c.broadcast(`${launcher}.onClick`);

        expect(launcherSub.hide.calls.count())
          .toEqual(0);
      });

      it('hides Ticket Submission if it is visible', function() {
        c.broadcast(`${chat}.onOffline`);
        c.broadcast(`${launcher}.onClick`);
        c.broadcast(`${launcher}.onClick`);

        expect(submitTicketSub.hide.calls.count())
          .toEqual(1);
        expect(chatSub.hide.calls.count())
          .toEqual(0);
      });

      it('hides Chat if it is visible', function() {
        c.broadcast(`${chat}.onOnline`);
        c.broadcast(`${launcher}.onClick`);
        c.broadcast(`${launcher}.onClick`);

        expect(chatSub.hide.calls.count())
          .toEqual(1);
        expect(submitTicketSub.hide.calls.count())
          .toEqual(0);
      });

      it('hides when a hide call is made', function() {
        c.broadcast('.hide');

        expect(launcherSub.hide.calls.count())
          .toEqual(1);
      });

      it('shows and activates when a activate call is made', function() {
        c.broadcast('.activate');

        expect(launcherSub.show.calls.count())
          .toEqual(1);
        expect(launcherSub.activate.calls.count())
          .toEqual(1);
      });

      it('shows and deactivates when a show call is made', function() {
        c.broadcast('.show');

        expect(launcherSub.show.calls.count())
          .toEqual(1);
        expect(launcherSub.deactivate.calls.count())
          .toEqual(1);
      });
    });

    describe('ticket submission', function() {
      it('deactivates launcher and hides ticket submission on close', function() {
        c.broadcast(`${launcher}.onClick`);

        expect(submitTicketSub.show.calls.count())
          .toEqual(1);
        expect(launcherSub.activate.calls.count())
          .toEqual(1);

        c.broadcast(`${submitTicket}.onClose`);

        expect(submitTicketSub.hide.calls.count())
          .toEqual(1);
        expect(launcherSub.deactivate.calls.count())
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
        expect(launcherSub.setLabelChat.calls.count())
          .toEqual(1);
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
        expect(launcherSub.activate.calls.count())
          .toEqual(0);
      });

      it('hides the launcher when chat pops open from proactive chat', function() {
        c.broadcast(`${chat}.onOnline`);
        c.broadcast(`${chat}.onUnreadMsgs`, 1);

        expect(launcherSub.hide.calls.count())
          .toEqual(1);
        expect(launcherSub.activate.calls.count())
          .toEqual(0);
      });

      it('closes when chat is ended', function() {
        c.broadcast(`${chat}.onOnline`);
        c.broadcast(`${launcher}.onClick`);

        reset(chatSub.hide);
        reset(launcherSub.deactivate);
        reset(launcherSub.show);
        c.broadcast(`${chat}.onChatEnd`);

        expect(chatSub.hide.calls.count())
          .toEqual(1);

        expect(launcherSub.deactivate.calls.count())
          .toEqual(1);

        expect(launcherSub.show.calls.count())
          .toEqual(1);

        reset(chatSub.show);
        c.broadcast(`${launcher}.onClick`); // open

        expect(chatSub.show.calls.count())
          .toEqual(1);
      });

      it('pops open proactive chat if user has not closed chat before', function() {
        c.broadcast(`${chat}.onOnline`);
        c.broadcast(`${chat}.onUnreadMsgs`, 1);

        expect(launcherSub.activate.calls.count())
          .toEqual(0);
        expect(launcherSub.hide.calls.count())
          .toEqual(1);

        reset(launcherSub.activate);
        reset(chatSub.show);

        c.broadcast(`${launcher}.onClick`); // close
        c.broadcast(`${launcher}.onClick`); // open

        expect(chatSub.show.calls.count())
          .toEqual(1);
      });

      it('does not pop open chat if user has closed chat', function() {
        c.broadcast(`${chat}.onOnline`);
        c.broadcast(`${chat}.onUnreadMsgs`, 1);

        // chat is open at this point

        c.broadcast(`${launcher}.onClick`); // close

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

  describe('Help Center, Ticket Submission', function() {
    var launcher   = 'launcher',
        submitTicket = 'ticketSubmissionForm',
        helpCenter = 'helpCenterForm',
        names = {
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
        c.broadcast(`${launcher}.onClick`);

        expect(helpCenterSub.show.calls.count())
          .toEqual(1);
      });

      it('launches Ticket Submission if it is active', function() {
        c.broadcast(`${launcher}.onClick`);
        c.broadcast(`${helpCenter}.onNextClick`);

        reset(submitTicketSub.show);
        reset(helpCenterSub.show);
        c.broadcast(`${launcher}.onClick`); // close
        c.broadcast(`${launcher}.onClick`); // open

        expect(helpCenterSub.show.calls.count())
          .toEqual(0);
        expect(submitTicketSub.show.calls.count())
          .toEqual(1);
      });

      it('closes helpCenter if helpCenter is visible', function() {
        c.broadcast(`${launcher}.onClick`);

        reset(helpCenterSub.hide);
        c.broadcast(`${launcher}.onClick`);

        expect(helpCenterSub.hide.calls.count())
          .toEqual(1);
      });

      it('closes Ticket Submission if Ticket Submission is visible', function() {
        c.broadcast(`${launcher}.onClick`);
        c.broadcast(`${helpCenter}.onNextClick`);

        reset(submitTicketSub.hide);
        c.broadcast(`${launcher}.onClick`);

        expect(submitTicketSub.hide.calls.count())
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
        expect(launcherSub.deactivate.calls.count())
          .toEqual(1);
      });

      it('shows and activates when a activate call is made', function() {
        c.broadcast('.activate');

        expect(launcherSub.show.calls.count())
          .toEqual(1);
        expect(launcherSub.activate.calls.count())
          .toEqual(1);
      });

      it('hides after it\'s clicked when activate hideOnClose is true', function() {
        c.broadcast('.activate', {hideOnClose: true});

        c.broadcast(`${launcher}.onClick`);

        expect(launcherSub.hide.calls.count())
          .toEqual(1);
      });

      it('does not hide after it\'s clicked when activate hideOnClose is false', function() {
        c.broadcast('.activate');

        c.broadcast(`${launcher}.onClick`);

        expect(launcherSub.hide.calls.count())
          .toEqual(0);
      });

      it('hides when onClick is called on mobile', function() {
        mockRegistry['utility/devices'].isMobileBrowser
          .and.returnValue(true);

        c.broadcast(`${launcher}.onClick`);

        expect(launcherSub.hide.calls.count())
          .toEqual(1);
      });
    });

    describe('help center', function() {
      it('moves on to Ticket Submission', function() {
        c.broadcast(`${launcher}.onClick`);

        reset(helpCenterSub.hide);
        reset(submitTicketSub.show);
        c.broadcast(`${helpCenter}.onNextClick`);

        expect(helpCenterSub.hide.calls.count())
          .toEqual(1);
        expect(submitTicketSub.show.calls.count())
          .toEqual(1);
      });

      it('makes Ticket Submission display back button', function() {
        reset(submitTicketSub.showBackButton);
        c.broadcast(`${helpCenter}.onNextClick`);

        expect(submitTicketSub.showBackButton.calls.count())
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

    describe('ticket submission', function() {
      it('goes back to help center', function() {
        c.broadcast(`${launcher}.onClick`);
        c.broadcast(`${helpCenter}.onNextClick`);

        reset(helpCenterSub.show);
        reset(submitTicketSub.hide);
        c.broadcast(`${submitTicket}.onBackClick`);

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

        c.broadcast(`${launcher}.onClick`); // close
        c.broadcast(`${launcher}.onClick`); // open

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
    var launcher   = 'launcher',
        submitTicket = 'ticketSubmissionForm',
        chat       = 'zopimChat',
        helpCenter = 'helpCenterForm',
        names = {
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
      it('deactivates to "ChatHelp" if chat is online', function() {
        c.broadcast(`${chat}.onOnline`);

        reset(launcherSub.setLabelChatHelp);
        c.broadcast(`${launcher}.deactivate`);

        expect(launcherSub.setLabelChatHelp.calls.count())
          .toEqual(1);
      });

      it('deactivates to "Help" if chat is offline', function() {
        c.broadcast(`${chat}.onOffline`);

        reset(launcherSub.setLabelHelp);
        c.broadcast(`${launcher}.deactivate`);

        expect(launcherSub.setLabelHelp.calls.count())
          .toEqual(1);
      });

      it('launches Help Center first', function() {
        c.broadcast(`${launcher}.onClick`);

        expect(helpCenterSub.show.calls.count())
          .toEqual(1);
      });

      it('launches chat if user has moved on to chat and chat is online', function() {
        c.broadcast(`${chat}.onOnline`);
        c.broadcast(`${launcher}.onClick`);  // open
        c.broadcast(`${helpCenter}.onNextClick`);

        reset(chatSub.show);
        c.broadcast(`${launcher}.onClick`); // close
        c.broadcast(`${launcher}.onClick`); // open

        expect(chatSub.show.calls.count())
          .toEqual(1);
      });

      it('launches help center if user has moved on to chat and chat goes offline', function() {
        c.broadcast(`${chat}.onOnline`);
        c.broadcast(`${launcher}.onClick`);  // open
        c.broadcast(`${helpCenter}.onNextClick`);

        reset(helpCenterSub.show);
        c.broadcast(`${launcher}.onClick`); // close
        c.broadcast(`${chat}.onOffline`);
        c.broadcast(`${launcher}.onClick`); // open

        expect(helpCenterSub.show.calls.count())
          .toEqual(1);
      });

      it('deactivate when chat is launched from helpcenter on mobile', function() {
        mockRegistry['utility/devices'].isMobileBrowser
          .and.returnValue(true);

        c.broadcast(`${chat}.onOnline`);
        c.broadcast(`${launcher}.onClick`);
        c.broadcast(`${helpCenter}.onNextClick`);

        expect(launcherSub.deactivate)
          .toHaveBeenCalled();
      });

      it('does not activate when chat is launched from launcher on mobile', function() {
        mockRegistry['utility/devices'].isMobileBrowser
          .and.returnValue(true);

        c.broadcast(`${chat}.onOnline`);
        c.broadcast(`${launcher}.onClick`);  // open
        c.broadcast(`${helpCenter}.onNextClick`);
        // chat opens in new tab
        // user switches back to widget

        reset(launcherSub.activate);
        c.broadcast(`${launcher}.onClick`);

        expect(launcherSub.activate.calls.count())
          .toEqual(0);
      });

      it('closes helpCenter if helpCenter is visible', function() {
        c.broadcast(`${launcher}.onClick`);

        reset(helpCenterSub.hide);
        c.broadcast(`${launcher}.onClick`);

        expect(helpCenterSub.hide.calls.count())
          .toEqual(1);
      });

      it('closes chat if chat is visible', function() {
        c.broadcast(`${chat}.onOnline`);
        c.broadcast(`${launcher}.onClick`);
        c.broadcast(`${helpCenter}.onNextClick`);

        reset(chatSub.hide);
        c.broadcast(`${launcher}.onClick`);

        expect(chatSub.hide.calls.count())
          .toEqual(1);
      });

      it('closes Ticket Submission if Ticket Submission is visible', function() {
        c.broadcast(`${chat}.onOffline`);
        c.broadcast(`${launcher}.onClick`);
        c.broadcast(`${helpCenter}.onNextClick`);

        reset(submitTicketSub.hide);
        c.broadcast(`${launcher}.onClick`);

        expect(submitTicketSub.hide.calls.count())
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
        expect(launcherSub.deactivate.calls.count())
          .toEqual(1);
      });

      it('shows and activates when a activate call is made', function() {
        c.broadcast('.activate');

        expect(launcherSub.show.calls.count())
          .toEqual(1);
        expect(launcherSub.activate.calls.count())
          .toEqual(1);
      });

      it('hides after it\'s clicked when activate hideOnClose is true', function() {
        c.broadcast('.activate', {hideOnClose: true});

        c.broadcast(`${launcher}.onClick`);

        expect(launcherSub.hide.calls.count())
          .toEqual(1);
      });

      it('does not hide after it\'s clicked when activate hideOnClose is false', function() {
        c.broadcast('.activate');

        c.broadcast(`${launcher}.onClick`);

        expect(launcherSub.hide.calls.count())
          .toEqual(0);
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
        c.broadcast(`${helpCenter}.onNextClick`);

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
        c.broadcast(`${helpCenter}.onNextClick`);

        expect(helpCenterSub.hide.calls.count())
          .toEqual(1);
        expect(submitTicketSub.show.calls.count())
          .toEqual(1);
      });

      it('makes Ticket Submission display back button', function() {
        c.broadcast(`${chat}.onOffline`);

        reset(submitTicketSub.showBackButton);
        c.broadcast(`${helpCenter}.onNextClick`);

        expect(submitTicketSub.showBackButton.calls.count())
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
        expect(launcherSub.setLabelChatHelp.calls.count())
          .toEqual(1);
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

        expect(launcherSub.activate.calls.count())
          .toEqual(0);
        expect(launcherSub.hide.calls.count())
          .toEqual(1);
      });

      it('hides launcher when chat pops open from proactive chat', function() {
        c.broadcast(`${chat}.onOnline`);
        c.broadcast(`${chat}.onUnreadMsgs`, 1);

        expect(launcherSub.activate.calls.count())
          .toEqual(0);
        expect(launcherSub.hide.calls.count())
          .toEqual(1);
      });

      it('closes when chat is ended', function() {
        c.broadcast(`${chat}.onOnline`);
        c.broadcast(`${launcher}.onClick`);
        c.broadcast(`${helpCenter}.onNextClick`);

        c.broadcast(`${chat}.onChatEnd`);

        reset(helpCenterSub.show);
        c.broadcast(`${launcher}.onClick`); // close
        c.broadcast(`${launcher}.onClick`); // open

        expect(helpCenterSub.show.calls.count())
          .toEqual(1);
      });

      it('pops open proactive chat if user has not closed chat before', function() {
        c.broadcast(`${chat}.onOnline`);
        c.broadcast(`${chat}.onUnreadMsgs`, 1);

        expect(chatSub.show.calls.count())
          .toEqual(1);
        expect(launcherSub.activate.calls.count())
          .toEqual(0);
        expect(launcherSub.hide.calls.count())
          .toEqual(1);

        reset(chatSub.show);
        reset(launcherSub.activate);
        reset(launcherSub.show);
        reset(launcherSub.hide);

        c.broadcast(`${chat}.onHide`);
        c.broadcast(`${launcher}.onClick`); // open

        expect(chatSub.show.calls.count())
          .toEqual(1);
        expect(launcherSub.hide.calls.count())
          .toEqual(1);
        expect(launcherSub.activate.calls.count())
          .toEqual(0);
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
        c.broadcast(`${launcher}.onClick`); //close

        reset(helpCenterSub.show);
        reset(submitTicketSub.show);

        c.broadcast(`${launcher}.onClick`); //open

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
        c.broadcast(`${submitTicket}.onBackClick`);

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

        c.broadcast(`${launcher}.onClick`); // close
        c.broadcast(`${launcher}.onClick`); // open

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
