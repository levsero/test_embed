import { resetTalkScreen } from 'src/redux/modules/talk';
import { mediator } from 'service/mediator';
import { getActiveEmbed } from 'src/redux/modules/base/base-selectors';
import { UPDATE_ACTIVE_EMBED } from 'src/redux/modules/base/base-action-types';

export default function onChannelChoiceTransition(prevState, nextState, action, dispatch) {
  if (action && action.type === UPDATE_ACTIVE_EMBED) {
    const prevEmbed = getActiveEmbed(prevState);
    const nextEmbed = getActiveEmbed(nextState);

    if (prevEmbed === 'answerBot') {
      switch (nextEmbed) {
        case 'talk':
          dispatch(resetTalkScreen());
          return;
        case 'zopimChat':
          mediator.channel.broadcast('helpCenterForm.onNextClick');
          mediator.channel.broadcast('webWidget.hide');
          return;
      }
    }
  }
}
