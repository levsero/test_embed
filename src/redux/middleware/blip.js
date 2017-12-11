import { TALK_CALLBACK_SUCCESS } from 'src/redux/modules/talk/talk-action-types';
import { UPDATE_ACTIVE_EMBED } from 'src/redux/modules/base/base-action-types';
import { beacon } from 'service/beacon';
import { getEmbeddableConfig,
         getAgentAvailability,
         getFormState,
         getAverageWaitTime } from 'src/redux/modules/talk/talk-selectors';
import { i18n } from 'service/i18n';

const createTalkBlipData = (state, phone) => {
  const { keywords, groupName, supportedCountries } = getEmbeddableConfig(state);

  return {
    supportedCountries: supportedCountries,
    groupName: groupName,
    keywords: keywords,
    phoneNumber: phone,
    averageWaitTime: getAverageWaitTime(state),
    agentAvailability: getAgentAvailability(state),
    locale: i18n.getLocale()
  };
};

const sendTalkCallbackRequestBlip = (state) => {
  const { phone, name, email, description } = getFormState(state);
  let value = createTalkBlipData(state, phone);

  value.user = {
    description: description,
    name: name,
    email: email
  };
  beacon.trackUserAction('talk', 'request', 'callbackForm', value);
};

const sendTalkOpenedBlip = (state) => {
  const value = createTalkBlipData(state, getEmbeddableConfig(state).phoneNumber);

  beacon.trackUserAction('talk', 'opened', 'phoneNumber', value);
};

export function sendBlips({ getState }) {
  return (next) => (action) => {
    const { type, payload } = action;
    const prevState = getState();

    switch (type) {
      case TALK_CALLBACK_SUCCESS:
        sendTalkCallbackRequestBlip(prevState);
        break;
      case UPDATE_ACTIVE_EMBED:
        if (payload === 'talk') {
          sendTalkOpenedBlip(prevState);
        }
        break;
    }
    return next(action);
  };
}
