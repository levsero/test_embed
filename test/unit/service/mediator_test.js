module airwaves from 'airwaves';
var requireUncached = require('require-uncached');

describe('mediator', function() {
  var mockRegistry,
      mediator,
      mediatorPath = buildSrcPath('service/mediator'),
      reset = function(spy) {
        spy.calls.reset();
      };

  beforeEach(function() {
  });

  describe('Launcher, Ticket Submission', function() {
    var ticketForm,
        launcher,
        c,
        ticketFormSub,
        launcherSub;

    beforeEach(function() {
      mediator = requireUncached(mediatorPath).mediator;
      ticketForm = 'ticketSubmissionForm';
      launcher = 'ticketSubmissionLauncher';
      c = mediator.channel;
      ticketFormSub = jasmine
        .createSpyObj('ticketForm', ['show', 'hide']);
      launcherSub = jasmine
        .createSpyObj('launcher', ['activate', 'deactivate']);

      mediator.initTicketSubmissionMediator();

      c.subscribe(`${ticketForm}.show`, ticketFormSub.show);
      c.subscribe(`${ticketForm}.hide`, ticketFormSub.hide);
      c.subscribe(`${launcher}.activate`,   launcherSub.activate);
      c.subscribe(`${launcher}.deactivate`, launcherSub.deactivate);
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

  describe('Launcher, Chat, Ticket Submission', function() {
    var ticketForm,
        chat,
        launcher,
        c,
        ticketFormSub,
        chatSub,
        launcherSub;

    beforeEach(function() {
      mediator = requireUncached(mediatorPath).mediator;
      ticketForm = 'ticketSubmissionForm';
      launcher = 'chatLauncher';
      chat = 'zopimChat';
      c = mediator.channel;
      ticketFormSub = jasmine
        .createSpyObj('ticketForm', ['show', 'hide']);
      launcherSub = jasmine
        .createSpyObj('launcher', [
          'activate',
          'deactivate',
          'setLabelChat',
          'setLabelHelp',
          'setLabelUnreadMsgs'
        ]);
      chatSub = jasmine
        .createSpyObj('chat', ['show', 'hide']);

      mediator.initChatTicketSubmissionMediator();

      c.subscribe(`${ticketForm}.show`, ticketFormSub.show);
      c.subscribe(`${ticketForm}.hide`, ticketFormSub.hide);

      c.subscribe(`${chat}.show`, chatSub.show);
      c.subscribe(`${chat}.hide`, chatSub.hide);

      c.subscribe(`${launcher}.activate`,           launcherSub.activate);
      c.subscribe(`${launcher}.deactivate`,         launcherSub.deactivate);
      c.subscribe(`${launcher}.setLabelChat`,       launcherSub.setLabelChat);
      c.subscribe(`${launcher}.setLabelHelp`,       launcherSub.setLabelHelp);
      c.subscribe(`${launcher}.setLabelUnreadMsgs`, launcherSub.setLabelUnreadMsgs);
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
  });
});
