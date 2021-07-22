import getPreviewState from 'src/fixtures/preview-selectors-test-state'
import { getIsChatPreviewEnabled } from '../preview-selectors'

describe('getIsChatPreviewEnabled', () => {
  describe('when preview enabled and preview choice is CHAT', () => {
    it('returns true', () => {
      expect(getIsChatPreviewEnabled(getPreviewState())).toEqual(true)
    })
  })

  describe('when preview not enabled', () => {
    it('returns false', () => {
      expect(getIsChatPreviewEnabled(getPreviewState({ preview: { enabled: false } }))).toEqual(
        false
      )
    })
  })

  describe('when preview not enabled', () => {
    it('returns false', () => {
      expect(getIsChatPreviewEnabled(getPreviewState({ preview: { enabled: false } }))).toEqual(
        false
      )
    })
  })

  describe('when preview is not CHAT', () => {
    it('returns false', () => {
      expect(getIsChatPreviewEnabled(getPreviewState({ preview: { choice: 'yolo' } }))).toEqual(
        false
      )
    })
  })
})
