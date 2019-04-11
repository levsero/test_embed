import { isRateLimited } from './helpers';

export default (apiCall, payload, name, errorCallback) => {
  const timestamp = Date.now();

  if (isRateLimited(name, timestamp)) {
    return errorCallback();
  }

  return apiCall(payload);
};
