import HelpCenterStyles from 'component/helpCenter/HelpCenter.sass';
import HelpCenterDesktopStyles from 'component/helpCenter/HelpCenterDesktop.sass';
import HelpCenterMobileStyles from 'component/helpCenter/HelpCenterMobile.sass';
import HelpCenterArticleStyles from 'component/helpCenter/HelpCenterArticle.sass';
import HelpCenterResultsStyles from 'component/helpCenter/HelpCenterResults.sass';

import { sharedStyles } from 'embed/sharedStyles';

export const helpCenterStyles = `
  ${sharedStyles}
  ${HelpCenterStyles}
  ${HelpCenterDesktopStyles}
  ${HelpCenterMobileStyles}
  ${HelpCenterArticleStyles}
  ${HelpCenterResultsStyles}
`;

