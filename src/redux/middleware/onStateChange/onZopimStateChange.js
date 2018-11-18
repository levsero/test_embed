import { getZopimChatStatus } from 'src/redux/modules/zopimChat/zopimChat-selectors';
import { zopimChatGoneOffline } from 'src/redux/modules/zopimChat';
import { getResetToContactFormOnChatOffline } from 'src/redux/modules/selectors';
import { mediator } from 'service/mediator';

export function onZopimChatStateChange(prevState, nextState, dispatch) {
  let oldAccountStatus = getZopimChatStatus(prevState),
    nextAccountStatus = getZopimChatStatus(nextState),
    shouldReset = getResetToContactFormOnChatOffline(nextState);

  if (oldAccountStatus !== nextAccountStatus && shouldReset ) {
    mediator.channel.broadcast('zopimChat.hide');
    dispatch(zopimChatGoneOffline());
  }
}
