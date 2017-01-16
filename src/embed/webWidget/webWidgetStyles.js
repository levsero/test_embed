import HelpCenterDesktopStyles from 'component/helpCenter/HelpCenterDesktop.sass';
import HelpCenterMobileStyles from 'component/helpCenter/HelpCenterMobile.sass';
import HelpCenterArticleStyles from 'component/helpCenter/HelpCenterArticle.sass';
import HelpCenterResultsStyles from 'component/helpCenter/HelpCenterResults.sass';
import SubmitTicketStyles from 'component/submitTicket/SubmitTicket.sass';
import SubmitTicketFormStyles from 'component/submitTicket/SubmitTicketForm.sass';

import { sharedStyles } from 'embed/sharedStyles.js';

export const webWidgetStyles = `
  ${sharedStyles}
  ${SubmitTicketStyles}
  ${SubmitTicketFormStyles}
  ${HelpCenterDesktopStyles}
  ${HelpCenterMobileStyles}
  ${HelpCenterArticleStyles}
  ${HelpCenterResultsStyles}
`;

