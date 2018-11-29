import { AGENT_BOT } from 'constants/chat';
import { win, getZendeskHost } from 'utility/globals';

function isAgent(nick) {
  return nick.indexOf('agent:') > -1 && nick !== AGENT_BOT;
}

function isDefaultNickname(name) {
  const nameRegex = new RegExp(/^Visitor [0-9]{3,}$/);

  return nameRegex.test(name);
}

function createChatPopoutWindow(chatPopoutSettings) {
  const hostName = win.location.hostname;
  let url;

  if (__DEV__) {
    url = 'src/asset/templates/liveChat.html';
  } else if (hostName.indexOf('-staging.') !== -1) {
    url = 'https://static-staging.zdassets.com/web_widget/latest/liveChat.html';
  } else {
    url ='https://static.zdassets.com/web_widget/latest/liveChat.html';
  }

  url += generateQueryString(chatPopoutSettings);

  win.open(url, 'Web Widget LiveChat', 'height=500,width=342');
}

function generateQueryString(chatPopoutSettings) {
  const subdomain = getZendeskHost(document);
  const settings = win.btoa(JSON.stringify(chatPopoutSettings));

  return `?key=${subdomain}&settings=${settings}`;
}

export {
  isDefaultNickname,
  isAgent,
  createChatPopoutWindow
};
