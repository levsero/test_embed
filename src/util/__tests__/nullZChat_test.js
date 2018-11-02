import * as nullChatSDK from '../nullZChat';

const chat = { zChat: nullChatSDK.nullZChat };

/* eslint-disable no-console */
describe('the null object pattern version of zChat', () => {
  beforeEach(() => {
    console.warn = jest.fn();
    nullChatSDK.resetShouldWarn();
  });

  test('it returns an object', () => {
    expect(typeof chat.zChat).toEqual('object');
  });

  test('it returns false for any method called on it', () => {
    expect(chat.zChat.aTotallyNotDefinedMethodFTW()).toEqual(false);
  });

  test('it console warns customers it only works with chat EAP', () => {
    chat.zChat.anotherTotallyMadeUpMethod();
    expect(console.warn).toHaveBeenCalledTimes(2);
  });

  describe('when zChat gets called multiple times', () => {
    test('it only warns once (which consists of two warnings)', () => {
      chat.zChat.whoa();
      chat.zChat.doubleWhoa();
      expect(console.warn).toHaveBeenCalledTimes(2);
    });
  });
});
