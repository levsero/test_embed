import { createSelector } from 'reselect'
import { getIsShowHCIntroState } from '../helpCenter/helpCenter-selectors'
import { isMobileBrowser } from 'utility/devices'
import {
  getActiveEmbed,
  getHelpCenterEmbed,
  getHasPassedAuth
} from 'src/redux/modules/base/base-selectors'
import { getSettingsHelpCenterSuppress } from 'src/redux/modules/settings/settings-selectors'

export const getHelpCenterEnabled = createSelector(
  [getHelpCenterEmbed, getSettingsHelpCenterSuppress],
  (helpCenterEmbed, suppress) => {
    return helpCenterEmbed && !suppress
  }
)

export const getHelpCenterAvailable = createSelector(
  [getHelpCenterEnabled, getHasPassedAuth],
  (helpCenterEnabled, hasPassedAuth) => {
    return helpCenterEnabled && hasPassedAuth
  }
)

export const getCanShowHelpCenterIntroState = createSelector(
  [getIsShowHCIntroState, getHelpCenterAvailable, getActiveEmbed],
  (isShowHCIntroState, isHelpCenterAvailable, activeEmbed) => {
    return (
      !isMobileBrowser() &&
      isShowHCIntroState &&
      isHelpCenterAvailable &&
      activeEmbed === 'helpCenterForm'
    )
  }
)

export const getHelpCenterReady = state => !getHelpCenterEmbed(state) || getHasPassedAuth(state)
