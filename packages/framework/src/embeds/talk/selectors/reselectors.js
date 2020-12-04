import { createSelector } from 'reselect'

import { getEmbeddableConfig } from 'src/redux/modules/talk/talk-selectors'

export const getPhoneNumber = createSelector(
  getEmbeddableConfig,
  config => config.phoneNumber
)
