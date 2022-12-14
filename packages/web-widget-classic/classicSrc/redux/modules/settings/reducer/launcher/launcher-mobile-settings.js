import { UPDATE_SETTINGS } from 'classicSrc/redux/modules/settings/settings-action-types'
import _ from 'lodash'

const initialState = {
  labelVisible: false,
}

const mobileSettings = (state = initialState, action) => {
  const { type, payload } = action

  switch (type) {
    case UPDATE_SETTINGS:
      return {
        labelVisible: _.get(payload, 'webWidget.launcher.mobile.labelVisible', state.labelVisible),
      }
    default:
      return state
  }
}

export default mobileSettings
