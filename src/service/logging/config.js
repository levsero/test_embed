import _ from 'lodash';

import { getEnvironment } from 'utility/utils';

/* A generic error message that describes when the browser potentially has no idea
   how the script reached the erroneous state. When the error occurs for some
   browsers like Firefox, Rollbar ignores 'ignoredMessages' attribute which
   allows errors like this to bypass the check. To prevent it we need to capture
   it in the 'checkIgnore' attribute. */
const scriptErrorPattern = /^(.)*(Script error).?$/;

const errorMessageBlacklist = [
  /* Occurs when a request is made to an endpoint of a domain that is different from the origin
     page which is a breach of Same-Origin policy or it doesn't have the appropriate
     Cross-Origin permission. */
  'Access-Control-Allow-Origin',

  /* Execution of cross-site scripting where we try to access attributes from the hostpage such
     as Window object where the protocol, domain, port may be different from the iframe's
     specifications. */
  /Permission denied to access property "(.)+" on cross-origin object/,

  /* Similar to the above but Microsoft browsers (e.g. IE, Edge) throws a different error message. */
  'The operation is insecure.',
  'Access is denied.',
  'Acceso denegado.',

  /* Occurs when the client exceeds Rollbar's maxItems limit specification for error reporting. */
  'maxItems has been hit, ignoring errors until reset.',

  /* Occurs when a native function in JavaScript is overridden with a wrapped implementation.
     We don't practice this, it seems to be coming from our dependencies like Babel. It only
     occurs on old browser versions such as Firefox v14 - 20. */
  'Illegal operation on WrappedNative prototype object',

  /* Occurs when a HTTP request is made to an endpoint and a response doesn't come back.
     This may be a result of several causes such as network, service lagging, etc. We
     receive a lot of reports from customer's service endpoints that doesn't have anything
     to do with Zendesk. */
  'Failed to fetch',

  /* Occurs when a request sent to the server took longer than the server's maximum wait time.
     Possible reasons include network quality, processing time on the server-side, etc. */
  'timeout of [0-9]+ms exceeded',

  // Double assurance that this error is not reported
  scriptErrorPattern
];

const hostBlackList = [
  /* Blacklists the reporting payload if any of the trace does not match these domains.
     E.g. If it does not contain any one of these
      assets.zd-staging.com
      static.zd-staging.com
      static-staging.zd-staging.com
      assets.zendesk.com
      ...
  */
  /^((?!(.*(assets|static|static-staging)\.(zd-staging|zendesk|zdassets)\.com)).*)$/
];

const checkIgnoreFn = (isUncaught, args) => {
  const errorMessage = _.get(args, 0, '');

  return scriptErrorPattern.test(errorMessage);
};

const rollbarConfig =  {
  accessToken: '94eb0137fdc14471b21b34c5a04f9359',
  captureUncaught: true,
  captureUnhandledRejections: true,
  checkIgnore: checkIgnoreFn,
  endpoint: 'https://rollbar-eu.zendesk.com/api/1/item/',
  hostBlackList: hostBlackList,
  hostWhiteList: ['assets.zd-staging.com', 'assets.zendesk.com'],
  ignoredMessages: errorMessageBlacklist,
  maxItems: 10,
  payload: {
    environment: getEnvironment(),
    client: {
      javascript: {
        code_version: __EMBEDDABLE_VERSION__ // eslint-disable-line camelcase
      }
    }
  }
};

module.exports = {
  rollbarConfig,

  // Exported for testing
  errorMessageBlacklist,
  hostBlackList,
  checkIgnoreFn
};
