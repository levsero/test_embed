import reducer, { getMessageLog, messageReceived } from '../store'
import createStore from 'src/apps/messenger/store'
import { testReducer } from 'src/apps/messenger/utils/testHelpers'

describe('messages store', () => {
  describe('reducer', () => {
    testReducer(reducer, [
      {
        extraDesc: 'initial state',
        action: { type: undefined },
        expected: { ids: [], entities: {} }
      },
      {
        extraDesc: 'receive a message',
        action: messageReceived({
          message: {
            _id: 1,
            type: 'text',
            received: 5
          }
        }),
        expected: {
          ids: [1],
          entities: {
            1: {
              _id: 1,
              type: 'text',
              received: 5
            }
          }
        }
      },
      {
        extraDesc: 'receive an older message',
        initialState: {
          ids: [2],
          entities: {
            2: {
              _id: 2,
              type: 'text',
              received: 10
            }
          }
        },
        action: messageReceived({
          message: {
            _id: 1,
            type: 'text',
            received: 5
          }
        }),
        expected: {
          ids: [1, 2],
          entities: {
            1: {
              _id: 1,
              type: 'text',
              received: 5
            },
            2: {
              _id: 2,
              type: 'text',
              received: 10
            }
          }
        }
      },
      {
        extraDesc: 'receive a newer message',
        initialState: {
          ids: [2],
          entities: {
            2: {
              _id: 2,
              type: 'text',
              received: 10
            }
          }
        },
        action: messageReceived({
          message: {
            _id: 3,
            type: 'text',
            received: 15
          }
        }),
        expected: {
          ids: [2, 3],
          entities: {
            2: {
              _id: 2,
              type: 'text',
              received: 10
            },
            3: {
              _id: 3,
              type: 'text',
              received: 15
            }
          }
        }
      }
    ])
  })

  describe('getMessageLog', () => {
    it('orders messages by their received value', () => {
      const store = createStore()

      store.dispatch(
        messageReceived({
          message: {
            _id: 1,
            type: 'text',
            text: 'One',
            role: 'appUser',
            received: 100
          }
        })
      )
      store.dispatch(
        messageReceived({
          message: {
            _id: 2,
            type: 'text',
            text: 'Two',
            role: 'appUser',
            received: 50
          }
        })
      )

      store.dispatch(
        messageReceived({
          message: {
            _id: 3,
            type: 'text',
            text: 'Three',
            role: 'business',
            received: 150
          }
        })
      )

      const [message1, message2, message3] = getMessageLog(store.getState())

      expect(message1._id).toBe(2)
      expect(message2._id).toBe(1)
      expect(message3._id).toBe(3)
    })

    describe('position properties on each message', () => {
      it('has isLastInLog equal to true if the message is the last message in the array', () => {
        const store = createStore()

        store.dispatch(
          messageReceived({
            message: {
              _id: 1,
              type: 'text',
              text: 'One',
              role: 'appUser',
              received: 1
            }
          })
        )
        store.dispatch(
          messageReceived({
            message: {
              _id: 2,
              type: 'text',
              text: 'Two',
              role: 'appUser',
              received: 2
            }
          })
        )

        store.dispatch(
          messageReceived({
            message: {
              _id: 3,
              type: 'text',
              text: 'Three',
              role: 'business',
              received: 3
            }
          })
        )

        const [message1, message2, message3] = getMessageLog(store.getState())

        expect(message1._id).toBe(1)
        expect(message1.isLastInLog).toBe(false)

        expect(message2._id).toBe(2)
        expect(message2.isLastInLog).toBe(false)

        expect(message3._id).toBe(3)
        expect(message3.isLastInLog).toBe(true)
      })

      describe('isFirstInGroup', () => {
        it('is true for the message when previous message is from a different author', () => {
          const store = createStore()

          store.dispatch(
            messageReceived({
              message: {
                _id: 1,
                type: 'text',
                text: 'One',
                role: 'business',
                received: 1
              }
            })
          )
          store.dispatch(
            messageReceived({
              message: {
                _id: 2,
                type: 'text',
                text: 'Two',
                role: 'appUser',
                received: 2
              }
            })
          )

          store.dispatch(
            messageReceived({
              message: {
                _id: 3,
                type: 'text',
                text: 'Three',
                role: 'appUser',
                received: 3
              }
            })
          )

          const [message1, message2, message3] = getMessageLog(store.getState())

          expect(message1._id).toBe(1)
          expect(message1.isFirstInGroup).toBe(true)

          expect(message2._id).toBe(2)
          expect(message2.isFirstInGroup).toBe(true)

          expect(message3._id).toBe(3)
          expect(message3.isFirstInGroup).toBe(false)
        })

        it('is true for the message when the previous message has a different type', () => {
          const store = createStore()

          store.dispatch(
            messageReceived({
              message: {
                _id: 1,
                type: 'image',
                src: 'cat image',
                role: 'appUser',
                received: 1
              }
            })
          )
          store.dispatch(
            messageReceived({
              message: {
                _id: 2,
                type: 'text',
                text: 'Two',
                role: 'appUser',
                received: 2
              }
            })
          )

          store.dispatch(
            messageReceived({
              message: {
                _id: 3,
                type: 'text',
                text: 'Three',
                role: 'appUser',
                received: 3
              }
            })
          )

          const [message1, message2, message3] = getMessageLog(store.getState())

          expect(message1._id).toBe(1)
          expect(message1.isFirstInGroup).toBe(true)

          expect(message2._id).toBe(2)
          expect(message2.isFirstInGroup).toBe(true)

          expect(message3._id).toBe(3)
          expect(message3.isFirstInGroup).toBe(false)
        })
      })

      describe('isLastInGroup', () => {
        it('is true for the message when the next message is from a different author', () => {
          const store = createStore()

          store.dispatch(
            messageReceived({
              message: {
                _id: 1,
                type: 'text',
                text: 'One',
                role: 'business',
                received: 1
              }
            })
          )
          store.dispatch(
            messageReceived({
              message: {
                _id: 2,
                type: 'text',
                text: 'Two',
                role: 'appUser',
                received: 2
              }
            })
          )

          store.dispatch(
            messageReceived({
              message: {
                _id: 3,
                type: 'text',
                text: 'Three',
                role: 'appUser',
                received: 3
              }
            })
          )

          const [message1, message2, message3] = getMessageLog(store.getState())

          expect(message1._id).toBe(1)
          expect(message1.isLastInGroup).toBe(true)

          expect(message2._id).toBe(2)
          expect(message2.isLastInGroup).toBe(false)

          expect(message3._id).toBe(3)
          expect(message3.isLastInGroup).toBe(true)
        })

        it('is true for the message when the next message has a different type', () => {
          const store = createStore()

          store.dispatch(
            messageReceived({
              message: {
                _id: 1,
                type: 'image',
                src: 'cat image',
                role: 'appUser',
                received: 1
              }
            })
          )
          store.dispatch(
            messageReceived({
              message: {
                _id: 2,
                type: 'text',
                text: 'Two',
                role: 'appUser',
                received: 2
              }
            })
          )

          store.dispatch(
            messageReceived({
              message: {
                _id: 3,
                type: 'text',
                text: 'Three',
                role: 'appUser',
                received: 3
              }
            })
          )

          const [message1, message2, message3] = getMessageLog(store.getState())

          expect(message1._id).toBe(1)
          expect(message1.isLastInGroup).toBe(true)

          expect(message2._id).toBe(2)
          expect(message2.isLastInGroup).toBe(false)

          expect(message3._id).toBe(3)
          expect(message3.isLastInGroup).toBe(true)
        })
      })

      it('it matches snapshot', () => {
        const store = createStore()

        store.dispatch(
          messageReceived({
            message: {
              _id: 1,
              type: 'text',
              text: 'One',
              role: 'business',
              received: 1
            }
          })
        )
        store.dispatch(
          messageReceived({
            message: {
              _id: 2,
              type: 'text',
              text: 'Two',
              role: 'appUser',
              received: 2,
              actions: [
                {
                  type: 'reply',
                  text: 'Pizza',
                  iconUrl: 'http://example.org/taco.png',
                  payload: 'PIZZA'
                },
                {
                  type: 'reply',
                  text: 'Crumpets',
                  iconUrl: 'http://example.org/burrito.png',
                  payload: 'CRUMPETS'
                }
              ]
            }
          })
        )

        store.dispatch(
          messageReceived({
            message: {
              _id: 3,
              type: 'text',
              text: 'Three',
              role: 'appUser',
              received: 3,
              actions: [
                {
                  type: 'reply',
                  text: 'Tacos',
                  iconUrl: 'http://example.org/taco.png',
                  payload: 'TACOS',
                  _id: '5f584700b53c4e000c41f41a'
                },
                {
                  type: 'reply',
                  text: 'Burritos',
                  iconUrl: 'http://example.org/burrito.png',
                  payload: 'BURRITOS',
                  _id: '5f584700b53c4e000c41f419'
                }
              ]
            }
          })
        )

        const messages = getMessageLog(store.getState())
        expect(messages).toMatchInlineSnapshot(`
          Array [
            Object {
              "_id": 1,
              "isFirstInGroup": true,
              "isLastInGroup": true,
              "isLastInLog": false,
              "received": 1,
              "role": "business",
              "text": "One",
              "type": "text",
            },
            Object {
              "_id": 2,
              "actions": Array [
                Object {
                  "iconUrl": "http://example.org/taco.png",
                  "payload": "PIZZA",
                  "text": "Pizza",
                  "type": "reply",
                },
                Object {
                  "iconUrl": "http://example.org/burrito.png",
                  "payload": "CRUMPETS",
                  "text": "Crumpets",
                  "type": "reply",
                },
              ],
              "isFirstInGroup": true,
              "isLastInGroup": false,
              "isLastInLog": false,
              "received": 2,
              "role": "appUser",
              "text": "Two",
              "type": "text",
            },
            Object {
              "_id": 3,
              "actions": Array [
                Object {
                  "_id": "5f584700b53c4e000c41f41a",
                  "iconUrl": "http://example.org/taco.png",
                  "payload": "TACOS",
                  "text": "Tacos",
                  "type": "reply",
                },
                Object {
                  "_id": "5f584700b53c4e000c41f419",
                  "iconUrl": "http://example.org/burrito.png",
                  "payload": "BURRITOS",
                  "text": "Burritos",
                  "type": "reply",
                },
              ],
              "isFirstInGroup": false,
              "isLastInGroup": true,
              "isLastInLog": true,
              "received": 3,
              "role": "appUser",
              "text": "Three",
              "type": "text",
            },
            Object {
              "id": Array [
                Object {
                  "_id": "5f584700b53c4e000c41f41a",
                  "iconUrl": "http://example.org/taco.png",
                  "payload": "TACOS",
                  "text": "Tacos",
                  "type": "reply",
                },
                Object {
                  "_id": "5f584700b53c4e000c41f419",
                  "iconUrl": "http://example.org/burrito.png",
                  "payload": "BURRITOS",
                  "text": "Burritos",
                  "type": "reply",
                },
              ],
            },
          ]
        `)
      })
    })
  })
})
