import rateLimiting from '../';
import * as helpers from '../helpers';
jest.mock('../helpers');

describe('rateLimiting', () => {
  let apiCall, errorCallback;

  beforeEach(() => {
    Date.now = () => 7300000;
    apiCall = jest.fn();
    errorCallback = jest.fn();
  });

  describe('when rate limited', () => {
    beforeEach(() => {
      helpers.isRateLimited.mockReturnValue(true);

      rateLimiting(apiCall, {}, 'queue', errorCallback);
    });

    it('does not make the api call', () => {
      expect(apiCall).not.toHaveBeenCalled();
    });

    it('calls the error callback', () => {
      expect(errorCallback).toHaveBeenCalled();
    });
  });

  describe('when not rate limited', () => {
    beforeEach(() => {
      helpers.isRateLimited.mockReturnValue(false);

      rateLimiting(apiCall, 'payload', 'queue', errorCallback);
    });

    it('makes the api call', () => {
      expect(apiCall).toHaveBeenCalledWith('payload');
    });

    it('does not calls the error callback', () => {
      expect(errorCallback).not.toHaveBeenCalled();
    });
  });
});

