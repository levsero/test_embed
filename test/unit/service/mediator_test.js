module airwaves from 'airwaves';
var requireUncached = require('require-uncached');

ddescribe('mediator', function() {
  var mockRegistry,
      mediator,
      mediatorPath = buildSrcPath('service/mediator'),
      reset = function(spy) {
        spy.calls.reset();
      };

  beforeEach(function() {
  });

  describe('Ticket Submission', function() {
    var launcher,
        ticketForm,
        c,
        launcherSub,
        ticketFormSub;

    beforeEach(function() {
      mediator = requireUncached(mediatorPath).mediator;
      ticketForm = 'ticketSubmissionForm';
      launcher = 'ticketSubmissionLauncher';
      c = mediator.channel;
      launcherSub = jasmine
        .createSpyObj('launcher', ['activate', 'deactivate']);
      ticketFormSub = jasmine
        .createSpyObj('ticketForm', ['show', 'hide']);

      c.subscribe(`${launcher}.activate`,   launcherSub.activate);
      c.subscribe(`${launcher}.deactivate`, launcherSub.deactivate);

      c.subscribe(`${ticketForm}.show`, ticketFormSub.show);
      c.subscribe(`${ticketForm}.hide`, ticketFormSub.hide);

      mediator.initTicketSubmissionMediator();
    });

    describe('launcher', function() {
      it('launches Ticket Submission', function() {
        c.broadcast(`${launcher}.onClick`);

        expect(ticketFormSub.show.calls.count())
          .toEqual(1);
        expect(launcherSub.activate.calls.count())
          .toEqual(1);
      });

      it('closes Ticket Submission if it is open', function() {
        c.broadcast(`${launcher}.onClick`);
        c.broadcast(`${launcher}.onClick`);

        expect(ticketFormSub.hide.calls.count())
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
      });

    });

    describe('ticket submission', function() {
      it('deactivates launcher and hides ticket submission on close', function() {
        c.broadcast(`${launcher}.onClick`);

        expect(ticketFormSub.show.calls.count())
          .toEqual(1);
        expect(launcherSub.activate.calls.count())
          .toEqual(1);

        c.broadcast(`${ticketForm}.onClose`);

        expect(ticketFormSub.hide.calls.count())
          .toEqual(1);
        expect(launcherSub.deactivate.calls.count())
          .toEqual(1);
      });
    });
  });

  describe('Chat, Ticket Submission', function() {
    var launcher,
        ticketForm,
        chat,
        c,
        launcherSub,
        ticketFormSub,
        chatSub;

    beforeEach(function() {
      mediator = requireUncached(mediatorPath).mediator;
      launcher = 'chatLauncher';
      ticketForm = 'ticketSubmissionForm';
      chat = 'zopimChat';
      c = mediator.channel;
      launcherSub = jasmine
        .createSpyObj('launcher', [
          'activate',
          'deactivate',
          'setLabelChat',
          'setLabelHelp',
          'setLabelUnreadMsgs'
        ]);
      ticketFormSub = jasmine
        .createSpyObj('ticketForm', ['show', 'hide']);
      chatSub = jasmine
        .createSpyObj('chat', ['show', 'hide']);

      c.subscribe(`${launcher}.activate`,           launcherSub.activate);
      c.subscribe(`${launcher}.deactivate`,         launcherSub.deactivate);
      c.subscribe(`${launcher}.setLabelChat`,       launcherSub.setLabelChat);
      c.subscribe(`${launcher}.setLabelHelp`,       launcherSub.setLabelHelp);
      c.subscribe(`${launcher}.setLabelUnreadMsgs`, launcherSub.setLabelUnreadMsgs);

      c.subscribe(`${ticketForm}.show`, ticketFormSub.show);
      c.subscribe(`${ticketForm}.hide`, ticketFormSub.hide);

      c.subscribe(`${chat}.show`, chatSub.show);
      c.subscribe(`${chat}.hide`, chatSub.hide);

      mediator.initChatTicketSubmissionMediator();
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
        expect(ticketFormSub.show.calls.count())
          .toEqual(1);
        expect(chatSub.show.calls.count())
          .toEqual(0);
      });

      it('launches Chat if chat is online', function() {
        c.broadcast(`${chat}.onOnline`);
        c.broadcast(`${launcher}.onClick`);

        expect(launcherSub.activate.calls.count())
          .toEqual(1);
        expect(ticketFormSub.show.calls.count())
          .toEqual(0);
        expect(chatSub.show.calls.count())
          .toEqual(1);

      });

      it('hides Ticket Submission if it is visible', function() {
        c.broadcast(`${chat}.onOffline`);
        c.broadcast(`${launcher}.onClick`);
        c.broadcast(`${launcher}.onClick`);

        expect(ticketFormSub.hide.calls.count())
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
        expect(ticketFormSub.hide.calls.count())
          .toEqual(0);
      });
    });

    describe('ticket submission', function() {
      it('deactivates launcher and hides ticket submission on close', function() {
        c.broadcast(`${launcher}.onClick`);

        expect(ticketFormSub.show.calls.count())
          .toEqual(1);
        expect(launcherSub.activate.calls.count())
          .toEqual(1);

        c.broadcast(`${ticketForm}.onClose`);

        expect(ticketFormSub.hide.calls.count())
          .toEqual(1);
        expect(launcherSub.deactivate.calls.count())
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

      it('activates launcher when chat pops open', function() {
        c.broadcast(`${chat}.onOnline`);
        c.broadcast(`${chat}.onShow`);

        expect(launcherSub.activate.calls.count())
          .toEqual(1);
      });

      it('closes when chat is ended', function() {
        c.broadcast(`${chat}.onOnline`);
        c.broadcast(`${launcher}.onClick`);

        reset(chatSub.hide);
        reset(launcherSub.deactivate);
        c.broadcast(`${chat}.onChatEnd`);

        expect(chatSub.hide.calls.count())
          .toEqual(1);

        expect(launcherSub.deactivate.calls.count())
          .toEqual(1);

        reset(chatSub.show);
        c.broadcast(`${launcher}.onClick`); // close
        c.broadcast(`${launcher}.onClick`); // open

        expect(chatSub.show.calls.count())
          .toEqual(1);
      });

      it('pops open proactive chat if user has not closed chat before', function() {
        c.broadcast(`${chat}.onOnline`);
        c.broadcast(`${chat}.onUnreadMsgs`, 1);

        expect(chatSub.show.calls.count())
          .toEqual(1);
        expect(launcherSub.activate.calls.count())
         .toEqual(1);

        reset(launcherSub.activate);
        reset(chatSub.show);

        c.broadcast(`${launcher}.onClick`); // close
        c.broadcast(`${launcher}.onClick`); // open

        expect(chatSub.show.calls.count())
         .toEqual(1);
        expect(launcherSub.activate.calls.count())
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

      it('pops open chat on page load if chat is in progress', function() {
        c.broadcast(`${chat}.onOnline`);

        reset(chatSub.show);
        reset(launcherSub.activate);

        c.broadcast(`${chat}.onIsChatting`);

        expect(chatSub.show.calls.count())
          .toEqual(1);

        expect(launcherSub.activate.calls.count())
          .toEqual(1);

        reset(chatSub.show);
        c.broadcast(`${launcher}.onClick`); // close
        c.broadcast(`${launcher}.onClick`); // open

        expect(chatSub.show.calls.count())
          .toEqual(1);

      });

    });

  });

  describe('Help Center, Chat, Ticket Submission', function() {
    var launcher,
        ticketForm,
        chat,
        helpCenter,
        c,
        launcherSub,
        ticketFormSub,
        chatSub,
        helpCenterSub;

    beforeEach(function() {
      mediator = requireUncached(mediatorPath).mediator;
      launcher = 'hcLauncher';
      ticketForm = 'ticketSubmissionForm';
      chat = 'zopimChat';
      helpCenter = 'helpCenterForm';
      c = mediator.channel;
      launcherSub = jasmine
        .createSpyObj('launcher', [
          'activate',
          'deactivate',
          'setLabelChat',
          'setLabelHelp',
          'setLabelUnreadMsgs'
        ]);
      ticketFormSub = jasmine
        .createSpyObj('ticketForm', ['show', 'hide', 'showBackButton']);
      chatSub = jasmine
        .createSpyObj('chat', ['show', 'hide']);
      helpCenterSub = jasmine
        .createSpyObj('helpCenter', [
          'show',
          'hide',
          'setNextToChat',
          'setNextToSubmitTicket'
        ]);

      c.subscribe(`${launcher}.activate`,           launcherSub.activate);
      c.subscribe(`${launcher}.deactivate`,         launcherSub.deactivate);
      c.subscribe(`${launcher}.setLabelChat`,       launcherSub.setLabelChat);
      c.subscribe(`${launcher}.setLabelHelp`,       launcherSub.setLabelHelp);
      c.subscribe(`${launcher}.setLabelUnreadMsgs`, launcherSub.setLabelUnreadMsgs);

      c.subscribe(`${ticketForm}.show`, ticketFormSub.show);
      c.subscribe(`${ticketForm}.hide`, ticketFormSub.hide);
      c.subscribe(`${ticketForm}.showBackButton`, ticketFormSub.showBackButton);

      c.subscribe(`${chat}.show`, chatSub.show);
      c.subscribe(`${chat}.hide`, chatSub.hide);

      c.subscribe(`${helpCenter}.show`, helpCenterSub.show);
      c.subscribe(`${helpCenter}.hide`, helpCenterSub.hide);
      c.subscribe(`${helpCenter}.setNextToChat`, helpCenterSub.setNextToChat);
      c.subscribe(`${helpCenter}.setNextToSubmitTicket`, helpCenterSub.setNextToSubmitTicket);

      mediator.initHelpCenterChatTicketSubmissionMediator();
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

      it('launches ticket submission if user has moved on to chat and chat is offline', function() {
        c.broadcast(`${chat}.onOnline`);
        c.broadcast(`${launcher}.onClick`);  // open
        c.broadcast(`${helpCenter}.onNextClick`);

        reset(chatSub.show);
        c.broadcast(`${launcher}.onClick`); // close
        c.broadcast(`${chat}.onOffline`);
        c.broadcast(`${launcher}.onClick`); // open

        expect(chatSub.show.calls.count())
          .toEqual(0);
        expect(ticketFormSub.show.calls.count())
          .toEqual(1);
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

        reset(ticketFormSub.hide);
        c.broadcast(`${launcher}.onClick`);

        expect(ticketFormSub.hide.calls.count())
          .toEqual(1);
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
        reset(ticketFormSub.show);
        c.broadcast(`${helpCenter}.onNextClick`);

        expect(helpCenterSub.hide.calls.count())
          .toEqual(1);
        expect(ticketFormSub.show.calls.count())
          .toEqual(1);
      });

      it('makes Ticket Submission display back button', function() {
        c.broadcast(`${chat}.onOffline`);

        reset(ticketFormSub.showBackButton);
        c.broadcast(`${helpCenter}.onNextClick`);

        expect(ticketFormSub.showBackButton.calls.count())
          .toEqual(1);
      });


      it('displays "Live Chat" if chat is online', function() {
        c.broadcast(`${chat}.onOnline`);

        expect(helpCenterSub.setNextToChat.calls.count())
          .toEqual(1);
      });

      it('displays "Leave A Message" if chat is offline', function() {

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

      it('activates launcher when chat pops open', function() {
        c.broadcast(`${chat}.onOnline`);
        c.broadcast(`${chat}.onShow`);

        expect(launcherSub.activate.calls.count())
          .toEqual(1);
      });

      it('closes when chat is ended', function() {
        c.broadcast(`${chat}.onOnline`);
        c.broadcast(`${launcher}.onClick`);
        c.broadcast(`${helpCenter}.onNextClick`);

        reset(chatSub.hide);
        reset(launcherSub.deactivate);
        c.broadcast(`${chat}.onChatEnd`);

        expect(chatSub.hide.calls.count())
          .toEqual(1);

        expect(launcherSub.deactivate.calls.count())
          .toEqual(1);

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
          .toEqual(1);

        reset(launcherSub.activate);
        reset(chatSub.show);

        c.broadcast(`${launcher}.onClick`); // close
        c.broadcast(`${launcher}.onClick`); // open

        expect(chatSub.show.calls.count())
          .toEqual(1);
        expect(launcherSub.activate.calls.count())
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

      it('pops open chat on page load if chat is in progress', function() {
        c.broadcast(`${chat}.onOnline`);

        reset(chatSub.show);
        reset(launcherSub.activate);

        c.broadcast(`${chat}.onIsChatting`);

        expect(chatSub.show.calls.count())
          .toEqual(1);

        expect(launcherSub.activate.calls.count())
          .toEqual(1);

        reset(chatSub.show);
        c.broadcast(`${launcher}.onClick`); // close
        c.broadcast(`${launcher}.onClick`); // open

        expect(chatSub.show.calls.count())
          .toEqual(1);

      });
    });

    describe('ticket submission', function() {
      it('goes back to help center', function() {
        c.broadcast(`${chat}.onOffline`);
        c.broadcast(`${launcher}.onClick`);
        c.broadcast(`${helpCenter}.onNextClick`);

        reset(helpCenterSub.show);
        reset(ticketFormSub.hide);
        c.broadcast(`${ticketForm}.onBackClick`);

        expect(helpCenterSub.show.calls.count())
          .toEqual(1);

        expect(ticketFormSub.hide.calls.count())
          .toEqual(1);
      });

      it('sets Help Center as active embed after form submit', function() {
        c.broadcast(`${chat}.onOffline`);
        c.broadcast(`${launcher}.onClick`);
        c.broadcast(`${helpCenter}.onNextClick`);

        c.broadcast(`${ticketForm}.onFormSubmitted`);

        reset(helpCenterSub.show);

        c.broadcast(`${launcher}.onClick`); // close
        c.broadcast(`${launcher}.onClick`); // open

        expect(helpCenterSub.show.calls.count())
          .toEqual(1);
      });
    });

  });
});
