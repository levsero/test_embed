import { ColorMixer as colorMixer } from '../mixer'

const baseColor = '#3accf5'
const colorStr = '#FF69B4'

let mixer = new colorMixer(baseColor)

describe('instantiation', () => {
  it('holds a white abstraction in state', () => {
    expect(mixer.white.hex()).toEqual('#FFFFFF')
  })

  it('holds a black abstraction in state', () => {
    expect(mixer.black.hex()).toEqual('#000000')
  })

  it('holds a neutral grey in state', () => {
    expect(mixer.neutralColor.hex()).toEqual('#7C7C7C')
  })

  it('holds the base colour in state', () => {
    expect(mixer.baseColor.hex()).toEqual('#3ACCF5')
  })

  it('holds a buttonColor in state', () => {
    expect(mixer.buttonColor.hex()).toEqual('#3ACCF5')
  })

  it('holds a listColor in state', () => {
    expect(mixer.listColor.hex()).toEqual('#154F60')
  })
})

describe('#getBaseColor', () => {
  it('returns a string representation of the base color', () => {
    expect(mixer.getBaseColor()).toEqual('#3ACCF5')
  })
})

describe('#highlight', () => {
  describe('when the colour is perceptually dark', () => {
    it('intensifies it by lightening it', () => {
      expect(mixer.highlight('#101CE3')).toEqual('#1C28EF')
    })
  })

  describe('when the colour is perceptually light', () => {
    it('intensifies it by darkening it', () => {
      expect(mixer.highlight('#c1fadb')).toEqual('#84F5B7')
    })
  })
})

describe('#alpha', () => {
  it('returns a rgba css-valid string with a certain alpha colour', () => {
    expect(mixer.alpha('#101CE3', 0.2)).toEqual('rgba(16, 28, 227, 0.2)')
  })
})

describe('#getButtonColor', () => {
  describe('when the colour is not extremely light', () => {
    it('returns the same colour as the base', () => {
      expect(mixer.getButtonColor()).toEqual('#3ACCF5')
    })
  })

  describe('when the colour is extremely light or white', () => {
    beforeEach(() => {
      mixer = new colorMixer('#FFFFFF')
    })

    it('returns a neutral grey', () => {
      expect(mixer.getButtonColor()).toEqual('#2F3941')
    })
  })
})

describe('#getListColor', () => {
  describe('when the colour is dark', () => {
    describe('and it contrasts enough against white', () => {
      beforeEach(() => {
        mixer = new colorMixer('#515F31')
      })

      it('returns the same colour as the base', () => {
        expect(mixer.getListColor()).toEqual('#515F31')
      })
    })

    describe('and it does not contrast enough against white', () => {
      describe('and the accessibility setting is enabled', () => {
        beforeEach(() => {
          mixer = new colorMixer('#CC04FB')
        })

        it('returns an accessible, accentuated colour', () => {
          expect(mixer.getListColor()).toEqual('#1D0522')
        })
      })
    })
  })

  describe('when the colour is light', () => {
    describe('and the accessibility setting is enabled', () => {
      beforeEach(() => {
        mixer = new colorMixer('#C4C846')
      })

      it('returns an accessible, accentuated colour', () => {
        expect(mixer.getListColor()).toEqual('#4A4B20')
      })
    })
  })
})

describe('#uiElementColorFrom', () => {
  beforeEach(() => {
    mixer = new colorMixer(colorStr)
  })

  describe('when the colour is dark', () => {
    it('returns the same colour', () => {
      expect(mixer.uiElementColorFrom('#515F31')).toEqual('#515F31')
    })
  })

  describe('when the colour is light', () => {
    describe('and the accessibility setting is enabled', () => {
      it('returns an accessible, accentuated colour', () => {
        expect(mixer.uiElementColorFrom('#DCE04F')).toEqual('#5F6121')
      })
    })
  })
})

describe('#foregroundColorFrom', () => {
  describe('when the colour is dark', () => {
    describe('and it contrasts enough against white', () => {
      it('returns white', () => {
        expect(mixer.foregroundColorFrom('#515F31')).toEqual('#FFFFFF')
      })
    })

    describe('and it does not contrast enough against white', () => {
      describe('and the accessibility setting is enabled', () => {
        it('returns an accessible, accentuated colour', () => {
          expect(mixer.foregroundColorFrom('#CC04FB')).toEqual('#1D0522')
        })
      })
    })
  })

  describe('when the colour is light', () => {
    describe('and the accessibility setting is enabled', () => {
      it('returns an accessible, accentuated colour', () => {
        expect(mixer.foregroundColorFrom('#DCE04F')).toEqual('#5F6121')
      })
    })
  })
})
