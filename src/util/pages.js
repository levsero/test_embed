import _ from 'lodash';

import { win, location } from 'utility/globals';

function isOnHelpCenterPage() {
  const hcPattern = /^\/hc\//;

  return _.has(win.HelpCenter, 'account', 'user') &&
         location.pathname &&
         hcPattern.test(location.pathname);
}

function getURLParameterByName(name) {
  const half = location.search.split(`${name}=`)[1];

  return half ? decodeURIComponent(half.split('&')[0]) : null;
}

export {
  isOnHelpCenterPage,
  getURLParameterByName
};
