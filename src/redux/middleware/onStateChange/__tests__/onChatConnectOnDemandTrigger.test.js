import onChatConnectOnDemandTrigger  from '../onChatConnectOnDemandTrigger';
import { setUpChat } from 'src/redux/modules/chat';
import { LAUNCHER_CLICKED } from 'src/redux/modules/base/base-action-types';

jest.mock('src/redux/modules/chat');

const getAction = (actionType = LAUNCHER_CLICKED) => {
  return {
    type: actionType
  };
};

const getState = (connectOnDemand = true, chatEnabled = true) => {
  return {
    settings: {
      chat: {
        connectOnDemand
      }
    },
    base: {
      embeds: {
        chat: chatEnabled
      }
    }
  };
};

describe('onChatConnectOnDemandTrigger', () => {
  test('when actions are one of the trigger actions it calls setupChat once', () => {
    onChatConnectOnDemandTrigger(getState(), getAction(), jest.fn());
    onChatConnectOnDemandTrigger(getState(), getAction(), jest.fn());

    expect(setUpChat).toHaveBeenCalledTimes(1);
  });

  test('when action is not one of the trigger actions it does not call setupChat', () => {
    onChatConnectOnDemandTrigger(getState(), getAction('BLAH'), jest.fn());

    expect(setUpChat).not.toHaveBeenCalled();
  });

  test('when connectOnDemand is false it does not call setupChat', () => {
    onChatConnectOnDemandTrigger(getState(false), getAction(), jest.fn());

    expect(setUpChat).not.toHaveBeenCalled();
  });

  test('when chatEnabled is false it does not call setupChat', () => {
    onChatConnectOnDemandTrigger(getState(true, false), getAction(), jest.fn());

    expect(setUpChat).not.toHaveBeenCalled();
  });
});
