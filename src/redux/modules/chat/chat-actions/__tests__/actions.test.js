import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';

import * as timeout from 'src/redux/modules/chat/helpers/zChatWithTimeout';
import * as actions from '../actions';
import * as actionTypes from 'src/redux/modules/chat/chat-action-types';
import * as reselectors from 'src/redux/modules/chat/chat-selectors/reselectors';
import * as selectors from 'src/redux/modules/chat/chat-selectors/selectors';
import * as callbacks from 'service/api/callbacks';
import {
  CHAT_CONNECTED_EVENT,
  CHAT_STARTED_EVENT,
  CHAT_ENDED_EVENT,
  CHAT_UNREAD_MESSAGES_EVENT
} from 'constants/event';

const timeoutError = { code: 'ETIMEDOUT' };
const otherError = { code: 'DERP DERP', message: 'I gone derped up' };
const mockStore = configureMockStore([thunk]);
const invoker = jest.fn();
const mockTimeout = jest.fn(() => invoker);
const sendFile = jest.fn();
const stateWithZChat = {
  chat: {
    vendor: {
      zChat: {
        sendFile
      }
    }
  }
};

timeout.zChatWithTimeout = jest.fn(() => mockTimeout());

const dispatchZChatWithTimeoutAction = (action, ...callbackArgs) => {
  const store = mockStore(stateWithZChat);

  store.dispatch(action);
  const timeoutArgs = invoker.mock.calls[0];
  const callback = timeoutArgs[timeoutArgs.length - 1];

  callback(...callbackArgs);

  return {
    store,
    timeoutArgs,
    callback
  };
};

const dispatchAction = (action) => {
  const store = mockStore(stateWithZChat);

  store.dispatch(action);

  return store.getActions()[0];
};

describe('endChat', () => {
  const payload = { agent: 'smith' };

  beforeEach(() => {
    jest.spyOn(reselectors, 'getActiveAgents').mockReturnValue(payload);
  });

  const verifyCallbackCalled = () => {
    it('calls the callback', () => {
      const callback = jest.fn();

      dispatchZChatWithTimeoutAction(
        actions.endChat(callback)
      );

      expect(callback).toHaveBeenCalled();
    });
  };
  const happyPathActions = [
    {
      type: actionTypes.CHAT_ALL_AGENTS_INACTIVE,
      payload
    },
    {
      type: actionTypes.END_CHAT_REQUEST_SUCCESS
    }
  ];

  describe('when there are no errors', () => {
    it('dispatches CHAT_ALL_AGENTS_INACTIVE and END_CHAT_REQUEST_SUCCESS', () => {
      jest.spyOn(callbacks, 'fireEventsFor');
      const { store } = dispatchZChatWithTimeoutAction(
        actions.endChat()
      );

      expect(store.getActions()).toEqual(happyPathActions);
      expect(callbacks.fireEventsFor)
        .toHaveBeenCalledWith(CHAT_ENDED_EVENT);
    });

    verifyCallbackCalled();
  });

  describe('when there is an error', () => {
    describe("when it's a timeout error", () => {
      it('dispatches CHAT_ALL_AGENTS_INACTIVE and END_CHAT_REQUEST_SUCCESS', () => {
        jest.spyOn(callbacks, 'fireEventsFor');
        const { store } = dispatchZChatWithTimeoutAction(
          actions.endChat(),
          timeoutError
        );

        expect(store.getActions()).toEqual(happyPathActions);
        expect(callbacks.fireEventsFor)
          .toHaveBeenCalledWith(CHAT_ENDED_EVENT);
      });

      verifyCallbackCalled();
    });

    describe('when it is not a timeout error', () => {
      it('dispatches END_CHAT_REQUEST_FAILURE', () => {
        const { store } = dispatchZChatWithTimeoutAction(
          actions.endChat(),
          otherError
        );

        expect(store.getActions()).toEqual([
          { type: actionTypes.END_CHAT_REQUEST_FAILURE }
        ]);
      });

      verifyCallbackCalled();
    });
  });
});

