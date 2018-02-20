describe('submitTicket selectors', () => {
  let getFormState,
    getLoading,
    getActiveTicketForm,
    getTicketFormsAvailable,
    getTicketFieldsAvailable,
    getTicketFields,
    getTicketForms;

  beforeEach(() => {
    mockery.enable();

    const selectorsPath = buildSrcPath('redux/modules/submitTicket/submitTicket-selectors');

    mockery.registerAllowable(selectorsPath);

    const selectors = requireUncached(selectorsPath);

    getFormState = selectors.getFormState;
    getLoading = selectors.getLoading;
    getTicketFields = selectors.getTicketFields;
    getTicketForms = selectors.getTicketForms;
    getActiveTicketForm = selectors.getActiveTicketForm;
    getTicketFormsAvailable = selectors.getTicketFormsAvailable;
    getTicketFieldsAvailable = selectors.getTicketFieldsAvailable;
  });

  describe('getFormState', () => {
    let result;
    const mockFormState = {
      name: 'Gandalf',
      email: 'abc@123.com'
    };
    const mockSubmitTicketState = {
      submitTicket: {
        formState: mockFormState
      }
    };

    beforeEach(() => {
      result = getFormState(mockSubmitTicketState);
    });

    it('returns the current state of formState', () => {
      expect(result)
        .toEqual(mockFormState);
    });
  });

  describe('getLoading', () => {
    let result;
    const mockSubmitTicketState = {
      submitTicket: {
        loading: false
      }
    };

    beforeEach(() => {
      result = getLoading(mockSubmitTicketState);
    });

    it('returns the current state of loading', () => {
      expect(result)
        .toEqual(false);
    });
  });

  describe('getTicketForms', () => {
    let result;
    const mockSubmitTicketState = {
      submitTicket: {
        ticketForms: [1, 2, 4]
      }
    };

    beforeEach(() => {
      result = getTicketForms(mockSubmitTicketState);
    });

    it('returns the current state of ticketForms', () => {
      expect(result)
        .toEqual([1, 2, 4]);
    });
  });

  describe('getTicketFormsAvailable', () => {
    let result;
    const mockSubmitTicketState = {
      submitTicket: {
        ticketForms: [1, 2, 4]
      }
    };

    describe('when the ticket fields array is not empty', () => {
      beforeEach(() => {
        result = getTicketFormsAvailable(mockSubmitTicketState);
      });

      it('returns true', () => {
        expect(result)
          .toEqual(true);
      });
    });

    describe('when the ticket fields array is empty', () => {
      beforeEach(() => {
        mockSubmitTicketState.submitTicket.ticketForms = [];
        result = getTicketFormsAvailable(mockSubmitTicketState);
      });

      it('returns false', () => {
        expect(result)
          .toEqual(false);
      });
    });
  });

  describe('getTicketFields', () => {
    let result;
    const mockSubmitTicketState = {
      submitTicket: {
        ticketFields: [2, 3, 5]
      }
    };

    beforeEach(() => {
      result = getTicketFields(mockSubmitTicketState);
    });

    it('returns the current state of ticketFields', () => {
      expect(result)
        .toEqual([2, 3, 5]);
    });
  });

  describe('getTicketFieldsAvailable', () => {
    let result;
    const mockSubmitTicketState = {
      submitTicket: {
        ticketFields: [2, 3, 5]
      }
    };

    describe('when the ticket fields array is not empty', () => {
      beforeEach(() => {
        result = getTicketFieldsAvailable(mockSubmitTicketState);
      });

      it('returns true', () => {
        expect(result)
          .toEqual(true);
      });
    });

    describe('when the ticket fields array is empty', () => {
      beforeEach(() => {
        mockSubmitTicketState.submitTicket.ticketFields = [];
        result = getTicketFieldsAvailable(mockSubmitTicketState);
      });

      it('returns false', () => {
        expect(result)
          .toEqual(false);
      });
    });
  });

  describe('getActiveTicketForm', () => {
    let result;
    const mockSubmitTicketState = {
      submitTicket: {
        activeForm: { id: 2 }
      }
    };

    beforeEach(() => {
      result = getActiveTicketForm(mockSubmitTicketState);
    });

    it('returns the current state of activeForm', () => {
      expect(result)
        .toEqual({ id: 2 });
    });
  });
});
