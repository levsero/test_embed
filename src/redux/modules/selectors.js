import { createSelector } from 'reselect';

import { getShowOfflineChat } from './chat/chat-selectors';
import { getZopimChatOnline } from './zopimChat/zopimChat-selectors';
import { getSettingsChatSuppress } from './settings/settings-selectors';
import { getEmbeddableConfigEnabled, getAgentAvailability } from './talk/talk-selectors';
import { getActiveTicketForm, getTicketForms } from './submitTicket/submitTicket-selectors';
import { getActiveEmbed,
  getHelpCenterEmbed,
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

export const getChatOnline = (state) => getZopimChatOnline(state) || !getShowOfflineChat(state);
export const getChatEnabled = (state) => getChatEmbed(state) && !getSettingsChatSuppress(state);
export const getChatAvailable = (state) => getChatEnabled(state) && getChatOnline(state);
export const getShowTalkBackButton = (state) => {
  return getHelpCenterEmbed(state) || getChatAvailable(state) || getSubmitTicketEmbed(state);
};
export const getTalkEnabled = (state) => getTalkEmbed(state) && getEmbeddableConfigEnabled(state);
export const getTalkAvailable = (state) => getTalkEnabled(state) && getAgentAvailability(state);
export const getShowTicketFormsBackButton = createSelector(
  [getActiveTicketForm, getTicketForms, getActiveEmbed],
  (activeForm, ticketForms, activeEmbed) => {
    return activeForm && ticketForms.length > 1 && activeEmbed === 'ticketSubmissionForm';
  }
);
