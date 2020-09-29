import reducer, { getMessageLog, messageReceived, sendMessage } from '../store'
import createStore from 'src/apps/messenger/store'
import { testReducer } from 'src/apps/messenger/utils/testHelpers'
import * as suncoClient from 'src/apps/messenger/suncoClient'

jest.mock('src/apps/messenger/suncoClient')

describe('messages store', () => {
  describe('reducer', () => {
    testReducer(reducer, [
      {
        extraDesc: 'initial state',
        action: { type: undefined },
        expected: { ids: [], entities: {}, hasPrevious: false, hasFetchedConversation: false }
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
          hasPrevious: false,
          hasFetchedConversation: false,
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
    })
  })

  describe('sendMessage', () => {
    it('adds an optimistic message into the message log when sent', () => {
      const mockClient = {
        sendMessage: async () => {}
      }
      jest.spyOn(suncoClient, 'getClient').mockReturnValue(mockClient)
      const store = createStore()

      store.dispatch(sendMessage({ message: 'Some message' }))

      expect(getMessageLog(store.getState())).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            type: 'text',
            status: 'sending',
            text: 'Some message'
          })
        ])
      )
    })

    it('updates the status of the message to failed when failed to send', async () => {
      const mockClient = {
        sendMessage: async () => {
          throw new Error('stuff')
        }
      }
      jest.spyOn(suncoClient, 'getClient').mockReturnValue(mockClient)
      const store = createStore()

      const action = store.dispatch(sendMessage({ message: 'Some message' }))

      expect(getMessageLog(store.getState())).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            type: 'text',
            status: 'sending',
            text: 'Some message'
          })
        ])
      )

      await action

      expect(getMessageLog(store.getState())).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            type: 'text',
            status: 'failed',
            text: 'Some message'
          })
        ])
      )
    })

    it('updates the status of the message to sent when sent successfully', async () => {
      const mockClient = {
        sendMessage: async () => {
          return {
            body: {
              messages: [{ someServerValue: 'something' }]
            }
          }
        }
      }
      jest.spyOn(suncoClient, 'getClient').mockReturnValue(mockClient)
      const store = createStore()

      const action = store.dispatch(sendMessage({ message: 'Some message' }))

      expect(getMessageLog(store.getState())).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            type: 'text',
            status: 'sending',
            text: 'Some message'
          })
        ])
      )

      await action

      expect(getMessageLog(store.getState())).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            type: 'text',
            status: 'sent',
            text: 'Some message',
            someServerValue: 'something'
          })
        ])
      )
    })

    it('updates the status of the message to "sending" when retrying', async () => {
      const mockClient = {
        sendMessage: async () => {}
      }
      jest.spyOn(suncoClient, 'getClient').mockReturnValue(mockClient)
      const store = createStore()

      store.dispatch(
        messageReceived({
          message: {
            _id: 'some-message',
            type: 'text',
            text: 'Some message',
            isOptimistic: true,
            status: 'failed'
          }
        })
      )

      store.dispatch(sendMessage({ message: 'Some message', messageId: 'some-message' }))

      expect(getMessageLog(store.getState())).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            _id: 'some-message',
            type: 'text',
            status: 'sending',
            text: 'Some message'
          })
        ])
      )
    })
  })
})
