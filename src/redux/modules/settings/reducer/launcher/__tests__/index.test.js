import reducer from '../index';

describe('settings launcher reducer', () => {
  let result;

  beforeEach(() => {
    result = reducer(undefined, {});
  });

  it('includes badge', () => {
    expect(result.badge)
      .toBeDefined();
  });
});
