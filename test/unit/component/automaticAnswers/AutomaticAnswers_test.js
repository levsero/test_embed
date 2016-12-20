describe('AutomaticAnswers component', () => {
  let mockSolveTicket,
    mockCloseFrame,
    AutomaticAnswers,
    automaticAnswers,
    mockJwtBody,
    mockUrlArticleId;
  const automaticAnswersPath = buildSrcPath('component/automaticAnswers/AutomaticAnswers');
  const mockTicketId = 123456;
  const mockToken = 'abcdef';

  beforeEach(() => {
    resetDOM();

    mockery.enable();

    initMockRegistry({
      'service/i18n': {
        i18n: {
          t: _.identity
        }
      },
      'utility/pages': {
        getHelpCenterArticleId: jasmine.createSpy().and.callFake(() => mockUrlArticleId)
      },
      'utility/utils': {
        bindMethods: mockBindMethods
      },
      'service/automaticAnswersPersistence' : {
        automaticAnswersPersistence: {
          getContext: jasmine.createSpy().and.callFake(() => mockJwtBody)
        }
      },
      'component/automaticAnswers/AutomaticAnswersDesktop': {
        AutomaticAnswersDesktop: class extends Component {
          render() {
            return (
              <div className='automaticAnswers-desktop' />
            );
          }
        }
      },
      'component/automaticAnswers/AutomaticAnswersMobile': {
        AutomaticAnswersMobile: class extends Component {
          render() {
            return (
              <div className='automaticAnswers-mobile' />
            );
          }
        }
      }
    });

    AutomaticAnswers = requireUncached(automaticAnswersPath).AutomaticAnswers;

    mockUrlArticleId = 23425454;
    mockJwtBody = {
      'ticket_id': mockTicketId,
      'token': mockToken
    };
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

  describe('render', () => {
    describe('when mobile prop is true', () => {
      beforeEach(() => {
        domRender(<AutomaticAnswers mobile={true} />);
      });

      it('renders the AutomaticAnswersMobile component', function() {
        expect(document.querySelectorAll('.automaticAnswers-mobile').length)
          .toEqual(1);
      });
    });

    describe('when mobile prop is false', () => {
      beforeEach(() => {
        domRender(<AutomaticAnswers mobile={false} />);
      });

      it('renders the AutomaticAnswersDesktop component', function() {
        expect(document.querySelectorAll('.automaticAnswers-desktop').length)
          .toEqual(1);
      });
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

    describe('when the JWT body from local storage is valid, and articleId can be parsed from the pathname', () => {
      let callbacks;

      beforeEach(() => {
        automaticAnswers.handleSolveTicket();
        callbacks = mockSolveTicket.calls.mostRecent().args[3];
      });

      it('passes the ticketId, token, articleId and callbacks to the solve ticket request', () => {
        expect(mockSolveTicket)
          .toHaveBeenCalledWith(mockTicketId, mockToken, mockUrlArticleId, callbacks);
      });

      it('defines callback behaviour for the solve ticket request', () => {
        expect(callbacks.done)
          .toEqual(automaticAnswers.solveTicketDone);

        expect(callbacks.fail)
          .toEqual(automaticAnswers.solveTicketFail);
      });
    });

    describe('when the JWT body from local storage is not valid', () => {
      beforeEach(() => {
        mockJwtBody = null;
        spyOn(automaticAnswers, 'solveTicketFail');
        automaticAnswers.handleSolveTicket();
      });

      it('calls solveTicketFail', () => {
        expect(automaticAnswers.solveTicketFail)
          .toHaveBeenCalled();
      });

      it('does not make a call to solve the ticket', () => {
        expect(mockSolveTicket)
          .not.toHaveBeenCalled();
      });
    });

    describe('when the Help Center articleId cannot be parsed from the pathname', () => {
      beforeEach(() => {
        mockUrlArticleId = null;
        automaticAnswers.handleSolveTicket();
      });

      it('does not make a call to solve the ticket', () => {
        expect(mockSolveTicket)
          .not.toHaveBeenCalled();
      });
    });

    describe('error behaviour when parameter condition is false', () => {
      beforeEach(() => {
        mockUrlArticleId = NaN;
        automaticAnswers.handleSolveTicket();
      });

      it('sets an errorMessage', () => {
        expect(automaticAnswers.state.errorMessage)
          .toBe('embeddable_framework.automaticAnswers.label.error_v2');
      });

      it('sets isSubmitting to false', () => {
        expect(automaticAnswers.state.isSubmitting)
          .toBe(false);
      });
    });

    describe('component state', () => {
      beforeEach(() => {
        automaticAnswers.setState({
          errorMessage: 'derp',
          isSubmitting: false
        });
        automaticAnswers.handleSolveTicket();
      });

      it('sets errorMessage to an empty string', () => {
        expect(automaticAnswers.state.errorMessage)
          .toEqual('');
      });

      it('sets isSubmitting to true', () => {
        expect(automaticAnswers.state.isSubmitting)
          .toBe(true);
      });
    });
  });

  describe('sending a request to solve a ticket', () => {
    const closeFrameDelay = 4000;

    beforeEach(() => {
      mockSolveTicket = jasmine.createSpy('mockSolveTicket');
      mockCloseFrame = jasmine.createSpy('mockCloseFrame');
      automaticAnswers = domRender(
         <AutomaticAnswers
           solveTicket={mockSolveTicket}
           closeFrame={mockCloseFrame} />);
    });

    describe('when the request is successful', () => {
      beforeEach(() => {
        automaticAnswers.solveTicketDone();
      });

      it('sets the solveSuccess state to true', () => {
        expect(automaticAnswers.state.solveSuccess)
          .toEqual(true);
      });

      it('sets isSubmitting to false', () => {
        expect(automaticAnswers.state.isSubmitting)
          .toBe(false);
      });

      it('closes the frame after a short delay', () => {
        expect(automaticAnswers.props.closeFrame)
          .toHaveBeenCalledWith(closeFrameDelay);
      });
    });

    describe('when the request fails', () => {
      beforeEach(() => {
        automaticAnswers.solveTicketFail();
      });

      it('sets errorMessage to the correct tanslation string', () => {
        expect(automaticAnswers.state.errorMessage)
          .toBe('embeddable_framework.automaticAnswers.label.error_v2');
      });

      it('sets isSubmitting to false', () => {
        expect(automaticAnswers.state.isSubmitting)
          .toBe(false);
      });
    });
  });
});
