import { AGENT_BOT } from 'constants/chat';

function isAgent(nick) {
  return nick.indexOf('agent:') > -1 && nick !== AGENT_BOT;
}

function chatNameDefault(name) {
  const nameRegex = new RegExp(/^Visitor [0-9]{3,}$/);

  return nameRegex.test(name);
}

export {
  chatNameDefault,
  isAgent
};
