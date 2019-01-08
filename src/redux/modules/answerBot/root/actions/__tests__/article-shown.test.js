import * as actions from '../article-shown';

test('articleShown dispatches expected payload', () => {
  expect(actions.articleShown('1', '2'))
    .toMatchSnapshot();
});
