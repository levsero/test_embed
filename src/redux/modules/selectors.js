import { getChatOnline as getNewChatOnline } from './chat/chat-selectors';
import { getZopimChatOnline } from './zopimChat/zopimChat-selectors';
import { getSettingsChatSuppress } from './settings/settings-selectors';
import { getEmbeddableConfigEnabled, getAgentAvailability } from './talk/talk-selectors';
import { getHelpCenterEmbed,
         getSubmitTicketEmbed,
         getZopimChatEmbed,
         getTalkEmbed,
         getChatEmbed as getNewChatEmbed } from './base/base-selectors';

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
export const getTalkEnabled = (state) => getTalkEmbed(state) && getEmbeddableConfigEnabled(state);
export const getTalkAvailable = (state) => getTalkEnabled(state) && getAgentAvailability(state);
