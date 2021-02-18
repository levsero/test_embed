import { choosePreview } from 'src/redux/modules/preview/preview-actions'

import { CHAT } from 'src/constants/preview'
import { PREVIEW_CHOICE_SELECTED } from 'src/redux/modules/preview/preview-action-types'

describe('choosePreview', () => {
  it('returns PREVIEW_CHOICE_SELECTED action', () => {
    expect(choosePreview(CHAT)).toEqual({
      type: PREVIEW_CHOICE_SELECTED,
      payload: CHAT,
    })
  })
})
