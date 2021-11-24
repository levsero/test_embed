import { createSelector } from 'reselect'
import { isMobileBrowser, isOnHelpCenterPage } from '@zendesk/widget-shared-services'
import { getIsShowHCIntroState, getHelpCenterSignInRequired } from 'src/embeds/helpCenter/selectors'
import {
  getActiveEmbed,
  getHelpCenterEmbed,
  getBaseIsAuthenticated,
} from 'src/redux/modules/base/base-selectors'
import { getSettingsHelpCenterSuppress } from 'src/redux/modules/settings/settings-selectors'

export const getHelpCenterEnabled = createSelector(
  [getHelpCenterEmbed, getSettingsHelpCenterSuppress],
  (helpCenterEmbed, suppress) => {
    return helpCenterEmbed && !suppress
  }
)

export const getHasPassedAuth = createSelector(
  [getBaseIsAuthenticated, getHelpCenterSignInRequired, isOnHelpCenterPage],
  (isAuthenticated, helpCenterSignInRequired, isOnHelpCenterPage) => {
    return isAuthenticated || !helpCenterSignInRequired || isOnHelpCenterPage
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

export const getHelpCenterReady = (state) => !getHelpCenterEmbed(state) || getHasPassedAuth(state)
