import _ from 'lodash';

export const getZopimChatStatus = (state) => state.zopimChat.status;
export const getZopimChatOnline = (state) => _.includes(['online', 'away'], getZopimChatStatus(state));
export const getZopimChatConnected = (state) => state.zopimChat.connected;
export const getZopimIsChatting = (state) => state.zopimChat.isChatting;
export const getZopimChatOpen = (state) => state.zopimChat.isOpen;
export const getZopimMessageCount = (state) => state.zopimChat.unreadMessages;
