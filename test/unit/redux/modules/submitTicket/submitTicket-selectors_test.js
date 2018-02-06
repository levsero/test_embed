describe('submitTicket selectors', () => {
  let getFormState,
    getLoading,
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
});
