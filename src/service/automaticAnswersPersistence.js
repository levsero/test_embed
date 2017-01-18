import { store } from 'service/persistence';
import { getURLParameterByName } from 'utility/pages';

const automaticAnswersLocalStorageKey = 'automaticAnswers';
const automaticAnswersJwtUrlParameter = 'auth_token';

function setLocalStorage(authToken) {
  const currentTime = Date.now();
  const oneDayInMs = 86400000;

  store.set(
      automaticAnswersLocalStorageKey,
      { authToken: authToken, expiry: currentTime + oneDayInMs }
  );
}

function getFromLocalStorage() {
  return store.get(automaticAnswersLocalStorageKey);
}

function authTokenFromStore() {
  const automaticAnswersConfig = getFromLocalStorage();

  if (!automaticAnswersConfig) return null;
  if (Date.now() > automaticAnswersConfig.expiry) {
    store.remove(automaticAnswersLocalStorageKey);
    return null;
  }

  return automaticAnswersConfig.authToken;
}

function getContext() {
  const authTokenFromUrl = getURLParameterByName(automaticAnswersJwtUrlParameter);

  if (authTokenFromUrl) {
    setLocalStorage(authTokenFromUrl);
    return authTokenFromUrl;
  } else {
    return authTokenFromStore();
  }
}

export const automaticAnswersPersistence = {
  getContext
};
