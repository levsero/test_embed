import reducer from '../index';

describe('settings launcher reducer', () => {
  it('includes expected reducers', () => {
    expect(reducer(undefined, {}))
      .toMatchSnapshot();
  });
});
