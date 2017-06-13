import ChannelChoiceStyles from 'component/channelChoice/ChannelChoice.sass';
import ChannelChoiceDesktopStyles from 'component/channelChoice/ChannelChoiceDesktop.sass';
import ChannelChoiceMobileStyles from 'component/channelChoice/ChannelChoicePopupMobile.sass';

import { sharedStyles } from 'embed/sharedStyles';

export const channelChoiceStyles = `
  ${sharedStyles}
  ${ChannelChoiceStyles}
  ${ChannelChoiceDesktopStyles}
  ${ChannelChoiceMobileStyles}
`;