describe('setVisitorInfo', () => {
  const mockVisitor = { name: 'Belgarion', email: 'garion@riva.com' };
  const mockTimestamp = 1234;
  const mockRequestSuccessAction = {
    type: actionTypes.SET_VISITOR_INFO_REQUEST_SUCCESS,
    payload: { ...mockVisitor, timestamp: mockTimestamp }
  };

  describe('if authenticated', () => {
    beforeEach(() => {
      jest.spyOn(selectors, 'getIsAuthenticated').mockReturnValue(true);
    });

    it('does not dispatch any actions', () => {
      const store = mockStore(stateWithZChat);

      store.dispatch(actions.setVisitorInfo(
        mockVisitor,
        { type: 'w00t' },
        mockTimestamp
      ));

      expect(store.getActions()).toEqual([]);
    });
  });

  describe('if not authenticated', () => {
    beforeEach(() => {
      jest.spyOn(selectors, 'getIsAuthenticated').mockReturnValue(false);
    });

    it('dispatches SET_VISITOR_INFO_REQUEST_PENDING', () => {
      const store = mockStore(stateWithZChat);

      store.dispatch(actions.setVisitorInfo(mockVisitor, {}, 1234));
      expect(store.getActions()).toEqual([
        {
          type: actionTypes.SET_VISITOR_INFO_REQUEST_PENDING,
          payload: { ...mockVisitor, timestamp: mockTimestamp }
        }
      ]);
    });

    it('passes in the visitor as an argument', () => {
      const { timeoutArgs } = dispatchZChatWithTimeoutAction(
        actions.setVisitorInfo(mockVisitor, null, mockTimestamp)
      );

      expect(timeoutArgs[0]).toEqual(mockVisitor);
    });

    describe('when there are errors', () => {
      describe("when it's a timeout error", () => {
        it('dispatches SET_VISITOR_INFO_REQUEST_SUCCESS', () => {
          const { store } = dispatchZChatWithTimeoutAction(
            actions.setVisitorInfo(mockVisitor, null, mockTimestamp),
            timeoutError
          );

          expect(store.getActions()).toContainEqual(mockRequestSuccessAction);
        });
      });

      describe("when it's any other error", () => {
        it('dispatches SET_VISITOR_INFO_REQUEST_FAILURE', () => {
          const { store } = dispatchZChatWithTimeoutAction(
            actions.setVisitorInfo(mockVisitor, null, mockTimestamp),
            otherError
          );

          expect(store.getActions()).toContainEqual({
            type: actionTypes.SET_VISITOR_INFO_REQUEST_FAILURE
          });
        });
      });
    });

    describe('when there are no errors', () => {
      it('dispatches SET_VISITOR_INFO_REQUEST_SUCCESS', () => {
        const { store } = dispatchZChatWithTimeoutAction(
          actions.setVisitorInfo(mockVisitor, null, mockTimestamp)
        );

        expect(store.getActions()).toContainEqual(mockRequestSuccessAction);
      });

      describe('when an on-success action "callback" is passed', () => {
        it('dispatches the on-success action', () => {
          const { store } = dispatchZChatWithTimeoutAction(
            actions.setVisitorInfo(mockVisitor, { type: 'COOL_ACTION' }, mockTimestamp)
          );

          expect(store.getActions()).toContainEqual({ type: 'COOL_ACTION' });
        });
      });
    });
  });
});

