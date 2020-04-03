import * as actions from '../screen-changed'

test('screenChanged dispatches expected payload', () => {
  expect(actions.screenChanged('article')).toMatchSnapshot()
})
