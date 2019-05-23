beforeEach(() => {
  jest.resetModules();
});

describe('chat connected', () => {
  describe('chat connected already', () => {
    it('executes the callback immediately', () => {
      const callbacks = require('../callbacks');
      const callbackSpy = jest.fn();

      callbacks.handleChatConnected(); 

      expect(callbackSpy).not.toHaveBeenCalled();
      callbacks.onChatConnected(callbackSpy);
      expect(callbackSpy).toHaveBeenCalled();
    });
  });
  
  describe('chat not connected yet', () => {
    it('does not execute callback immediately', () => {
      const callbacks = require('../callbacks');
      const callbackSpy = jest.fn();

      callbacks.onChatConnected(callbackSpy);
      expect(callbackSpy).not.toHaveBeenCalled();
    });
  });

  describe('chat just connected', () => {
    it('executes stored callbacks', () => {
      const callbacks = require('../callbacks');
      const callbacksSpy = [jest.fn(), jest.fn()];

      callbacksSpy.forEach(callbackSpy => {
        callbacks.onChatConnected(callbackSpy);
      });

      callbacksSpy.forEach(callbackSpy => {
        expect(callbackSpy)
          .not
          .toHaveBeenCalled();
      });

      callbacks.handleChatConnected();

      callbacksSpy.forEach(callbackSpy => {
        expect(callbackSpy)
          .toHaveBeenCalled();
      });
    });
  });
});

describe('chat sdk initialized', () => {
  describe('chat initialized already', () => {
    it('execute the callback immediately', () => {
      const callbacks = require('../callbacks');
      const callbackSpy = jest.fn();

      callbacks.handleChatSDKInitialized(); 

      expect(callbackSpy).not.toHaveBeenCalled();
      callbacks.onChatSDKInitialized(callbackSpy);
      expect(callbackSpy).toHaveBeenCalled();
    });
  });
  
  describe('chat not initialized yet', () => {
    it('does not execute callback immediately', () => {
      const callbacks = require('../callbacks');
      const callbackSpy = jest.fn();

      callbacks.onChatSDKInitialized(callbackSpy);
      expect(callbackSpy).not.toHaveBeenCalled();
    });
  });

  describe('chat just initialized', () => {
    it('execute stored callbacks', () => {
      const callbacks = require('../callbacks');
      const callbacksSpy = [jest.fn(), jest.fn()];

      callbacksSpy.forEach(callbackSpy => {
        callbacks.onChatSDKInitialized(callbackSpy);
      });

      callbacksSpy.forEach(callbackSpy => {
        expect(callbackSpy)
          .not
          .toHaveBeenCalled();
      });

      callbacks.handleChatSDKInitialized();

      callbacksSpy.forEach(callbackSpy => {
        expect(callbackSpy)
          .toHaveBeenCalled();
      });
    });
  });
});