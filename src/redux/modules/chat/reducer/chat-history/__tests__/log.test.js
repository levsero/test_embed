import chatLog from '../log';
import * as actions from 'src/redux/modules/chat/chat-action-types';

describe('chat-history log', () => {
  let state;

  const initialState = () => chatLog(undefined, { type: '' });
  const reduce = (action) => chatLog(state, action);

  test('initialState', () => {
    expect(initialState()).toEqual({
      entries: [],
      buffer: []
    });
  });

  describe('SDK message actions', () => {
    beforeEach(() => {
      state = initialState();
    });

    describe.each([
      actions.SDK_HISTORY_CHAT_FILE,
      actions.SDK_HISTORY_CHAT_MSG
    ])('when a %s action is received', (actionType) => {
      const action = {
        type: actionType,
        payload: {
          detail: { nick: 'message_guy', timestamp: 12345 }
        }
      };

      describe('when the latest group was a message group from the same author', () => {
        beforeEach(() => {
          state = { ...state, buffer: [
            { type: 'event', author: 'other_guy', messages: [10001] },
            { type: 'message', author: 'other_guy', messages: [10002] },
            { type: 'message', author: 'message_guy', messages: [10003] }
          ] };
        });

        test('appends the message timestamp to the latest group in the buffer', () => {
          expect(reduce(action))
            .toMatchSnapshot();
        });
      });

      describe('when the latest group was a message group from a different author', () => {
        beforeEach(() => {
          state = { ...state, buffer: [
            { type: 'event', author: 'other_guy', messages: [10001] },
            { type: 'message', author: 'other_guy', messages: [10002] }
          ] };
        });

        test('adds a new message group to the buffer', () => {
          expect(reduce(action))
            .toMatchSnapshot();
        });
      });

      describe('when the latest group was an event group', () => {
        beforeEach(() => {
          state = { ...state, buffer: [
            { type: 'event', author: 'other_guy', messages: [10001] },
            { type: 'message', author: 'other_guy', messages: [10002] },
            { type: 'message', author: 'message_guy', messages: [10003] },
            { type: 'event', author: 'some_guy', messages: [10004] }
          ] };
        });

        test('adds a new message group to the buffer', () => {
          expect(reduce(action))
            .toMatchSnapshot();
        });
      });
    });
  });

  describe('SDK event actions', () => {
    beforeEach(() => {
      state = initialState();
    });

    describe.each([
      actions.SDK_HISTORY_CHAT_REQUEST_RATING,
      actions.SDK_HISTORY_CHAT_RATING,
      actions.SDK_HISTORY_CHAT_COMMENT,
      actions.SDK_HISTORY_CHAT_MEMBER_JOIN,
      actions.SDK_HISTORY_CHAT_MEMBER_LEAVE
    ])('when a %s action is received', (actionType) => {
      const action = {
        type: actionType,
        payload: {
          detail: { nick: 'event_guy', timestamp: 12345 }
        }
      };

      test('adds a new event group to the buffer', () => {
        expect(reduce(action))
          .toMatchSnapshot();
      });
    });
  });

  describe('when a HISTORY_REQUEST_SUCCESS action is received', () => {
    const action = {
      type: actions.HISTORY_REQUEST_SUCCESS,
      payload: {}
    };

    beforeEach(() => {
      state = {
        entries: [
          { type: 'event', author: 'other_guy', messages: [10001] },
          { type: 'message', author: 'other_guy', messages: [10002] },
          { type: 'message', author: 'message_guy', messages: [10003] },
          { type: 'event', author: 'other_guy', messages: [10004] }
        ],
        buffer: [
          { type: 'message', author: 'other_guy', messages: [10005,10006] },
          { type: 'message', author: 'message_guy', messages: [10007] },
          { type: 'event', author: 'message_guy', messages: [10008] }
        ]
      };
    });

    test('appends the buffered entries to the entries array and clears the buffer array', () => {
      expect(reduce(action))
        .toMatchSnapshot();
    });
  });
});