describe('sendEmailTranscript', () => {
  const mockEmail = 'It was the best of times, it was the worst of times.';
  const mockFailureAction = {
    type: actionTypes.EMAIL_TRANSCRIPT_FAILURE,
    payload: mockEmail
  };
  const mockSuccessAction = {
    type: actionTypes.EMAIL_TRANSCRIPT_SUCCESS,
    payload: mockEmail
  };

  it('dispatches a EMAIL_TRANSCRIPT_REQUEST_SENT action', () => {
    const { store } = dispatchZChatWithTimeoutAction(
      actions.sendEmailTranscript(mockEmail)
    );

    expect(store.getActions()).toContainEqual({
      type: actionTypes.EMAIL_TRANSCRIPT_REQUEST_SENT,
      payload: mockEmail
    });
  });

  describe('when there are no errors', () => {
    it('passes the email as an argument to the callback', () => {
      const { timeoutArgs } = dispatchZChatWithTimeoutAction(
        actions.sendEmailTranscript(mockEmail)
      );

      expect(timeoutArgs[0]).toEqual(mockEmail);
    });

    it('dispatches EMAIL_TRANSCRIPT_SUCCESS', () => {
      const { store } = dispatchZChatWithTimeoutAction(
        actions.sendEmailTranscript(mockEmail)
      );
      const dispatchedActions = store.getActions();

      expect(dispatchedActions).toContainEqual(mockSuccessAction);
      expect(dispatchedActions).not.toContainEqual(mockFailureAction);
    });
  });

  describe('when there is an error', () => {
    it('dispatches an EMAIL_TRANSCRIPT_FAILURE action', () => {
      const { store } = dispatchZChatWithTimeoutAction(
        actions.sendEmailTranscript(mockEmail),
        timeoutError
      );
      const dispatchedActions = store.getActions();

      expect(dispatchedActions).toContainEqual(mockFailureAction);
      expect(dispatchedActions).not.toContainEqual(mockSuccessAction);
    });
  });
});

describe('sendChatRating', () => {
  const mockRating = 4;
  const mockSuccessAction = {
    type: actionTypes.CHAT_RATING_REQUEST_SUCCESS,
    payload: mockRating
  };

  describe('when there are no errors', () => {
    it('dispatches a CHAT_RATING_REQUEST_SUCCESS action', () => {
      const { store } = dispatchZChatWithTimeoutAction(
        actions.sendChatRating(mockRating)
      );

      expect(store.getActions()).toEqual([mockSuccessAction]);
    });
  });

  describe('when there is an error', () => {
    describe("when it's a timeout error", () => {
      it('dispatches CHAT_RATING_REQUEST_SUCCESS action anyway', () => {
        const { store } = dispatchZChatWithTimeoutAction(
          actions.sendChatRating(mockRating),
          timeoutError
        );

        expect(store.getActions()).toEqual([mockSuccessAction]);
      });
    });

    describe('when it is any other error', () => {
      it('dispatches a CHAT_RATING_REQUEST_FAILURE action', () => {
        const { store } = dispatchZChatWithTimeoutAction(
          actions.sendChatRating(mockRating),
          otherError
        );

        expect(store.getActions()).toEqual([{
          type: actionTypes.CHAT_RATING_REQUEST_FAILURE
        }]);
      });
    });
  });
});

describe('sendChatComment', () => {
  const mockComment = "I'm selling these fine leather jackets...";
  const mockSuccessAction = {
    type: actionTypes.CHAT_RATING_COMMENT_REQUEST_SUCCESS,
    payload: mockComment
  };

  describe('when there are no errors', () => {
    it('dispatches CHAT_RATING_COMMENT_REQUEST_SUCCESS', () => {
      const { store } = dispatchZChatWithTimeoutAction(
        actions.sendChatComment(mockComment)
      );

      expect(store.getActions()).toEqual([mockSuccessAction]);
    });
  });

  describe('when there is an error', () => {
    describe("when it's a timeout error", () => {
      it('dispatches CHAT_RATING_COMMENT_REQUEST_SUCCESS anyway', () => {
        const { store } = dispatchZChatWithTimeoutAction(
          actions.sendChatComment(mockComment),
          timeoutError
        );

        expect(store.getActions()).toEqual([mockSuccessAction]);
      });
    });

    describe("when it's any other error", () => {
      it('dispatches CHAT_RATING_COMMENT_REQUEST_FAILURE', () => {
        const { store } = dispatchZChatWithTimeoutAction(
          actions.sendChatComment(mockComment),
          otherError
        );

        expect(store.getActions()).toEqual([{
          type: actionTypes.CHAT_RATING_COMMENT_REQUEST_FAILURE
        }]);
      });
    });
  });
});

