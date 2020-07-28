import { UPDATE_SETTINGS } from 'src/redux/modules/settings/settings-action-types'

const initialState = null

const launcherSettings = (state = initialState, action) => {
  const { type, payload } = action

  switch (type) {
    case UPDATE_SETTINGS:
      return payload?.webWidget?.launcher?.label ?? state
    default:
      return state
  }
}

export default launcherSettings
