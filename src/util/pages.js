import _ from 'lodash';

import { win, location } from 'utility/globals';
import { base64decode } from 'utility/utils';

function isOnHelpCenterPage() {
  const hcPattern = /^\/hc\//;

  return _.has(win.HelpCenter, 'account', 'user') &&
         location.pathname &&
         hcPattern.test(location.pathname);
}

function getHelpCenterArticleId() {
  const articleSegment = location.pathname.split('articles/')[1];

  return parseInt(articleSegment);
}

function isOnHostMappedDomain() {
  return isOnHelpCenterPage() &&
         !_.includes(location.hostname, '.zendesk');
}

function getURLParameterByName(name) {
  const half = location.search.split(`${name}=`)[1];

  return half ? decodeURIComponent(half.split('&')[0]) : null;
}

function getDecodedJWTBody(jwtToken) {
  const jwtBody = jwtToken.split('.')[1];

  if (typeof jwtBody === 'undefined') {
    return null;
  }

  const decodedBody = base64decode(jwtBody);

  return JSON.parse(decodedBody);
}

export {
  isOnHelpCenterPage,
  getHelpCenterArticleId,
  isOnHostMappedDomain,
  getURLParameterByName,
  getDecodedJWTBody
};
