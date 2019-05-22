
export const hostAllowList = [/^.*(assets|static|static-staging)\.(zd-staging|zendesk|zdassets)\.com.*$/];

if (__DEV__) {
  hostAllowList.push('localhost', '127.0.0.1');
}

export const checkIgnoreFn = () => {
  // throttles error notifications so that only 1 in 1000 errors is sent through to rollbar
  return Math.floor(Math.random() * 1000) !== 0;
};

export const rollbarConfig =  {
  enabled: true,
  accessToken: '94eb0137fdc14471b21b34c5a04f9359',
  captureUncaught: true,
  captureUnhandledRejections: true,
  checkIgnore: checkIgnoreFn,
  endpoint: 'https://rollbar-eu.zendesk.com/api/1/item/',
  hostWhitelist: hostAllowList,
  maxItems: 10,
  payload: {
    environment: __EMBEDDABLE_FRAMEWORK_ENV__,
    client: {
      javascript: {
        code_version: __EMBEDDABLE_VERSION__ // eslint-disable-line camelcase
      }
    }
  }
};
