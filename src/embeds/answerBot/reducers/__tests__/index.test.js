import reducer from 'src/embeds/answerBot/reducers'

describe('answerBot root reducer', () => {
  it('has the expected sub states', () => {
    const state = reducer({}, { type: '' })

    expect(state).toMatchSnapshot()
  })
})
