import { UPDATE_EMBEDDABLE_CONFIG } from 'src/redux/modules/base/base-action-types'
import { testReducer } from 'src/util/testHelpers'
import config from '../chat-config'

const embeddableConfigPayload = {
  embeds: {
    chat: {
      props: {
        forms: {
          offlineEnabled: true,
        },
      },
    },
  },
}

testReducer(config, [
  {
    action: { type: undefined },
    expected: {},
  },
  {
    action: { type: UPDATE_EMBEDDABLE_CONFIG, payload: embeddableConfigPayload },
    expected: {
      forms: {
        offlineEnabled: true,
      },
    },
  },
  {
    action: { type: UPDATE_EMBEDDABLE_CONFIG, payload: {} },
    expected: {},
  },
])
