import { getSettingsChatSuppress } from 'src/redux/modules/settings/selectors';
import { getZopimChatOnline } from 'src/redux/modules/zopimChat/selectors';

export const getZopimChatEmbed = (state) => !!state.base.embeds.zopimChat;
export const getHelpCenterEmbed = (state) => !!state.base.embeds.helpCenterForm;
export const getTalkEmbed = (state) => !!state.base.embeds.talk;
export const getZopimChatAvailable = (state) => {
  return getZopimChatEmbed(state) && !getSettingsChatSuppress(state) && getZopimChatOnline(state);
};
