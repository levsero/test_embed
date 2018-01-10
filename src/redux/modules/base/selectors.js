import { getSettingsChatSuppress } from 'src/redux/modules/settings/selectors';
import { getZopimChatOnline } from 'src/redux/modules/zopimChat/selectors';

const getSubmitTicketEmbed = (state) => !!state.base.embeds.ticketSubmissionForm;

export const getZopimChatEmbed = (state) => !!state.base.embeds.zopimChat;
export const getHelpCenterEmbed = (state) => !!state.base.embeds.helpCenterForm;
export const getTalkEmbed = (state) => !!state.base.embeds.talk;
export const getZopimChatAvailable = (state) => {
  return getZopimChatEmbed(state) && !getSettingsChatSuppress(state) && getZopimChatOnline(state);
};
export const getShowTalkBackButton = (state) => {
  return getHelpCenterEmbed(state) || getZopimChatOnline(state) || getSubmitTicketEmbed(state);
};
export const getActiveEmbed = (state) => state.base.activeEmbed;
