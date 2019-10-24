import { createSelector } from 'reselect'

import { getEmbeddableConfig, getLibPhoneNumberVendor } from 'src/redux/modules/talk/talk-selectors'

export const getPhoneNumber = createSelector(
  getEmbeddableConfig,
  config => config.phoneNumber
)

export const getFormattedPhoneNumber = createSelector(
  [getPhoneNumber, getLibPhoneNumberVendor],
  (phoneNumber, phoneNumberUtils) => {
    try {
      return phoneNumberUtils.format(phoneNumberUtils.parse(phoneNumber), 'International')
    } catch {
      return null
    }
  }
)
