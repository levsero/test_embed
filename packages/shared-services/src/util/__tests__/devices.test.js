import * as devices from '../devices'

const createViewportMetaTag = () => {
  const metaTag = document.createElement('meta')

  metaTag.name = 'viewport'

  return metaTag
}

describe('getMetaTagsByName', () => {
  describe('when there are meta tags on the document', () => {
    beforeEach(() => {
      const metaTag = createViewportMetaTag()

      metaTag.name = 'referrer'
      metaTag.content = 'no-referrer'
      document.head.appendChild(metaTag)
    })

    it('returns an array with all the meta tag elements', () => {
      const expected = { name: 'referrer', content: 'no-referrer' }

      expect(devices.getMetaTagsByName(document, 'referrer')[0]).toEqual(
        expect.objectContaining(expected)
      )
    })
  })

  describe('when there are no meta tags on the document', () => {
    it('returns an empty array', () => {
      expect(devices.getMetaTagsByName(document, 'empty').length).toBe(0)
    })
  })
})
