describe('submitTicket selectors', () => {
  let getFormState;

  beforeEach(() => {
    mockery.enable();

    const selectorsPath = buildSrcPath('redux/modules/submitTicket/submitTicket-selectors');

    mockery.registerAllowable(selectorsPath);

    const selectors = requireUncached(selectorsPath);

    getFormState = selectors.getFormState;
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
});
