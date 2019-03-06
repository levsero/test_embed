import onChatConnectOnDemandTrigger  from '../onChatConnectOnDemandTrigger';
import { renderer } from 'service/renderer';
import { LAUNCHER_CLICKED } from 'src/redux/modules/base/base-action-types';

jest.mock('service/renderer');

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
    onChatConnectOnDemandTrigger(getState(), getAction());
    onChatConnectOnDemandTrigger(getState(), getAction());

    expect(renderer.setupChat).toHaveBeenCalledTimes(1);
  });

  test('when action is not one of the trigger actions it does not call setupChat', () => {
    onChatConnectOnDemandTrigger(getState(), getAction('BLAH'));

    expect(renderer.setupChat).not.toHaveBeenCalled();
  });

  test('when connectOnDemand is false it does not call setupChat', () => {
    onChatConnectOnDemandTrigger(getState(false), getAction());

    expect(renderer.setupChat).not.toHaveBeenCalled();
  });

  test('when chatEnabled is false it does not call setupChat', () => {
    onChatConnectOnDemandTrigger(getState(true, false), getAction());

    expect(renderer.setupChat).not.toHaveBeenCalled();
  });
});