describe('sendAttachments', () => {
  const mockVisitor = {
    name: 'Ronnie James Dio',
    email: 'the_horns@example.com',
    nick: 'theDio',
    display_name: 'Dio'
  };
  const mockBasePayload = {
    type: 'chat.file',
    timestamp: 123456,
    nick: mockVisitor.nick,
    display_name: mockVisitor.display_name
  };
  const mockFileList = [{
    name: 'super-sekret-accountings.xls',
    size: 666,
  }];
  const mockData = { url: 'dio.example.com' };

  beforeEach(() => {
    jest.spyOn(selectors, 'getChatVisitor').mockReturnValue(mockVisitor);
    Date.now = jest.fn(() => mockBasePayload.timestamp);
  });

  it('dispatches CHAT_FILE_REQUEST_SENT for each file in the list', () => {
    const store = mockStore(stateWithZChat);

    store.dispatch(actions.sendAttachments(mockFileList));
    expect(store.getActions()).toMatchSnapshot();
  });

  describe('when there are no errors', () => {
    it('dispatches CHAT_FILE_REQUEST_SUCCESS for each file in the list', () => {
      const store = mockStore(stateWithZChat);

      store.dispatch(actions.sendAttachments(mockFileList));

      const call = sendFile.mock.calls[0];
      const callback = call[1];

      callback(null, mockData);
      expect(store.getActions()).toMatchSnapshot();
    });
  });

  describe('when there is an error', () => {
    it('dispatches CHAT_FILE_REQUEST_FAILURE for each file in the list', () => {
      const store = mockStore(stateWithZChat);

      store.dispatch(actions.sendAttachments(mockFileList));

      const call = sendFile.mock.calls[0];
      const callback = call[1];

      callback(new Error('some error'), mockData);
      expect(store.getActions()).toMatchSnapshot();
    });
  });
});

describe('setDepartment', () => {
  const mockDeptId = 1;
  const mockSuccessCallback = jest.fn();
  const mockErrCallback = jest.fn();

  it('dispatches VISITOR_DEFAULT_DEPARTMENT_SELECTED', () => {
    const { store } = dispatchZChatWithTimeoutAction(
      actions.setDepartment(mockDeptId, mockSuccessCallback, mockErrCallback)
    );

    expect(store.getActions()).toEqual([{
      type: actionTypes.VISITOR_DEFAULT_DEPARTMENT_SELECTED,
      payload: {
        department: mockDeptId
      }
    }]);
  });

  describe('when there are no errors', () => {
    it('calls the success callback', () => {
      dispatchZChatWithTimeoutAction(
        actions.setDepartment(mockDeptId, mockSuccessCallback, mockErrCallback)
      );

      expect(mockSuccessCallback).toHaveBeenCalled();
      expect(mockErrCallback).not.toHaveBeenCalled();
    });
  });

  describe('when there is an error', () => {
    it('calls the error callback', () => {
      dispatchZChatWithTimeoutAction(
        actions.setDepartment(mockDeptId, mockSuccessCallback, mockErrCallback),
        timeoutError
      );

      expect(mockSuccessCallback).not.toHaveBeenCalled();
      expect(mockErrCallback).toHaveBeenCalledWith(timeoutError);
    });
  });
});

describe('clearDepartment', () => {
  const verifyCallbackCalled = () => {
    it('executes the success callback', () => {
      const mockSuccessCallback = jest.fn();

      dispatchZChatWithTimeoutAction(
        actions.clearDepartment(mockSuccessCallback)
      );

      expect(mockSuccessCallback).toHaveBeenCalled();
    });
  };

  describe('when there is an error', () => {
    verifyCallbackCalled();
  });

  describe('when there are no errors', () => {
    verifyCallbackCalled();
  });
});

