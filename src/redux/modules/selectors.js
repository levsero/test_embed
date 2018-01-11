import { getChatOnline as getNewChatOnline } from './chat/selectors';
import { getZopimChatOnline } from './zopimChat/selectors';
import { getSettingsChatSuppress } from './settings/selectors';
import { getHelpCenterEmbed,
         getSubmitTicketEmbed,
         getZopimChatEmbed,
         getChatEmbed as getNewChatEmbed } from './base/selectors';

/*
 * Terms:
 * Available: When an embed is part of config, not suppressed and has all the conditions to be used.
 * Enabled: When an embed is part of config, not suppressed but does not have all the conditions to be used
 */

const getChatEmbed = (state) => getNewChatEmbed(state) || getZopimChatEmbed(state);

export const getChatOnline = (state) => getZopimChatOnline(state) || getNewChatOnline(state);
export const getChatEnabled = (state) => getChatEmbed(state) && !getSettingsChatSuppress(state);
export const getChatAvailable = (state) => getChatEnabled(state) && getChatOnline(state);
export const getShowTalkBackButton = (state) => {
  return getHelpCenterEmbed(state) || getChatAvailable(state) || getSubmitTicketEmbed(state);
};
