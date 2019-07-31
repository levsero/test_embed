import { createSelector } from 'reselect'

import { getEmbeddableConfig, getLibPhoneNumberVendor } from 'src/redux/modules/talk/talk-selectors'

export const getPhoneNumber = createSelector(
  getEmbeddableConfig,
  config => config.phoneNumber
)

export const getFormattedPhoneNumber = createSelector(
  [getPhoneNumber, getLibPhoneNumberVendor],
  (phoneNumber, phoneNumberUtils) => {
    const parsed = phoneNumberUtils.parse(phoneNumber)

    return phoneNumberUtils.format(parsed, 'International')
  }
)
