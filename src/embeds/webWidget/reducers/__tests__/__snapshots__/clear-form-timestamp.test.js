import reducer from 'embeds/webWidget/reducers'

describe('webWidget reducers', () => {
  it('includes all expected substates', () => {
    expect(reducer(undefined, { type: 'some action' })).toMatchSnapshot()
  })
})
