describe('AutomaticAnswers component', () => {
  let mockWrongURLParameter,
    mockRegistry,
    mockSolveTicket,
    AutomaticAnswers,
    automaticAnswers;
  const automaticAnswersPath = buildSrcPath('component/automaticAnswers/AutomaticAnswers');
  const mockTicketId = '123456';
  const mockToken = 'abcdef';

  beforeEach(() => {
    resetDOM();

    mockery.enable();

    mockRegistry = initMockRegistry({
      'service/i18n': {
        i18n: {
          t: _.identity
        }
      },
      'utility/pages': {
        getURLParameterByName: jasmine.createSpy().and.callFake((arg) => {
          if (mockWrongURLParameter) return null;
          if (arg === 'ticket_id') {
            return mockTicketId;
          } else if (arg === 'token') {
            return mockToken;
          }
        })
      },
      'utility/utils': {
        bindMethods: mockBindMethods
      },
      'component/automaticAnswers/AutomaticAnswersDesktop': {
        AutomaticAnswersDesktop: React.createClass({
          render() {
            return (
              <div className='automaticAnswers-desktop' />
            );
          }
        })
      }
    });

    AutomaticAnswers = requireUncached(automaticAnswersPath).AutomaticAnswers;

    mockWrongURLParameter = false;
  });

  describe('instantiation', () => {
    beforeEach(() => {
      automaticAnswers = instanceRender(<AutomaticAnswers />);
    });

    it('sets initial ticket state', () => {
      expect(automaticAnswers.state.ticket.title)
        .toEqual('');

      expect(automaticAnswers.state.ticket.niceId)
        .toEqual(null);

      expect(automaticAnswers.state.ticket.statusId)
        .toEqual(null);
    });

    it('sets solveSuccess to false', () => {
      expect(automaticAnswers.state.solveSuccess)
        .toEqual(false);
    });

    it('sets an empty errorMessage', () => {
      expect(automaticAnswers.state.errorMessage)
        .toEqual('');
    });
  });

  describe('updateTicket', () => {
    const mockTicket = {
      'nice_id': 13490587,
      'status_id': 2,
      'title': "Most orchestras are just 1800's cover bands."
    };

    beforeEach(() => {
      automaticAnswers = instanceRender(<AutomaticAnswers />);
      automaticAnswers.updateTicket(mockTicket);
    });

    it('updates ticket state', () => {
      expect(automaticAnswers.state.ticket.title)
        .toEqual(mockTicket.title);

      expect(automaticAnswers.state.ticket.niceId)
        .toEqual(mockTicket.nice_id);

      expect(automaticAnswers.state.ticket.statusId)
        .toEqual(mockTicket.status_id);
    });
  });

  describe('handleSolveTicket', () => {
    beforeEach(() => {
      mockSolveTicket = jasmine.createSpy('mockSolveTicket');
      automaticAnswers = domRender(
         <AutomaticAnswers
           solveTicket={mockSolveTicket} />);
    });

    describe('when ticket_id and token are present in the url', () => {
      let callbacks;

      beforeEach(() => {
        automaticAnswers.handleSolveTicket();
        callbacks = mockSolveTicket.calls.mostRecent().args[2];
      });

      it('passes the ticketId, token and callbacks to the solve ticket request', () => {
        expect(mockSolveTicket)
          .toHaveBeenCalledWith(mockTicketId, mockToken, callbacks);
      });

      it('defines callback behaviour for the solve ticket request', () => {
        expect(callbacks.done)
          .toEqual(automaticAnswers.solveTicketDone);

        expect(callbacks.fail)
          .toEqual(automaticAnswers.solveTicketFail);
      });
    });

    describe('when ticket_id or token are not present in the url', () => {
      beforeEach(() => {
        mockWrongURLParameter = true;
        automaticAnswers.handleSolveTicket();
      });

      it('does not make a call to solve the ticket', () => {
        expect(mockSolveTicket)
          .not.toHaveBeenCalled();
      });
    });
  });

  describe('sending a request to solve a ticket', () => {
    beforeEach(() => {
      mockSolveTicket = jasmine.createSpy('mockSolveTicket');
      automaticAnswers = domRender(
         <AutomaticAnswers
           solveTicket={mockSolveTicket} />);
    });

    describe('when the request is successful', () => {
      beforeEach(() => {
        automaticAnswers.solveTicketDone();
      });

      it('sets the solveSuccess state to true', () => {
        expect(automaticAnswers.state.solveSuccess)
          .toEqual(true);
      });
    });

    describe('when the request fails', () => {
      let i18n;

      beforeEach(() => {
        i18n = mockRegistry['service/i18n'].i18n;
        spyOn(i18n, 't').and.callThrough();
        automaticAnswers.solveTicketFail();
      });

      it('sets errorMessage to the correct tanslation string', () => {
        expect(i18n.t)
          .toHaveBeenCalledWith('embeddable_framework.automaticAnswers.label.error');

        expect(automaticAnswers.state.errorMessage)
          .toBe('embeddable_framework.automaticAnswers.label.error');
      });
    });
  });
});
