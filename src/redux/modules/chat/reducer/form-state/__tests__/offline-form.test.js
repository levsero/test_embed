import offlineForm from '../offline-form';
import * as actions from 'src/redux/modules/chat/chat-action-types';
import * as baseActions from 'src/redux/modules/base/base-action-types';

describe('offlineForm', () => {
  const initialState = offlineForm(undefined, { type: '' });
  const mockFormState = {
    name: 'Terence',
    phone: '123456789',
    email: 'foo@bar',
    message: 'fred'
  };
  const reduce = (action, state = undefined) => (
    offlineForm(state, action)
  );

  test('initialState', () => {
    expect(initialState).toEqual({
      name: '',
      email: '',
      phone: '',
      message: ''
    });
  });

  describe('when a CHAT_OFFLINE_FORM_CHANGED action is dispatched', () => {
    it('sets the action payload as the state', () => {
      expect(reduce({ type: actions.CHAT_OFFLINE_FORM_CHANGED, payload: mockFormState }))
        .toEqual(mockFormState);
    });
  });

  describe('when a PREFILL_RECEIVED action is dispatched', () => {
    const newFormState = {
      name: 'Not Terence',
      email: 'foo@baz'
    };

    it('adds the action payload to the state', () => {
      expect(reduce({ type: baseActions.PREFILL_RECEIVED, payload: { prefillValues: newFormState } }))
        .toEqual({
          ...initialState,
          ...newFormState
        });
    });
  });

  describe('when a SDK_VISITOR_UPDATE action is dispatched', () => {
    let newFormState = {};

    beforeEach(() => {
      newFormState = {
        display_name: 'Not Terence',
        email: 'foo@baz',
        phone: '87654321'
      };
    });

    it('adds the action payload to the state', () => {
      expect(reduce({ type: actions.SDK_VISITOR_UPDATE, payload: { detail: newFormState } }))
        .toEqual({
          ...initialState,
          name: 'Not Terence',
          email: 'foo@baz',
          phone: '87654321'
        });
    });

    describe('when a visitor name is passed', () => {
      beforeEach(() => {
        newFormState.display_name = 'Visitor 2131231';
      });

      it('does not update visitor name', () => {
        expect(reduce({ type: actions.SDK_VISITOR_UPDATE, payload: { detail: newFormState } }))
          .toEqual({
            ...initialState,
            email: 'foo@baz',
            phone: '87654321'
          });
      });
    });
  });

  describe('when a OFFLINE_FORM_BACK_BUTTON_CLICKED action is dispatched', () => {
    it('clears the value of message', () => {
      expect(reduce({ type: actions.OFFLINE_FORM_BACK_BUTTON_CLICKED }, mockFormState))
        .toEqual({
          ...mockFormState,
          message: ''
        });
    });
  });

  describe('when an API_CLEAR_FORM action is dispatched', () => {
    it('resets the form state to initialState', () => {
      expect(reduce({ type: baseActions.API_CLEAR_FORM }, mockFormState))
        .toEqual(initialState);
    });
  });
});
