import * as selectors from '../'

describe('getMessages', () => {
  it('returns the messages', () => {
    const mockState = {
      answerBot: {
        messages: new Map([
          ['1', { message: 'Thing 1' }],
          ['2', { message: 'Thing 2' }],
          [
            '3',
            {
              message: {
                key: 'embeddable_framework.chat.chatLog.loadingImage',
                interpolation: {
                  attachmentSize: 'someAttachmentSize',
                },
              },
            },
          ],
        ]),
      },
      base: {
        locale: 'fr',
      },
    }
    const result = selectors.getMessages(mockState)

    expect(result).toMatchInlineSnapshot(`
      Map {
        "1" => Object {
          "message": "Thing 1",
        },
        "2" => Object {
          "message": "Thing 2",
        },
        "3" => Object {
          "message": "Loading image (someAttachmentSize)...",
        },
      }
    `)
  })
})

describe('getLastMessage', () => {
  it('returns the messages', () => {
    const mockState = {
      answerBot: {
        messages: new Map([
          ['1', { message: 'Thing 1' }],
          ['2', { message: 'Thing 2' }],
        ]),
      },
      base: {
        locale: 'fr',
      },
    }
    const result = selectors.getLastMessage(mockState)

    expect(result).toEqual({ message: 'Thing 2' })
  })
})

describe('getLastMessageType', () => {
  it('returns the messages', () => {
    const mockState = {
      answerBot: {
        messages: new Map([
          ['1', { message: 'Thing 1', type: 'wah' }],
          ['2', { message: 'Thing 2', type: 'blah' }],
        ]),
      },
      base: {
        locale: 'fr',
      },
    }
    const result = selectors.getLastMessageType(mockState)

    expect(result).toEqual('blah')
  })
})

describe('getGroupMessages', () => {
  it('returns messages according to passed in keys', () => {
    const mockState = {
      answerBot: {
        messages: new Map([
          [0, 'zero'],
          [1, 'one'],
          [2, 'two'],
        ]),
      },
      base: {
        locale: 'fr',
      },
    }
    const mockProps = {
      messageKeys: [1, 2],
    }
    const results = selectors.makeGetGroupMessages(mockState, mockProps)

    expect(results(mockState, mockProps)).toMatchInlineSnapshot(`
      Array [
        "one",
        "two",
      ]
    `)
  })
})

describe('getLastScroll', () => {
  it('returns conversation lastScroll', () => {
    const results = selectors.getLastScroll.resultFunc({ lastScroll: 123 })

    expect(results).toMatchInlineSnapshot(`123`)
  })
})

describe('getLastScreenClosed', () => {
  it('returns conversation lastScreenClosed', () => {
    const results = selectors.getLastScreenClosed.resultFunc({ lastScreenClosed: 123 })

    expect(results).toMatchInlineSnapshot(`123`)
  })
})

describe('makeGetGroupMessages', () => {
  it('returns messages with articles embedded', () => {
    const mockState = {
      answerBot: {
        messages: new Map([['message1', { type: 'results', sessionID: '123' }]]),
        sessions: new Map([['123', { resolved: true, articles: [{ id: 1 }, { id: 2 }] }]]),
      },
      base: {
        locale: 'fr',
      },
    }
    const mockProps = {
      messageKeys: ['message1'],
    }
    const results = selectors.makeGetGroupMessages(mockState, mockProps)

    expect(results(mockState, mockProps)).toMatchInlineSnapshot(`
      Array [
        Object {
          "articles": Array [
            Object {
              "id": 1,
            },
            Object {
              "id": 2,
            },
          ],
          "sessionID": "123",
          "type": "results",
        },
      ]
    `)
  })
})

