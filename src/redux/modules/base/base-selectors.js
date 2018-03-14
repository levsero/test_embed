export const getSubmitTicketEmbed = (state) => !!state.base.embeds.ticketSubmissionForm;
export const getZopimChatEmbed = (state) => !!state.base.embeds.zopimChat;
export const getChatEmbed = (state) => !!state.base.embeds.chat;
export const getHelpCenterEmbed = (state) => !!state.base.embeds.helpCenterForm;
export const getTalkEmbed = (state) => !!state.base.embeds.talk;
export const getActiveEmbed = (state) => state.base.activeEmbed;
export const getAuthenticated = (state) => state.base.authenticated;
export const getWidgetShown = (state) => state.base.widgetShown;

export const getChatStandalone = (state) => {
  const otherProducts = getSubmitTicketEmbed(state) ||
                        getHelpCenterEmbed(state) ||
                        getTalkEmbed(state);

  return getChatEmbed(state) && !otherProducts;
};
