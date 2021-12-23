import { CHAT } from 'classicSrc/constants/preview'
import { PREVIEW_CHOICE_SELECTED } from 'classicSrc/redux/modules/preview/preview-action-types'
import { choosePreview } from 'classicSrc/redux/modules/preview/preview-actions'

describe('choosePreview', () => {
  it('returns PREVIEW_CHOICE_SELECTED action', () => {
    expect(choosePreview(CHAT)).toEqual({
      type: PREVIEW_CHOICE_SELECTED,
      payload: CHAT,
    })
  })
})
