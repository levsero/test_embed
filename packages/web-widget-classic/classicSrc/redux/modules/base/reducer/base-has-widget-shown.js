import { isPopout } from '@zendesk/widget-shared-services'
import { UPDATE_WIDGET_SHOWN, API_RESET_WIDGET, WIDGET_INITIALISED } from '../base-action-types'

const initialState = false

const hasWidgetShown = (state = initialState, action) => {
  const { type, payload } = action

  switch (type) {
    case UPDATE_WIDGET_SHOWN:
      if (payload) {
        return true
      }
      return state
    case API_RESET_WIDGET:
      return initialState
    case WIDGET_INITIALISED:
      return isPopout()
    default:
      return state
  }
}

export default hasWidgetShown
