import reducer from 'classicSrc/redux/modules/base/reducer'

describe('base root reducer', () => {
  it('has the expected sub states', () => {
    const state = reducer({}, { type: '' })

    expect(state).toMatchSnapshot()
  })
})
