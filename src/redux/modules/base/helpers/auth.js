import { base64decode, sha1 } from 'utility/utils';

import _ from 'lodash';

function isTokenValid(token) {
  if (token && token.expiry) {
    const now = Math.floor(Date.now() / 1000);

    return token.expiry > now;
  }
  return false;
}

const extractTokenId = _.memoize(function(jwt) {
  const jwtBody = jwt.split('.')[1];

  if (typeof jwtBody === 'undefined') {
    return null;
  }

  const decodedBody = base64decode(jwtBody);
  const message = JSON.parse(decodedBody);

  return message.email ? sha1(message.email) : null;
});

function isTokenRenewable(token) {
  if (token && token.expiry) {
    const now = Math.floor(Date.now() / 1000);
    const timeDiff = token.expiry - now;
    const renewTime = 20 * 60; // 20 mins in secs

    return timeDiff > 0 && timeDiff <= renewTime;
  }
  return false;
}

export {
  isTokenValid,
  extractTokenId,
  isTokenRenewable
};
