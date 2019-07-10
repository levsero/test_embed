import reducer from 'src/redux/modules/answerBot/reducer'

describe('answerBot root reducer', () => {
  it('has the expected sub states', () => {
    const state = reducer({}, { type: '' })

    expect(state).toMatchSnapshot()
  })
})
