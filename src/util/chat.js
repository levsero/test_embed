import { AGENT_BOT } from 'constants/chat';
import { win } from 'utility/globals';

function isAgent(nick) {
  return nick.indexOf('agent:') > -1 && nick !== AGENT_BOT;
}

function isDefaultNickname(name) {
  const nameRegex = new RegExp(/^Visitor [0-9]{3,}$/);

  return nameRegex.test(name);
}

function createChatPopoutWindow() {
  let url = 'https://static-staging.zdassets.com/web_widget/latest/popout.html',
    parser = document.createElement('a'),
    myKey;

  parser.href = window.location.search;
  myKey = parser.search;
  url += myKey;
  win.open(url, 'Web Widget Popout', 'height=500,width=342');
}

export {
  isDefaultNickname,
  isAgent,
  createChatPopoutWindow
};
