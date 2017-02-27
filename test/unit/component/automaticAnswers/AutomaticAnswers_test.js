describe('AutomaticAnswers component', () => {
  let mockSolveTicket,
    mockMarkArticleIrrelevant,
    AutomaticAnswers,
    automaticAnswers,
    AutomaticAnswersScreen,
    mockJwtToken,
    mockUrlArticleId;
  const automaticAnswersPath = buildSrcPath('component/automaticAnswers/AutomaticAnswers');

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
      'service/automaticAnswersPersistence' : {
        automaticAnswersPersistence: {
          getContext: jasmine.createSpy().and.callFake(() => mockJwtToken)
        }
      }
    });

    AutomaticAnswersScreen = requireUncached(automaticAnswersPath).AutomaticAnswersScreen;
    AutomaticAnswers = requireUncached(automaticAnswersPath).AutomaticAnswers;

    mockUrlArticleId = 23425454;
    mockJwtToken = 'abcdef.hijk.lmnop';
  });

  describe('instantiation', () => {
    describe('without props', () => {
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

      it('sets an empty errorMessage', () => {
        expect(automaticAnswers.state.errorMessage)
          .toEqual('');
      });

      it('sets the initial screen to SOLVE_TICKET_QUESTION', () => {
        expect(automaticAnswers.state.screen)
          .toEqual(AutomaticAnswersScreen.solveTicketQuestion);
      });
    });

    describe('with initialScreen', () => {
      describe('as undefined', () => {
        beforeEach(() => {
          automaticAnswers = shallow(
            <AutomaticAnswers initialScreen={undefined} />
          );
        });

        it('sets screen to SOLVE_TICKET_QUESTION', () => {
          expect(automaticAnswers.state().screen)
            .toEqual(AutomaticAnswersScreen.solveTicketQuestion);
        });
      });

      describe('as SOLVE_TICKET_QUESTION', () => {
        beforeEach(() => {
          automaticAnswers = shallow(
            <AutomaticAnswers initialScreen={AutomaticAnswersScreen.solveTicketQuestion} />
          );
        });

        it('sets screen to SOLVE_TICKET_QUESTION', () => {
          expect(automaticAnswers.state().screen)
            .toEqual(AutomaticAnswersScreen.solveTicketQuestion);
        });
      });

      describe('as MARK_AS_IRRELEVANT', () => {
        beforeEach(() => {
          automaticAnswers = shallow(<AutomaticAnswers initialScreen={AutomaticAnswersScreen.markAsIrrelevant} />);
        });

        it('sets screen to MARK_AS_IRRELEVANT', () => {
          expect(automaticAnswers.state().screen)
            .toEqual(AutomaticAnswersScreen.markAsIrrelevant);
        });
      });

      describe('as TICKET_CLOSED', () => {
        beforeEach(() => {
          automaticAnswers = shallow(<AutomaticAnswers initialScreen={AutomaticAnswersScreen.ticketClosed} />);
        });

        it('sets screen to TICKET_CLOSED', () => {
          expect(automaticAnswers.state().screen)
            .toEqual(AutomaticAnswersScreen.ticketClosed);
        });
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

  describe('goToMarkAsIrrelevant', () => {
    beforeEach(() => {
      automaticAnswers = instanceRender(<AutomaticAnswers />);
      automaticAnswers.goToMarkAsIrrelevant();
    });

    it('updates the screen to MARK_AS_IRRELEVANT', () => {
      expect(automaticAnswers.state.screen)
        .toEqual(AutomaticAnswersScreen.markAsIrrelevant);
    });
  });

  describe('handleSolveTicket', () => {
    const e = { preventDefault: () => {} };

    beforeEach(() => {
      mockSolveTicket = jasmine.createSpy('mockSolveTicket');
      automaticAnswers = instanceRender(
         <AutomaticAnswers
           solveTicket={mockSolveTicket} />);
    });

    describe('when the JWT body from local storage is valid, and articleId can be parsed from the pathname', () => {
      let callbacks;

      beforeEach(() => {
        automaticAnswers.handleSolveTicket(e);
        callbacks = mockSolveTicket.calls.mostRecent().args[2];
      });

      it('passes the auth_token, articleId and callbacks to the solve ticket request', () => {
        expect(mockSolveTicket)
          .toHaveBeenCalledWith(mockJwtToken, mockUrlArticleId, callbacks);
      });

      it('defines callback behaviour for the solve ticket request', () => {
        expect(callbacks.done)
          .toEqual(automaticAnswers.solveTicketDone);

        expect(callbacks.fail)
          .toEqual(automaticAnswers.requestFailed);
      });
    });

    describe('when the JWT token from local storage is not valid', () => {
      beforeEach(() => {
        mockJwtToken = null;
        spyOn(automaticAnswers, 'requestFailed');
        automaticAnswers.handleSolveTicket(e);
      });

      it('calls requestFailed', () => {
        expect(automaticAnswers.requestFailed)
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
        automaticAnswers.handleSolveTicket(e);
      });

      it('does not make a call to solve the ticket', () => {
        expect(mockSolveTicket)
          .not.toHaveBeenCalled();
      });
    });

    describe('error behaviour when parameter condition is false', () => {
      beforeEach(() => {
        mockUrlArticleId = NaN;
        automaticAnswers.handleSolveTicket(e);
      });

      it('sets an errorMessage', () => {
        expect(automaticAnswers.state.errorMessage)
          .toBe('embeddable_framework.automaticAnswers.label.error_mobile');
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
        automaticAnswers.handleSolveTicket(e);
      });

      it('sets isSubmitting to true', () => {
        expect(automaticAnswers.state.isSubmitting)
          .toBe(true);
      });
    });
  });

  describe('sending a request to solve a ticket', () => {
    beforeEach(() => {
      mockSolveTicket = jasmine.createSpy('mockSolveTicket');
      automaticAnswers = domRender(
         <AutomaticAnswers
           solveTicket={mockSolveTicket}
           closeFrame={() => {}} />);
    });

    describe('when the request is successful', () => {
      beforeEach(() => {
        automaticAnswers.solveTicketDone();
      });

      it('sets screen to ticketClosed', () => {
        expect(automaticAnswers.state.screen)
          .toBe(AutomaticAnswersScreen.ticketClosed);
      });

      it('sets isSubmitting to false', () => {
        expect(automaticAnswers.state.isSubmitting)
          .toBe(false);
      });

      it('sets errorMessage to an empty string', () => {
        expect(automaticAnswers.state.errorMessage)
          .toBe('');
      });
    });

    describe('when the request fails', () => {
      beforeEach(() => {
        automaticAnswers.requestFailed();
      });

      it('sets errorMessage to the correct tanslation string', () => {
        expect(automaticAnswers.state.errorMessage)
          .toBe('embeddable_framework.automaticAnswers.label.error_mobile');
      });

      it('sets isSubmitting to false', () => {
        expect(automaticAnswers.state.isSubmitting)
          .toBe(false);
      });
    });
  });

  describe('handleMarkArticleAsIrrelevant', () => {
    const mockReason = 3;
    const e = { preventDefault: () => {} };

    beforeEach(() => {
      mockMarkArticleIrrelevant = jasmine.createSpy('mockMarkArticleIrrelevant');
      automaticAnswers = instanceRender(
         <AutomaticAnswers
           closeFrame={() => {}}
           markArticleIrrelevant={mockMarkArticleIrrelevant} />);
    });

    describe('when the JWT body from local storage is valid, and articleId can be parsed from the pathname', () => {
      let callbacks;

      beforeEach(() => {
        automaticAnswers.handleMarkArticleAsIrrelevant(mockReason, e);
        callbacks = mockMarkArticleIrrelevant.calls.mostRecent().args[3];
      });

      it('passes the auth_token, articleId and callbacks to the solve ticket request', () => {
        expect(mockMarkArticleIrrelevant)
          .toHaveBeenCalledWith(mockJwtToken, mockUrlArticleId, mockReason, callbacks);
      });

      it('defines callback behaviour for the mark article irrelevant request', () => {
        expect(callbacks.done)
          .toEqual(automaticAnswers.markArticleIrrelevantDone);

        expect(callbacks.fail)
          .toEqual(automaticAnswers.requestFailed);
      });
    });

    describe('when the JWT token from local storage is not valid', () => {
      beforeEach(() => {
        mockJwtToken = null;
        spyOn(automaticAnswers, 'requestFailed');
        automaticAnswers.handleMarkArticleAsIrrelevant(mockReason, e);
      });

      it('calls requestFailed', () => {
        expect(automaticAnswers.requestFailed)
          .toHaveBeenCalled();
      });

      it('does not make a call to mark the article as irrelevant', () => {
        expect(mockMarkArticleIrrelevant)
          .not.toHaveBeenCalled();
      });
    });

    describe('when the Help Center articleId cannot be parsed from the pathname', () => {
      beforeEach(() => {
        mockUrlArticleId = null;
        automaticAnswers.handleMarkArticleAsIrrelevant(mockReason, e);
      });

      it('does not make a call to mark the article as irrelevant', () => {
        expect(mockMarkArticleIrrelevant)
          .not.toHaveBeenCalled();
      });
    });

    describe('error behaviour when parameter condition is false', () => {
      beforeEach(() => {
        mockUrlArticleId = NaN;
        automaticAnswers.handleMarkArticleAsIrrelevant(mockReason, e);
      });

      it('sets an errorMessage', () => {
        expect(automaticAnswers.state.errorMessage)
          .toBe('embeddable_framework.automaticAnswers.label.error_mobile');
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
        automaticAnswers.handleMarkArticleAsIrrelevant(mockReason, e);
      });

      it('sets isSubmitting to true', () => {
        expect(automaticAnswers.state.isSubmitting)
          .toBe(true);
      });
    });

    describe('when article has been marked as irrelevant successfully', () => {
      beforeEach(() => {
        automaticAnswers.setState({
          errorMessage: 'derp',
          isSubmitting: true
        });
        automaticAnswers.markArticleIrrelevantDone();
      });

      it('sets screen to thanksForFeedback', () => {
        expect(automaticAnswers.state.screen)
          .toBe(AutomaticAnswersScreen.thanksForFeedback);
      });

      it('sets isSubmitting to false', () => {
        expect(automaticAnswers.state.isSubmitting)
          .toBe(false);
      });

      it('sets errorMessage to an empty string', () => {
        expect(automaticAnswers.state.errorMessage)
          .toBe('');
      });
    });
  });

  describe('randomise options', () => {
    describe('when the options are [a, b]', () => {
      const options = ['a', 'b'];

      beforeEach(() => {
        automaticAnswers = instanceRender(<AutomaticAnswers />);
      });

      describe('and ticket id is odd', () => {
        beforeEach(() => {
          automaticAnswers.updateTicket({ 'nice_id': 1 });
        });

        it('equals to [b, a]', () => {
          expect(automaticAnswers.randomiseOptions(options))
            .toEqual(['b', 'a']);
        });
      });

      describe('and ticket id is even', () => {
        beforeEach(() => {
          automaticAnswers.updateTicket({ 'nice_id': 2 });
        });

        it('equals to [a, b]', () => {
          expect(automaticAnswers.randomiseOptions(options))
            .toEqual(['a', 'b']);
        });
      });
    });

    describe('when the options are [a, b, c]', () => {
      const options = ['a', 'b', 'c'];

      beforeEach(() => {
        automaticAnswers = instanceRender(<AutomaticAnswers />);
      });

      describe('and (ticket id % 3) == 0', () => {
        beforeEach(() => {
          automaticAnswers.updateTicket({ 'nice_id': 6 });
        });

        it('equals to [a, b, c]', () => {
          expect(automaticAnswers.randomiseOptions(options))
            .toEqual(['a', 'b', 'c']);
        });
      });

      describe('and (ticket id % 3) == 1', () => {
        beforeEach(() => {
          automaticAnswers.updateTicket({ 'nice_id': 7 });
        });

        it('equals to [b, c, a]', () => {
          expect(automaticAnswers.randomiseOptions(options))
            .toEqual(['b', 'c', 'a']);
        });
      });

      describe('and (ticket id % 3) == 2', () => {
        beforeEach(() => {
          automaticAnswers.updateTicket({ 'nice_id': 8 });
        });

        it('equals to [c, a, b]', () => {
          expect(automaticAnswers.randomiseOptions(options))
            .toEqual(['c', 'a', 'b']);
        });
      });
    });
  });

  describe('handleDismissalContext', () => {
    const mockCloseFrame = jasmine.createSpy();

    beforeEach(() => {
      automaticAnswers = shallow(<AutomaticAnswers closeFrame={mockCloseFrame} />);
    });

    describe('when the screen state is markAsIrrelevant', () => {
      beforeEach(() => {
        automaticAnswers.setState({
          screen: AutomaticAnswersScreen.markAsIrrelevant,
          errorMessage: 'derp'
        });
        automaticAnswers.instance().handleDismissalContext();
      });

      it('updates the screen to solveTicketQuestion', () => {
        expect(automaticAnswers.state().screen)
          .toEqual(AutomaticAnswers.solveTicketQuestion);
      });

      it('sets the errorMessage to an empty string', () => {
        expect(automaticAnswers.state().errorMessage)
          .toEqual('');
      });

      it('does not close the frame', () => {
        expect(mockCloseFrame)
          .not.toHaveBeenCalled();
      });
    });

    describe('when the screen state is not markAsIrrelevant', () => {
      beforeEach(() => {
        automaticAnswers.setState({ screen: AutomaticAnswersScreen.ticketClosed });
        automaticAnswers.instance().handleDismissalContext();
      });

      it('closes the frame', () => {
        expect(mockCloseFrame)
          .toHaveBeenCalled();
      });
    });
  });
});
