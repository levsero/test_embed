import chatLog from '../chat-log';
import * as actions from 'src/redux/modules/chat/chat-action-types';
import { API_RESET_WIDGET } from 'src/redux/modules/base/base-action-types';
import { CHAT_STRUCTURED_CONTENT_TYPE } from 'constants/chat';

describe('chatLog', () => {
  let state;

  const initialState = () => chatLog(undefined, { type: '' });
  const reduce = (action) => chatLog(state, action);

  test('initialState', () => {
    expect(initialState()).toEqual({
      firstVisitorMessage: -1,
      latestRating: -1,
      latestRatingRequest: -1,
      latestQuickReply: -1,
      latestAgentLeaveEvent: -1,
      lastMessageAuthor: '',
      groups: []
    });
  });

  describe('when an API_RESET_WIDGET action is received', () => {
    const mockState = { firstVisitorMessage: 'foo bar' };
    const action = { type: API_RESET_WIDGET };

    it('returns the initial state', () => {
      expect(chatLog(mockState, action)).toEqual(initialState());
    });
  });

  describe('firstVisitorMessage', () => {
    beforeEach(() => {
      state = initialState();
    });

    describe('when a CHAT_MSG_REQUEST_SENT action is received', () => {
      const action = {
        type: actions.CHAT_MSG_REQUEST_SENT,
        payload: {
          detail: { nick: 'visitor', timestamp: 12345, type: 'chat.msg', msg: 'oh hi' }
        }
      };

      describe('and firstVisitorMessage has not been set', () => {
        it('updates the state with the message timestamp', () => {
          expect(reduce(action))
            .toHaveProperty('firstVisitorMessage', 12345);
        });
      });

      describe('and firstVisitorMessage has previously been set', () => {
        beforeEach(() => {
          state = { firstVisitorMessage: 11111 };
        });

        it('does not update the state', () => {
          expect(reduce(action))
            .toHaveProperty('firstVisitorMessage', 11111);
        });
      });
    });

    describe('when a CHAT_FILE_REQUEST_SENT action is received', () => {
      const action = {
        type: actions.CHAT_FILE_REQUEST_SENT,
        payload: {
          detail: { nick: 'visitor', timestamp: 12345, type: 'chat.file' }
        }
      };

      describe('and firstVisitorMessage has not been set', () => {
        it('updates the state with the message timestamp', () => {
          expect(reduce(action))
            .toHaveProperty('firstVisitorMessage', 12345);
        });
      });

      describe('and firstVisitorMessage has previously been set', () => {
        beforeEach(() => {
          state = { firstVisitorMessage: 11111 };
        });

        it('does not update the state', () => {
          expect(reduce(action))
            .toHaveProperty('firstVisitorMessage', 11111);
        });
      });
    });

    describe('when any other action is received', () => {
      it('does not update the state', () => {
        expect(reduce({ type: 'RANDOM_ACT_OF_ACTION' }))
          .toHaveProperty('firstVisitorMessage', initialState().firstVisitorMessage);
      });
    });
  });

  describe('latestRating', () => {
    describe('when a SDK_CHAT_RATING action is received', () => {
      const action = {
        type: actions.SDK_CHAT_RATING,
        payload: {
          detail: { nick: 'visitor', timestamp: 12345, type: 'chat.rating' }
        }
      };

      it('updates the state with the message timestamp', () => {
        expect(reduce(action))
          .toHaveProperty('latestRating', 12345);
      });
    });

    describe('when any other action is received', () => {
      it('does not update the state', () => {
        expect(reduce({ type: 'RANDOM_ACT_OF_ACTION' }))
          .toHaveProperty('latestRating', initialState().latestRating);
      });
    });
  });

  describe('latestRatingRequest', () => {
    describe('when a SDK_CHAT_REQUEST_RATING action is received', () => {
      const action = {
        type: actions.SDK_CHAT_REQUEST_RATING,
        payload: {
          detail: { nick: 'agent:smith', timestamp: 12345, type: 'chat.rating_request' }
        }
      };

      it('updates the state with the message timestamp', () => {
        expect(reduce(action))
          .toHaveProperty('latestRatingRequest', 12345);
      });
    });

    describe('when any other action is received', () => {
      it('does not update the state', () => {
        expect(reduce({ type: 'RANDOM_ACT_OF_ACTION' }))
          .toHaveProperty('latestRatingRequest', initialState().latestRatingRequest);
      });
    });
  });

  describe('latestQuickReply', () => {
    describe('when a SDK_CHAT_MSG action is received', () => {
      describe('and it is a quickReplies message', () => {
        const action = {
          type: actions.SDK_CHAT_MSG,
          payload: {
            detail: {
              nick: 'agent:smith', timestamp: 12345, type: 'chat.msg',
              structured_msg: { type: CHAT_STRUCTURED_CONTENT_TYPE.QUICK_REPLIES }
            }
          }
        };

        it('updates the state with the message timestamp incremented by 1', () => {
          expect(reduce(action))
            .toHaveProperty('latestQuickReply', 12346);
        });
      });

      describe('and it is not a quickReplies message', () => {
        const action = {
          type: actions.SDK_CHAT_MSG,
          payload: {
            detail: { nick: 'agent:smith', timestamp: 12345, type: 'chat.msg' }
          }
        };

        it('unsets the timestamp from the state', () => {
          expect(reduce(action))
            .toHaveProperty('latestQuickReply', -1);
        });
      });
    });

    describe.each([
      actions.CHAT_MSG_REQUEST_SENT,
      actions.CHAT_FILE_REQUEST_SENT,
      actions.SDK_CHAT_FILE,
      actions.SDK_CHAT_REQUEST_RATING,
      actions.SDK_CHAT_RATING,
      actions.SDK_CHAT_COMMENT,
      actions.CHAT_CONTACT_DETAILS_UPDATE_SUCCESS
    ])('when a %s action is received', (actionType) => {
      it('unsets the timestamp from the state', () => {
        expect(reduce({ type: actionType, payload: { detail: { nick: 'system', timestamp: 12345 } } }))
          .toHaveProperty('latestQuickReply', -1);
      });
    });

    describe('when any other action is received', () => {
      it('does not update the state', () => {
        expect(reduce({ type: 'RANDOM_ACT_OF_ACTION' }))
          .toHaveProperty('latestQuickReply', initialState().latestQuickReply);
      });
    });
  });

  describe('latestAgentLeaveEvent', () => {
    describe('when a SDK_CHAT_MEMBER_LEAVE action is received', () => {
      describe('and an agent left', () => {
        const action = {
          type: actions.SDK_CHAT_MEMBER_LEAVE,
          payload: {
            detail: { nick: 'agent:smith', timestamp: 12345, type: 'chat.memberleave' }
          }
        };

        it('updates the state with the message timestamp', () => {
          expect(reduce(action))
            .toHaveProperty('latestAgentLeaveEvent', 12345);
        });
      });

      describe('and a visitor left', () => {
        const action = {
          type: actions.SDK_CHAT_MEMBER_LEAVE,
          payload: {
            detail: { nick: 'visitor', timestamp: 12345, type: 'chat.memberleave' }
          }
        };

        it('does not update the state', () => {
          expect(reduce(action))
            .toHaveProperty('latestAgentLeaveEvent', initialState().latestAgentLeaveEvent);
        });
      });
    });

    describe('when any other action is received', () => {
      it('does not update the state', () => {
        expect(reduce({ type: 'RANDOM_ACT_OF_ACTION' }))
          .toHaveProperty('latestAgentLeaveEvent', initialState().latestAgentLeaveEvent);
      });
    });
  });

  describe('lastMessageAuthor', () => {
    describe.each([
      actions.CHAT_MSG_REQUEST_SENT,
      actions.CHAT_FILE_REQUEST_SENT,
      actions.SDK_CHAT_FILE,
      actions.SDK_CHAT_MSG
    ])('when a %s action is received', (actionType) => {
      const action = {
        type: actionType,
        payload: {
          detail: { nick: 'message_guy', timestamp: 12345 }
        }
      };

      it('updates the state with the message nick', () => {
        expect(reduce(action))
          .toHaveProperty('lastMessageAuthor', 'message_guy');
      });
    });

    describe('when any other action is received', () => {
      it('does not update the state', () => {
        expect(reduce({ type: 'RANDOM_ACT_OF_ACTION' }))
          .toHaveProperty('lastMessageAuthor', initialState().lastMessageAuthor);
      });
    });
  });

  describe('groups', () => {
    describe('messages', () => {
      beforeEach(() => {
        state = initialState();
      });

      describe.each([
        actions.CHAT_MSG_REQUEST_SENT,
        actions.CHAT_FILE_REQUEST_SENT,
        actions.SDK_CHAT_FILE,
        actions.SDK_CHAT_MSG
      ])('when a %s action is received', (actionType) => {
        const action = {
          type: actionType,
          payload: {
            detail: { nick: 'message_guy', timestamp: 12345 }
          }
        };

        describe('when the latest group was a message group from the same author', () => {
          beforeEach(() => {
            state = { ...state, groups: [
              { type: 'event', author: 'other_guy', messages: [10001] },
              { type: 'message', author: 'other_guy', messages: [10002] },
              { type: 'message', author: 'message_guy', messages: [10003] }
            ] };
          });

          test('appends the message timestamp to the latest group', () => {
            expect(reduce(action).groups)
              .toMatchSnapshot();
          });
        });

        describe('when the latest group was a message group from a different author', () => {
          beforeEach(() => {
            state = { ...state, groups: [
              { type: 'event', author: 'other_guy', messages: [10001] },
              { type: 'message', author: 'other_guy', messages: [10002] }
            ] };
          });

          test('adds a new message group', () => {
            expect(reduce(action).groups)
              .toMatchSnapshot();
          });
        });

        describe('when the latest group was an event group', () => {
          beforeEach(() => {
            state = { ...state, groups: [
              { type: 'event', author: 'other_guy', messages: [10001] },
              { type: 'message', author: 'other_guy', messages: [10002] },
              { type: 'message', author: 'message_guy', messages: [10003] },
              { type: 'event', author: 'some_guy', messages: [10004] }
            ] };
          });

          test('adds a new message group', () => {
            expect(reduce(action).groups)
              .toMatchSnapshot();
          });
        });
      });
    });
  });

  describe('events', () => {
    beforeEach(() => {
      state = initialState();
    });

    describe.each([
      actions.SDK_CHAT_REQUEST_RATING,
      actions.SDK_CHAT_RATING,
      actions.SDK_CHAT_COMMENT,
      actions.SDK_CHAT_MEMBER_JOIN,
      actions.SDK_CHAT_MEMBER_LEAVE
    ])('when a %s action is received', (actionType) => {
      const action = {
        type: actionType,
        payload: {
          detail: { nick: 'event_guy', timestamp: 12345 }
        }
      };

      test('adds a new event group', () => {
        expect(reduce(action).groups)
          .toMatchSnapshot();
      });
    });

    describe('when a CHAT_CONTACT_DETAILS_UPDATE_SUCCESS action is received', () => {
      const action = {
        type: actions.CHAT_CONTACT_DETAILS_UPDATE_SUCCESS,
        payload: { nick: 'visitor', timestamp: 12345 }
      };

      test('adds a new event group', () => {
        expect(reduce(action).groups)
          .toMatchSnapshot();
      });
    });
  });
});
