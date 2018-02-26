describe('submitTicket selectors', () => {
  let getFormState,
    getLoading,
    getActiveTicketForm,
    getTicketFormsAvailable,
    getTicketFieldsAvailable,
    getTicketFields,
    getTicketForms,
    getActiveTicketFormFields;

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
    getActiveTicketFormFields = selectors.getActiveTicketFormFields;
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
        ticketForms: [{ id: 1 }, { id: 2 }, { id: 4 }]
      }
    };

    beforeEach(() => {
      result = getTicketForms(mockSubmitTicketState);
    });

    it('returns the current state of ticketForms', () => {
      expect(result)
        .toEqual([{ id: 1 }, { id: 2 }, { id: 4 }]);
    });
  });

  describe('getTicketFormsAvailable', () => {
    let result;
    const mockSubmitTicketState = {
      submitTicket: {
        ticketForms: [{ id: 1 }, { id: 2 }, { id: 4 }]
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
        ticketFields: [{ id: 1 }, { id: 3 }, { id: 5 }]
      }
    };

    beforeEach(() => {
      result = getTicketFields(mockSubmitTicketState);
    });

    it('returns the current state of ticketFields', () => {
      const expectation = {
        1: { id: 1 },
        3: { id: 3 },
        5: { id: 5 }
      };

      expect(result)
        .toEqual(jasmine.objectContaining(expectation));
    });
  });

  describe('getTicketFieldsAvailable', () => {
    let result;
    const mockSubmitTicketState = {
      submitTicket: {
        ticketFields: [{ id: 2 }, { id: 3 }, { id: 5 }]
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

  describe('getActiveTicketFormFields', () => {
    let result;
    const mockSubmitTicketState = {
      submitTicket: {
        activeForm: {
          id: 2,
          ticket_field_ids: [777, 'blah', 111, 333, 555, 420] // eslint-disable-line camelcase
        },
        ticketFields: {
          111: { id: 111 },
          222: { id: 222 },
          333: { id: 333 },
          444: { id: 444 },
          555: { id: 555 },
          666: { id: 666 },
          777: { id: 777 }
        }
      }
    };

    beforeEach(() => {
      result = getActiveTicketFormFields(mockSubmitTicketState);
    });

    it('returns the an array of sorted ticket forms', () => {
      const expectation = [{ id: 777 }, { id: 111 }, { id: 333 }, { id: 555 }];

      expect(result)
        .toEqual(expectation);
    });

    it('ignores ticket fields that do not exist', () => {
      const ticketFieldIds = _.map(result, (obj) => obj.id);
      const doesNotInclude = (fieldName) => !_.includes(ticketFieldIds, fieldName);

      expect(doesNotInclude('blah'))
        .toBe(true);

      expect(doesNotInclude(420))
        .toBe(true);
    });
  });
});
