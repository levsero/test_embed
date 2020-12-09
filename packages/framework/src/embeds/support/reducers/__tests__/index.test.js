import reducer from '../index'

test('includes all expected substates', () => {
  expect(reducer({}, { type: '' })).toMatchSnapshot()
})
