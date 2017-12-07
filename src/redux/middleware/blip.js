import { TALK_CALLBACK_SUCCESS } from 'src/redux/modules/talk/talk-action-types';
import { beacon } from 'service/beacon';
import { getEmbeddableConfig,
         getAgentAvailability,
         getFormState,
         getAverageWaitTime } from 'src/redux/modules/talk/talk-selectors';
import { i18n } from 'service/i18n';

const sendTalkCallbackRequestBlip = (state) => {
  const { phone, name, email, description } = getFormState(state);
  const { keywords, groupName, supportedCountries } = getEmbeddableConfig(state);
  const value = {
    supportedCountries: supportedCountries,
    groupName: groupName,
    keywords: keywords,
    phoneNumber: phone,
    averageWaitTime: getAverageWaitTime(state),
    agentAvailability: getAgentAvailability(state),
    locale: i18n.getLocale(),
    user: {
      name: name,
      email: email,
      description: description
    }
  };

  beacon.trackUserAction('talk', 'request', 'callbackForm', value);
};

export function sendBlips({ getState }) {
  return (next) => (action) => {
    const { type } = action;
    const prevState = getState();

    switch (type) {
      case TALK_CALLBACK_SUCCESS:
        sendTalkCallbackRequestBlip(prevState);
    }
    return next(action);
  };
}

