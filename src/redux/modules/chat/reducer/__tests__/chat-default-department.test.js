import chatDefaultDepartment from '../chat-default-department';
import * as actions from 'src/redux/modules/chat/chat-action-types';

describe('chatDefaultDepartment', () => {
  const initialState = chatDefaultDepartment(undefined, { type: '' });
  const reduce = (action) => (
    chatDefaultDepartment(undefined, action)
  );

  test('initialState', () => {
    expect(initialState).toEqual({ id: null });
  });

  describe('when a nonsense action type is passed', () => {
    it('returns the current state', () => {
      expect(reduce({ type: 'DERP' })).toEqual(initialState);
    });
  });

  describe('when a SDK_VISITOR_DEFAULT_DEPARTMENT_UPDATE action type is passed', () => {
    describe('when no payload is passed', () => {
      it('returns the current state', () => {
        expect(reduce({ type: actions.SDK_VISITOR_DEFAULT_DEPARTMENT_UPDATE }))
          .toEqual(initialState);
      });
    });

    describe('when a malformed payload is passed', () => {
      it('returns the current state', () => {
        expect(reduce({
          type: actions.SDK_VISITOR_DEFAULT_DEPARTMENT_UPDATE,
          payload: { foo: 'bar' }
        })).toEqual(initialState);
      });
    });

    describe('when a correctly formed payload is passed', () => {
      it('returns a new updated state', () => {
        expect(reduce({
          type: actions.SDK_VISITOR_DEFAULT_DEPARTMENT_UPDATE,
          payload: {
            detail: { id: 123456 }
          }
        })).toEqual({ id: 123456 });
      });
    });
  });
});