describe('sendOfflineMessage', () => {
  const mockPhone = 123456;
  const mockFormState = {
    name: 'Charles Darwin',
    phone: mockPhone
  };
  const mockSuccessCallback = jest.fn();
  const mockFailureCallback = jest.fn();

  it('dispatches OFFLINE_FORM_REQUEST_SENT', () => {
    const { store } = dispatchZChatWithTimeoutAction(
      actions.sendOfflineMessage(mockFormState, mockSuccessCallback, mockFailureCallback)
    );

    expect(store.getActions()).toContainEqual(
      { type: actionTypes.OFFLINE_FORM_REQUEST_SENT }
    );
  });

  describe('when there are no errors', () => {
    it('dispatches OFFLINE_FORM_REQUEST_SUCCESS', () => {
      const { store } = dispatchZChatWithTimeoutAction(
        actions.sendOfflineMessage(mockFormState, mockSuccessCallback, mockFailureCallback)
      );

      expect(store.getActions()).toContainEqual({
        type: actionTypes.OFFLINE_FORM_REQUEST_SUCCESS,
        payload: mockFormState
      });
    });

    it('calls the success callback', () => {
      dispatchZChatWithTimeoutAction(
        actions.sendOfflineMessage(mockFormState, mockSuccessCallback, mockFailureCallback)
      );

      expect(mockSuccessCallback).toHaveBeenCalled();
    });
  });

  describe('when there is an error', () => {
    it('dispatches OFFLINE_FORM_REQUEST_FAILURE', () => {
      const { store } = dispatchZChatWithTimeoutAction(
        actions.sendOfflineMessage(mockFormState, mockSuccessCallback, mockFailureCallback),
        timeoutError
      );

      expect(store.getActions()).toContainEqual(
        { type: actionTypes.OFFLINE_FORM_REQUEST_FAILURE }
      );
    });

    it('executes the failure callback', () => {
      dispatchZChatWithTimeoutAction(
        actions.sendOfflineMessage(mockFormState, mockSuccessCallback, mockFailureCallback),
        timeoutError
      );

      expect(mockFailureCallback).toHaveBeenCalled();
    });
  });

  describe('the formState object', () => {
    describe('when the formState contains a phone number', () => {
      it('leaves it in the object and passes it to the callback', () => {
        const { timeoutArgs } = dispatchZChatWithTimeoutAction(
          actions.sendOfflineMessage(mockFormState, mockSuccessCallback, mockFailureCallback)
        );

        expect(timeoutArgs[0]).toEqual(mockFormState);
        expect(timeoutArgs[0].phone).toEqual(mockPhone);
      });
    });

    describe('when the formState contains no phone number', () => {
      it('deletes the key from the state object before passing it to the callback', () => {
        mockFormState.phone = null;
        const { timeoutArgs } = dispatchZChatWithTimeoutAction(
          actions.sendOfflineMessage(mockFormState, mockSuccessCallback, mockFailureCallback)
        );

        expect(timeoutArgs[0].phone).toBeUndefined();
      });
    });
  });
});

describe('fetchConversationHistory', () => {
  const mockHistory = [];
  const mockData = {
    history: mockHistory
  };

  it('dispatches HISTORY_REQUEST_SENT', () => {
    const { store } = dispatchZChatWithTimeoutAction(
      actions.fetchConversationHistory(),
      null,
      mockData
    );

    expect(store.getActions()).toContainEqual({
      type: actionTypes.HISTORY_REQUEST_SENT
    });
  });

  describe('when there are no errors', () => {
    it('dispatches HISTORY_REQUEST_SUCCESS', () => {
      const { store } = dispatchZChatWithTimeoutAction(
        actions.fetchConversationHistory(),
        null,
        mockData
      );

      expect(store.getActions()).toContainEqual({
        type: actionTypes.HISTORY_REQUEST_SUCCESS,
        payload: { ...mockData }
      });
    });
  });

  describe('when there is an error', () => {
    describe("when it's a timeout error", () => {
      it('dispatches HISTORY_REQUEST_SUCCESS anyway', () => {
        const { store } = dispatchZChatWithTimeoutAction(
          actions.fetchConversationHistory(),
          timeoutError,
          undefined
        );

        expect(store.getActions()).toContainEqual({
          type: actionTypes.HISTORY_REQUEST_SUCCESS,
          payload: { ...mockData }
        });
      });
    });

    describe("when it's any other error", () => {
      it('dispatches HISTORY_REQUEST_FAILURE', () => {
        const { store } = dispatchZChatWithTimeoutAction(
          actions.fetchConversationHistory(),
          otherError,
          undefined
        );

        expect(store.getActions()).toContainEqual({
          type: actionTypes.HISTORY_REQUEST_FAILURE,
          payload: otherError
        });
      });
    });
  });
});

