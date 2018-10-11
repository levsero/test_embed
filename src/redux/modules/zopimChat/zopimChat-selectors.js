import _ from 'lodash';

export const getZopimChatStatus = (state) => state.zopimChat.status;
export const getZopimChatOnline = (state) => _.includes(['online', 'away'], getZopimChatStatus(state));
export const getZopimChatConnected = (state) => state.zopimChat.connected;
