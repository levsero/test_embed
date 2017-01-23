import SortedMap from 'collections/sorted-map';

let reducer,
  initialState,
  msgActionPayload,
  mockSendTyping = jasmine.createSpy('sendTyping');

const reducerPath = buildSrcPath('redux/reducers/chat');
const actionsPath = buildSrcPath('redux/actions/chat');

describe('chat redux reducers', () => {
  beforeEach(() => {
    mockery.enable();

    initMockRegistry({
      'vendor/web-sdk': {
        sendTyping: mockSendTyping
      },
      'collections/sorted-map': SortedMap,
      'lodash': _
    });

    mockery.registerAllowable(reducerPath);
    reducer = requireUncached(reducerPath).default;

    mockery.registerAllowable(actionsPath);
    msgActionPayload = requireUncached(actionsPath).msgActionPayload;

    initialState = reducer();

    jasmine.clock().install();
  });

  afterEach(() => {
    jasmine.clock().uninstall();
    mockery.deregisterAll();
    mockery.disable();
  });

  describe('reducer', () => {
    describe('initial state', () => {
      it('has an empty collection of chats', () => {
        expect(initialState.chats.length)
          .toEqual(0);
      });

      it('has connection set to empty string', () => {
        expect(initialState.connection)
          .toEqual('');
      });

      it('has is_chatting set to false', () => {
        expect(initialState.is_chatting)
          .toBe(false);
      });

      it('has an empty agents object', () => {
        expect(initialState.agents)
          .toEqual({});
      });

      it('has an empty visitor object', () => {
        expect(initialState.visitor)
          .toEqual({});
      });
    });

    describe('when a SENT_CHAT_MSG_SUCCESS action is dispatched', () => {
      let state,
        testPayload;

      beforeEach(() => {
        testPayload = msgActionPayload('test');

        const action = {
          payload: testPayload,
          type: 'SENT_CHAT_MSG_SUCCESS'
        };

        state = reducer(initialState, action);
      });

      it('adds the message to the chats collection', () => {
        expect(state.chats.length)
          .toEqual(1);

        expect(state.chats.toObject()[testPayload.detail.timestamp])
          .toEqual(testPayload.detail);
      });
    });

    describe('when an UPDATE_CHAT_MSG action is dispatched', () => {
      let state;

      beforeEach(() => {
        const action = {
          payload: 'message',
          type: 'UPDATE_CHAT_MSG'
        };

        state = reducer(initialState, action);
      });

      afterEach(() => {
        mockSendTyping.calls.reset();
      });

      it('calls zChat.sendTyping with "true"', () => {
        expect(mockSendTyping)
          .toHaveBeenCalledWith(true);
      });

      it('calls zChat.sendTyping with "false" after 2 seconds', () => {
        jasmine.clock().tick(2000);

        expect(mockSendTyping)
          .toHaveBeenCalledWith(false);
      });

      it('updates the currentMessage', () => {
        expect(state.currentMessage)
          .toEqual('message');
      });
    });

    describe('when a FIREHOSE_DATA action is dispatched', () => {
      let state,
        action = { type: 'FIREHOSE_DATA', action: {} };

      describe('when payload type is connection_update', () => {
        beforeEach(() => {
          action.payload = {
            type: 'connection_update',
            detail: 'connected'
          };
          state = reducer(initialState, action);
        });

        it('updates the connection state', () => {
          expect(state.connection)
            .toEqual('connected');
        });
      });

      describe('when payload type is account_status', () => {
        beforeEach(() => {
          action.payload = {
            type: 'account_status',
            detail: 'online'
          };
          state = reducer(initialState, action);
        });

        it('updates the account_status state', () => {
          expect(state.account_status)
            .toEqual('online');
        });
      });

      describe('when payload type is department_update', () => {
        const dept = {
          id: 1,
          name: 'Best department',
          status: 'online'
        };

        beforeEach(() => {
          action.payload = {
            type: 'department_update',
            detail: [dept]
          };
          state = reducer(initialState, action);
        });

        it('updates the departments array', () => {
          expect(state.departments)
            .toContain(dept);
        });
      });

      describe('when payload type is visitor_update', () => {
        const visitor = {
          'display_name': 'Bob McBob',
          email: 'bob@example.com',
          phone: '0400123456'
        };

        beforeEach(() => {
          action.payload = {
            type: 'visitor_update',
            detail: visitor
          };
          state = reducer(initialState, action);
        });

        it('updates the visitor object', () => {
          expect(state.visitor)
            .toEqual(visitor);
        });
      });

      describe('when payload type is agent_update', () => {
      });

      describe('when payload type is chat', () => {
        describe('when payload.detail type is chat.memberjoin', () => {
        });

        describe('when payload.detail type is chat.memberleave', () => {
        });

        describe('when payload.detail type is chat.file', () => {
        });

        describe('when payload.detail type is chat.wait_queue', () => {
        });

        describe('when payload.detail type is chat.request.rating', () => {
        });

        describe('when payload.detail type is chat.msg', () => {
        });

        describe('when payload.detail type is typing', () => {
        });

        describe('when payload.detail type is something else', () => {
          beforeEach(() => {
            action.payload = {
              type: 'chat',
              detail: {
                type: 'something_else'
              }
            };
            state = reducer(initialState, action);
          });

          it('returns the state unchanged', () => {
            expect(state)
              .toEqual(initialState);
          });
        });
      });

      describe('when payload type is something else', () => {
        beforeEach(() => {
          action.payload = { type: 'something_else' };
          state = reducer(initialState, action);
        });

        it('returns the state unchanged', () => {
          expect(state)
            .toEqual(initialState);
        });
      });
    });
  });
});
