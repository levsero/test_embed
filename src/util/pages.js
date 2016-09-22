import _ from 'lodash';

import { win, location } from 'utility/globals';

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

export {
  isOnHelpCenterPage,
  getHelpCenterArticleId,
  isOnHostMappedDomain,
  getURLParameterByName
};
