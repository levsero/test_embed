import asyncTimeout from 'async/timeout';
import { zChatWithTimeout, canBeIgnored } from '../zChatWithTimeout';

jest.mock('async/timeout');

describe('zChatWithTimeout', () => {
  const timeout = 1000;
  const zChat = {
    sendMsg: jest.fn()
  };
  const getState = () => ({
    chat: {
      vendor: {
        zChat
      }
    }
  });

  beforeEach(() => {
    zChatWithTimeout(getState, 'sendMsg', timeout);
  });

  it('calls asyncTimeout', () => {
    expect(asyncTimeout).toHaveBeenCalledWith(zChat.sendMsg, timeout);
  });
});

describe('canBeIgnored', () => {
  test.each([
    [{ code: 'ETIMEDOUT' },  true],
    [{ code: 'DERP' },      false],
    [{ some: 'error' },     false],
    [undefined,              true],
    [null,                   true]
  ])('when the input is %p, it returns %p',
    (input, result) => {
      expect(canBeIgnored(input)).toEqual(result);
    }
  );
});
