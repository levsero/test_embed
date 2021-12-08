import reducer from 'classicSrc/redux/modules/reducer'

describe('combined reducer', () => {
  it('has the expected state', () => {
    const state = reducer({}, { type: '' })

    expect(Object.keys(state)).toMatchSnapshot()
  })
})
