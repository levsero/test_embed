import * as selectors from '../selectors';

describe('getMessages', () => {
  it('returns the messages', () => {
    const mockState = {
      answerBot: {
        messages: new Map([
          ['1', { message: 'Thing 1' }],
          ['2', { message: 'Thing 2' }]
        ])
      }
    };
    const result = selectors.getMessages(mockState);

    expect(result)
      .toMatchSnapshot();
  });
});

describe('getGroupMessages', () => {
  it('returns messages according to passed in keys', () => {
    const mockState = {
      answerBot: {
        messages: new Map([[0, 'zero'], [1, 'one'], [2, 'two']])
      }
    };
    const mockProps = {
      messageKeys: [1, 2]
    };
    const results = selectors.makeGetGroupMessages(mockState, mockProps);

    expect(results(mockState, mockProps))
      .toMatchSnapshot();
  });
});

describe('getLastScroll', () => {
  it('returns conversation lastScroll', () => {
    const results = selectors.getLastScroll.resultFunc({ lastScroll: 123 });

    expect(results)
      .toMatchSnapshot();
  });
});

describe('getLastScreenClosed', () => {
  it('returns conversation lastScreenClosed', () => {
    const results = selectors.getLastScreenClosed.resultFunc({ lastScreenClosed: 123 });

    expect(results)
      .toMatchSnapshot();
  });
});

describe('makeGetGroupMessages', () => {
  it('returns messages with articles embedded', () => {
    const mockState = {
      answerBot: {
        messages: new Map(
          [
            ['message1', { type: 'results', sessionID: '123' }]
          ]
        ),
        sessions: new Map([['123', { resolved: true, articles: [{ id:1 }, { id: 2 }] }]])
      }
    };
    const mockProps = {
      messageKeys: ['message1']
    };
    const results = selectors.makeGetGroupMessages(mockState, mockProps);

    expect(results(mockState, mockProps))
      .toMatchSnapshot();
  });
});

describe('getGroupMessageKeys', () => {
  it('groups message keys by isVisitor', () => {
    const mockState = {
      answerBot: {
        messages: new Map(
          [
            [0, { }],
            [1, { }],
            [2, { isVisitor: true }],
            [3, { }]
          ]
        )
      }
    };
    const results = selectors.getMessageGroupKeys(mockState);

    expect(results)
      .toMatchSnapshot();
  });

  it('discards previous feedback', () => {
    const mockState = {
      answerBot: {
        messages: new Map(
          [
            [0, { type: 'feedbackRequested' }],
            [1, { feedbackRelated: true }],
            [2, { type: 'feedbackRequested' }],
            [3, { feedbackRelated: true }]
          ]
        )
      }
    };
    const results = selectors.getMessageGroupKeys(mockState);

    expect(results)
      .toMatchSnapshot();
  });

  it('handles feedback appropriately', () => {
    const mockState = {
      answerBot: {
        messages: new Map(
          [
            [0, {}],
            [1, { isVisitor: true } ],
            [2, { type: 'results' } ],
            [3, { type: 'feedbackRequested' }], // start feedback session
            [4, { feedbackRelated: true }],
            [5, { type: 'feedback', isVisitor: true }],
            [6, { feedbackRelated: true }],
            [7, { type: 'feedbackRequested' }], // new feedback session, discard previous ones
            [8, { feedbackRelated: true }],
            [9, { isVisitor: true } ] // non-feedback related message, record current feedback
          ]
        )
      }
    };
    const results = selectors.getMessageGroupKeys(mockState);

    expect(results)
      .toMatchSnapshot();
  });
});
