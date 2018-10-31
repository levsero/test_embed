import * as nullChatSDK from '../nullZChat';

/* eslint-disable no-console */
describe('the null object pattern version of zChat', () => {
  beforeEach(() => {
    console.warn = jest.fn();
  });

  const chat = { zChat: nullChatSDK.nullZChat };

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
});
