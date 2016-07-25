import _ from 'lodash';

import { win, location } from 'utility/globals';

function isOnHelpCenterPage() {
  const hcPattern = /^\/hc\//;

  return _.has(win.HelpCenter, 'account', 'user') &&
         location.pathname &&
         hcPattern.test(location.pathname);
}

export {
  isOnHelpCenterPage
};