describe('initiateSocialLogout', () => {
  const successAction = { type: actionTypes.CHAT_SOCIAL_LOGOUT_SUCCESS };
  const failureAction = { type: actionTypes.CHAT_SOCIAL_LOGOUT_FAILURE };

  it('dispatches CHAT_SOCIAL_LOGOUT_PENDING', () => {
    const { store } = dispatchZChatWithTimeoutAction(
      actions.initiateSocialLogout()
    );

    expect(store.getActions()).toContainEqual(
      { type: actionTypes.CHAT_SOCIAL_LOGOUT_PENDING }
    );
  });

  describe('when there are no errors', () => {
    it('dispatches CHAT_SOCIAL_LOGOUT_SUCCESS', () => {
      const { store } = dispatchZChatWithTimeoutAction(
        actions.initiateSocialLogout()
      );
      const dispatchedActions = store.getActions();

      expect(dispatchedActions).toContainEqual(successAction);
      expect(dispatchedActions).not.toContainEqual(failureAction);
    });
  });

  describe('when there is an error', () => {
    const { store } = dispatchZChatWithTimeoutAction(
      actions.initiateSocialLogout(),
      timeoutError
    );

    const dispatchedActions = store.getActions();

    expect(dispatchedActions).toContainEqual(failureAction);
    expect(dispatchedActions).not.toContainEqual(successAction);
  });
});

describe('editContactDetailsSubmitted', () => {
  const mockVisitor = {
    name: 'Boromir',
    email: 'dadsfav@gondor.gd'
  };

  beforeEach(() => {
    Date.now = () => 123456;
  });

  it('dispatches SET_VISITOR_INFO_REQUEST_SUCCESS and CHAT_CONTACT_DETAILS_UPDATE_SUCCESS', () => {
    const { store } = dispatchZChatWithTimeoutAction(
      actions.editContactDetailsSubmitted(mockVisitor)
    );
    const dispatchedActions = store.getActions();

    expect(dispatchedActions).toContainEqual({
      type: actionTypes.CHAT_CONTACT_DETAILS_UPDATE_SUCCESS,
      payload: { ...mockVisitor, timestamp: Date.now() }
    });

    expect(dispatchedActions).toContainEqual({
      type: actionTypes.SET_VISITOR_INFO_REQUEST_SUCCESS,
      payload: { ...mockVisitor, timestamp: Date.now() }
    });
  });
});

describe('openedChatHistory', () => {
  it('dispatches OPENED_CHAT_HISTORY', () => {
    const result = dispatchAction(actions.openedChatHistory());

    expect(result).toEqual({ type: actionTypes.OPENED_CHAT_HISTORY });
  });
});

describe('closedChatHistory', () => {
  it('dispatches CLOSED_CHAT_HISTORY', () => {
    const result = dispatchAction(actions.closedChatHistory());

    expect(result).toEqual({ type: actionTypes.CLOSED_CHAT_HISTORY });
  });
});

test('chatConnected', () => {
  jest.spyOn(callbacks, 'fireEventsFor');
  const result = dispatchAction(actions.chatConnected());

  expect(callbacks.fireEventsFor)
    .toHaveBeenCalledWith(CHAT_CONNECTED_EVENT);
  expect(result)
    .toEqual({ type: actionTypes.CHAT_CONNECTED });
});

test('chatStarted', () => {
  jest.spyOn(callbacks, 'fireEventsFor');
  const result = dispatchAction(actions.chatStarted());

  expect(callbacks.fireEventsFor)
    .toHaveBeenCalledWith(CHAT_STARTED_EVENT);
  expect(result)
    .toEqual({ type: actionTypes.CHAT_STARTED });
});

test('newAgentReceived', () => {
  jest.spyOn(callbacks, 'fireEventsFor');
  const result = dispatchAction(actions.newAgentMessageReceived('yeet'));

  expect(callbacks.fireEventsFor)
    .toHaveBeenCalledWith(CHAT_UNREAD_MESSAGES_EVENT);
  expect(result)
    .toEqual({ type: actionTypes.NEW_AGENT_MESSAGE_RECEIVED, payload: 'yeet' });
});
