import { UPDATE_EMBEDDABLE_CONFIG } from 'classicSrc/redux/modules/base/base-action-types'
import { testReducer } from 'classicSrc/util/testHelpers'
import config from '../config'

const initialState = {
  maxFileCount: 5,
  maxFileSize: 52428800,
}
const embeddableConfigPayload = {
  embeds: {
    ticketSubmissionForm: {
      props: {
        color: '#50cd2a',
        attachmentsEnabled: true,
        maxFileSize: 20971520,
        nameFieldEnabled: false,
        webWidgetReactRouterSupport: true,
      },
    },
  },
}

testReducer(config, [
  {
    action: { type: undefined },
    expected: initialState,
  },
  {
    action: { type: UPDATE_EMBEDDABLE_CONFIG, payload: embeddableConfigPayload },
    expected: {
      ...initialState,
      color: '#50cd2a',
      attachmentsEnabled: true,
      maxFileSize: 20971520,
      nameFieldEnabled: false,
      webWidgetReactRouterSupport: true,
    },
  },
  {
    action: { type: UPDATE_EMBEDDABLE_CONFIG, payload: {} },
    expected: initialState,
  },
])
