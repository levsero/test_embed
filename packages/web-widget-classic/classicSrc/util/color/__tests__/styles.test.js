import { settings } from 'classicSrc/service/settings'
import _ from 'lodash'
import {
  generateUserWidgetCSS,
  generateUserLauncherCSS,
  generateWebWidgetPreviewCSS,
} from '../styles'

let mockSettingsValue

settings.get = (name) => _.get(mockSettingsValue, name, null)

describe('generateUserWidgetCSS', () => {
  describe('when the color is light', () => {
    let css

    beforeEach(() => {
      css = generateUserWidgetCSS({ base: '#58F9F7' })
    })

    it('calculates the css correctly', () => {
      expect(css).toMatchSnapshot()
    })
  })

  describe('when the color is not light', () => {
    let css

    beforeEach(() => {
      css = generateUserWidgetCSS({ base: '#283646' })
    })

    describe('u-userTextColor', () => {
      it('calculates the css correctly', () => {
        expect(css).toMatchSnapshot()
      })
    })
  })

  describe('when the color is set via embeddable config', () => {
    let css

    beforeEach(() => {
      css = generateUserWidgetCSS({ base: '#283646', color: '#FF9900' })
    })

    it('uses the color passed in from config', () => {
      expect(css).toMatchSnapshot()
    })
  })

  describe('when the color are overidden in settings', () => {
    let colors

    beforeEach(() => {
      colors = generateUserWidgetCSS({
        theme: '#0FF',
        launcher: '#691840',
        launcherText: '#FF4500',
        button: '#0F0',
        resultLists: '#00F',
        header: '#203D9D',
        articleLinks: '#F00',
        base: '#283646',
        color: '#FF9900',
      })
    })

    it('uses the color passed in from config', () => {
      expect(colors).toMatchSnapshot()
    })
  })
})

describe('generateUserLauncherCSS', () => {
  describe('when the color is light', () => {
    let css

    beforeEach(() => {
      css = generateUserLauncherCSS({ base: '#58F9F7' })
    })

    it('is calculated to the same color with a darker text color', () => {
      expect(css).toMatchSnapshot()
    })
  })

  describe('when the color is not light', () => {
    let css

    beforeEach(() => {
      css = generateUserLauncherCSS({ base: '#283646' })
    })

    it('is calculated to the same color with a white highlight', () => {
      expect(css).toMatchSnapshot()
    })
  })

  describe('when the color is set via embeddable config', () => {
    let css

    beforeEach(() => {
      css = generateUserLauncherCSS({ base: '#283646' })
    })

    it('uses the color passed in from config', () => {
      expect(css).toMatchSnapshot()
    })
  })
})

describe('when the color is extremely light (white or almost white)', () => {
  describe('generateUserWidgetCSS', () => {
    let css

    beforeEach(() => {
      css = generateUserWidgetCSS({ base: '#FFFFFF' })
    })

    it('calculates the colours correctly', () => {
      expect(css).toMatchSnapshot()
    })
  })

  describe('generateUserLauncherCSS', () => {
    let css

    beforeEach(() => {
      css = generateUserLauncherCSS({ base: '#FFFFFF' })
    })

    it('calculates the colours correctly', () => {
      expect(css).toMatchSnapshot()
    })
  })
})

describe('generateWebWidgetPreviewCSS', () => {
  let css

  beforeEach(() => {
    css = generateWebWidgetPreviewCSS({ base: '#58F9F7' })
  })

  it('calculates the colours correctly', () => {
    expect(css).toMatchSnapshot()
  })
})
