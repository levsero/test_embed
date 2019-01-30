import reducer from 'src/redux/modules/answerBot/reducer';

describe('answerBot root reducer', () => {
  it('has the messages sub state', () => {
    const state = reducer({}, { type: '' });

    expect(state)
      .toMatchSnapshot();
  });
});