describe('getGroupMessageKeys', () => {
  it('groups message keys by isVisitor', () => {
    const mockState = {
      answerBot: {
        messages: new Map([
          [0, {}],
          [1, {}],
          [2, { isVisitor: true }],
          [3, {}],
        ]),
      },
      base: {
        locale: 'fr',
      },
    }
    const results = selectors.getMessageGroupKeys(mockState)

    expect(results).toMatchInlineSnapshot(`
      Object {
        "0": Object {
          "isVisitor": undefined,
          "messageKeys": Array [
            0,
            1,
          ],
        },
        "1": Object {
          "isVisitor": true,
          "messageKeys": Array [
            2,
          ],
        },
        "2": Object {
          "isVisitor": undefined,
          "messageKeys": Array [
            3,
          ],
        },
      }
    `)
  })

  it('only keeps the last bot typing message', () => {
    const mockState = {
      answerBot: {
        messages: new Map([
          ['1', { message: 'Hello', isVisitor: false }],
          ['2', { type: 'botTyping', isVisitor: false }],
          ['3', { type: 'botTyping', isVisitor: false }],
        ]),
      },
      base: {
        locale: 'fr',
      },
    }
    const results = selectors.getMessageGroupKeys(mockState)

    expect(results).toMatchInlineSnapshot(`
      Object {
        "0": Object {
          "isVisitor": false,
          "messageKeys": Array [
            "1",
            "3",
          ],
        },
      }
    `)
  })

  it('discards bot typing if it is not the last message', () => {
    const mockState = {
      answerBot: {
        messages: new Map([
          ['1', { message: 'Hello', isVisitor: false }],
          ['2', { type: 'botTyping', isVisitor: false }],
          ['3', { type: 'botTyping', isVisitor: false }],
          ['4', { message: 'hi', isVisitor: true }],
        ]),
      },
      base: {
        locale: 'fr',
      },
    }
    const results = selectors.getMessageGroupKeys(mockState)

    expect(results).toMatchInlineSnapshot(`
      Object {
        "0": Object {
          "isVisitor": false,
          "messageKeys": Array [
            "1",
          ],
        },
        "1": Object {
          "isVisitor": true,
          "messageKeys": Array [
            "4",
          ],
        },
      }
    `)
  })

  it('discards previous feedback', () => {
    const mockState = {
      answerBot: {
        messages: new Map([
          [0, { type: 'feedbackRequested' }],
          [1, { feedbackRelated: true }],
          [2, { type: 'feedbackRequested' }],
          [3, { feedbackRelated: true }],
        ]),
      },
      base: {
        locale: 'fr',
      },
    }
    const results = selectors.getMessageGroupKeys(mockState)

    expect(results).toMatchInlineSnapshot(`
      Object {
        "0": Object {
          "isVisitor": undefined,
          "messageKeys": Array [
            3,
          ],
        },
      }
    `)
  })

  it('handles feedback appropriately', () => {
    const mockState = {
      answerBot: {
        messages: new Map([
          [0, {}],
          [1, { isVisitor: true }],
          [2, { type: 'results' }],
          [3, { type: 'feedbackRequested' }], // start feedback session
          [4, { feedbackRelated: true }],
          [5, { type: 'feedback', isVisitor: true }],
          [6, { feedbackRelated: true }],
          [7, { type: 'feedbackRequested' }], // new feedback session, discard previous ones
          [8, { feedbackRelated: true }],
          [9, { isVisitor: true }], // non-feedback related message, record current feedback
        ]),
      },
      base: {
        locale: 'fr',
      },
    }
    const results = selectors.getMessageGroupKeys(mockState)

    expect(results).toMatchInlineSnapshot(`
      Object {
        "0": Object {
          "isVisitor": undefined,
          "messageKeys": Array [
            0,
          ],
        },
        "1": Object {
          "isVisitor": true,
          "messageKeys": Array [
            1,
          ],
        },
        "2": Object {
          "isVisitor": undefined,
          "messageKeys": Array [
            2,
            8,
          ],
        },
        "3": Object {
          "isVisitor": true,
          "messageKeys": Array [
            9,
          ],
        },
      }
    `)
  })
})

test('getGetInTouchVisible', () => {
  const mockState = { getInTouchVisible: true }
  const result = selectors.getGetInTouchVisible.resultFunc(mockState)

  expect(result).toEqual(true)
})
