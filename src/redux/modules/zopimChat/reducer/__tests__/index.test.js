import reducer from 'src/redux/modules/zopimChat/reducer'

describe('zopimChat root reducer', () => {
  it('has the expected sub states', () => {
    const state = reducer({}, { type: '' })

    expect(state).toMatchSnapshot()
  })
})
