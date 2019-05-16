import _ from 'lodash';

/* A generic error message that describes when the browser potentially has no idea
   how the script reached the erroneous state. When the error occurs for some
   browsers like Firefox, Rollbar ignores 'ignoredMessages' attribute which
   allows errors like this to bypass the check. To prevent it we need to capture
   it in the 'checkIgnore' attribute. */
const scriptErrorPattern = /^(.)*(Script error).?$/;

export const errorMessageBlacklist = [
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

  /* Empty error key. Means it cannot be troubleshooted and is thus just noise. */
  '"error":{}',

  /* Empty extraArgs key in error message message, cannot be troubleshooted and is thus just noise. */
  '"extraArgs":[{}]',

  /* Happens when a piece of media (video player) loads in the widget and the video
  is deleted before it's been played.  */
  'The element has no supported sources',

  // Double assurance that this error is not reported
  scriptErrorPattern
];

export const hostAllowList = [/^.*(assets|static|static-staging)\.(zd-staging|zendesk|zdassets)\.com.*$/];

if (__DEV__) {
  hostAllowList.push('localhost', '127.0.0.1');
}

export const checkIgnoreFn = (isUncaught, args) => {
  const errorMessage = _.get(args, 0, '');

  return scriptErrorPattern.test(errorMessage);
};

export const rollbarConfig =  {
  enabled: true,
  accessToken: '94eb0137fdc14471b21b34c5a04f9359',
  captureUncaught: true,
  captureUnhandledRejections: true,
  checkIgnore: checkIgnoreFn,
  endpoint: 'https://rollbar-eu.zendesk.com/api/1/item/',
  hostWhitelist: hostAllowList,
  ignoredMessages: errorMessageBlacklist,
  maxItems: 10,
  payload: {
    environment: __EMBEDDABLE_ENV__,
    client: {
      javascript: {
        code_version: __EMBEDDABLE_VERSION__ // eslint-disable-line camelcase
      }
    }
  }
};
