import config from '../config'
import { UPDATE_EMBEDDABLE_CONFIG } from 'src/redux/modules/base/base-action-types'
import { testReducer } from 'src/util/testHelpers'

const initialState = {
  position: 'right',
  customFields: {},
  formTitleKey: 'message',
  attachmentsEnabled: false,
  maxFileCount: 5,
  maxFileSize: 5 * 1024 * 1024, // 5 MB
  ticketForms: [],
  color: '#1F73B7'
}
const embeddableConfigPayload = {
  embeds: {
    ticketSubmissionForm: {
      props: {
        color: '#50cd2a',
        attachmentsEnabled: true,
        maxFileSize: 20971520,
        nameFieldEnabled: false,
        webWidgetReactRouterSupport: true
      }
    }
  }
}

testReducer(config, [
  {
    action: { type: undefined },
    expected: initialState
  },
  {
    action: { type: UPDATE_EMBEDDABLE_CONFIG, payload: embeddableConfigPayload },
    expected: {
      ...initialState,
      color: '#50cd2a',
      attachmentsEnabled: true,
      maxFileSize: 20971520,
      nameFieldEnabled: false,
      webWidgetReactRouterSupport: true
    }
  },
  {
    action: { type: UPDATE_EMBEDDABLE_CONFIG, payload: {} },
    expected: initialState
  }
])
