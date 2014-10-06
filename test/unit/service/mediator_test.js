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

      mediator.initTicketSubmissionMediator();

      c.subscribe(`${launcher}.activate`,   launcherSub.activate);
      c.subscribe(`${launcher}.deactivate`, launcherSub.deactivate);

      c.subscribe(`${ticketForm}.show`, ticketFormSub.show);
      c.subscribe(`${ticketForm}.hide`, ticketFormSub.hide);
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

      mediator.initChatTicketSubmissionMediator();

      c.subscribe(`${launcher}.activate`,           launcherSub.activate);
      c.subscribe(`${launcher}.deactivate`,         launcherSub.deactivate);
      c.subscribe(`${launcher}.setLabelChat`,       launcherSub.setLabelChat);
      c.subscribe(`${launcher}.setLabelHelp`,       launcherSub.setLabelHelp);
      c.subscribe(`${launcher}.setLabelUnreadMsgs`, launcherSub.setLabelUnreadMsgs);

      c.subscribe(`${ticketForm}.show`, ticketFormSub.show);
      c.subscribe(`${ticketForm}.hide`, ticketFormSub.hide);

      c.subscribe(`${chat}.show`, chatSub.show);
      c.subscribe(`${chat}.hide`, chatSub.hide);
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
        .createSpyObj('ticketForm', ['show', 'hide']);
      chatSub = jasmine
        .createSpyObj('chat', ['show', 'hide']);
      helpCenterSub = jasmine
        .createSpyObj('helpCenter', ['show', 'hide']);

      mediator.initHelpCenterChatTicketSubmissionMediator();

      c.subscribe(`${launcher}.activate`,           launcherSub.activate);
      c.subscribe(`${launcher}.deactivate`,         launcherSub.deactivate);
      c.subscribe(`${launcher}.setLabelChat`,       launcherSub.setLabelChat);
      c.subscribe(`${launcher}.setLabelHelp`,       launcherSub.setLabelHelp);
      c.subscribe(`${launcher}.setLabelUnreadMsgs`, launcherSub.setLabelUnreadMsgs);

      c.subscribe(`${ticketForm}.show`, ticketFormSub.show);
      c.subscribe(`${ticketForm}.hide`, ticketFormSub.hide);

      c.subscribe(`${chat}.show`, chatSub.show);
      c.subscribe(`${chat}.hide`, chatSub.hide);

      c.subscribe(`${helpCenter}.show`, helpCenterSub.show);
      c.subscribe(`${helpCenter}.hide`, helpCenterSub.hide);
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
    });

    describe('help center', function() {

    });



  });
});
