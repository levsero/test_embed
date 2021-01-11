import { MESSAGE_STATUS } from '@zendesk/conversation-components'
import getMessageLog from 'src/apps/messenger/features/messageLog/getMessageLog'
import createStore from 'src/apps/messenger/store'
import { testReducer } from 'src/apps/messenger/utils/testHelpers'
import * as suncoClient from 'src/apps/messenger/api/sunco'
import reducer, { messageReceived, sendMessage } from '../store'

jest.mock('src/apps/messenger/api/sunco')

describe('messages store', () => {
  describe('reducer', () => {
    testReducer(reducer, [
      {
        extraDesc: 'initial state',
        action: { type: undefined },
        expected: {
          ids: [],
          entities: {},
          hasPrevious: false,
          hasFetchedConversation: false,
          errorFetchingHistory: false,
          isFetchingHistory: false
        }
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
          errorFetchingHistory: false,
          isFetchingHistory: false,
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

    describe('timestamps', () => {
      it('inserts a timestamp when there is a fifteen minute gap between messages and at the start of the log', () => {
        const store = createStore()

        const message1TimeStamp = new Date('11:00 PM September 28, 2020')
        const message2TimeStamp = new Date('11:05 PM September 28, 2020')
        const message3TimeStamp = new Date('11:20:01 PM September 28, 2020')

        store.dispatch(
          messageReceived({
            message: {
              _id: 1,
              type: 'text',
              text: 'One',
              role: 'appUser',
              received: message1TimeStamp.getTime() / 1000
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
              received: message2TimeStamp.getTime() / 1000
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
              received: message3TimeStamp.getTime() / 1000
            }
          })
        )

        const log = getMessageLog(store.getState())

        expect(log[0].type).toEqual('timestamp')
        expect(log[3].type).toEqual('timestamp')
      })
    })

    describe('position properties on each message', () => {
      it('groups together messages from the same author with compatible types', () => {
        const store = createStore()

        store.dispatch(
          messageReceived({
            message: {
              _id: 1,
              type: 'text',
              text: 'testText',
              authorId: 'bus123',
              received: 1
            }
          })
        )

        store.dispatch(
          messageReceived({
            message: {
              _id: 2,
              type: 'image',
              authorId: 'bus123',
              received: 2
            }
          })
        )

        store.dispatch(
          messageReceived({
            message: {
              _id: 3,
              type: 'file',
              authorId: 'bus123',
              received: 3
            }
          })
        )

        store.dispatch(
          messageReceived({
            message: {
              _id: 4,
              type: 'text',
              text: 'testText',
              received: 4
            }
          })
        )

        store.dispatch(
          messageReceived({
            message: {
              _id: 5,
              type: 'image',
              received: 5
            }
          })
        )

        store.dispatch(
          messageReceived({
            message: {
              _id: 6,
              type: 'file',
              received: 6
            }
          })
        )

        const [message1, message2, message3, message4, message5, message6] = getMessageLog(
          store.getState()
        )

        expect(message1._id).toEqual(1)
        expect(message1.isFirstInGroup).toBe(true)

        expect(message2._id).toEqual(2)
        expect(message2.isFirstInGroup).toBe(false)
        expect(message2.isLastInGroup).toBe(false)

        expect(message3._id).toEqual(3)
        expect(message3.isFirstInGroup).toBe(false)
        expect(message3.isLastInGroup).toBe(true)

        expect(message4._id).toEqual(4)
        expect(message4.isFirstInGroup).toBe(true)
        expect(message4.isLastInGroup).toBe(false)

        expect(message5._id).toEqual(5)
        expect(message5.isFirstInGroup).toBe(false)
        expect(message5.isLastInGroup).toBe(false)

        expect(message6._id).toEqual(6)
        expect(message6.isFirstInGroup).toBe(false)
        expect(message6.isLastInGroup).toBe(true)
      })

      it('applies isLastMessageInAuthorGroup to the last message from an author', () => {
        const store = createStore()

        store.dispatch(
          messageReceived({
            message: {
              _id: 1,
              type: 'text',
              text: 'testText',
              authorId: 'bus123',
              received: 1
            }
          })
        )

        store.dispatch(
          messageReceived({
            message: {
              _id: 2,
              type: 'image',
              authorId: 'bus123',
              received: 2
            }
          })
        )

        store.dispatch(
          messageReceived({
            message: {
              _id: 3,
              type: 'file',
              authorId: 'bus123',
              received: 3
            }
          })
        )

        store.dispatch(
          messageReceived({
            message: {
              _id: 4,
              type: 'form',
              authorId: 'bus123',
              received: 4
            }
          })
        )

        store.dispatch(
          messageReceived({
            message: {
              _id: 5,
              type: 'form',
              authorId: 'bus456',
              received: 5
            }
          })
        )
        const [message1, message2, message3, message4, message5] = getMessageLog(store.getState())

        expect(message1.isLastMessageInAuthorGroup).toBe(false)
        expect(message2.isLastMessageInAuthorGroup).toBe(false)
        expect(message3.isLastMessageInAuthorGroup).toBe(false)
        expect(message4.isLastMessageInAuthorGroup).toBe(true)
        expect(message5.isLastMessageInAuthorGroup).toBe(true)
      })

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

      it('set isFirstInGroup when previous message is from a different author', () => {
        const store = createStore()

        store.dispatch(
          messageReceived({
            message: {
              _id: 1,
              type: 'text',
              text: 'One',
              authorId: 'bus123',
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

      it('set isFirstInGroup when the previous message has a non-groupable different type', () => {
        const store = createStore()

        store.dispatch(
          messageReceived({
            message: {
              _id: 1,
              type: 'form',
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

      it('set isLastInGroup when the next message is from a different author', () => {
        const store = createStore()

        store.dispatch(
          messageReceived({
            message: {
              _id: 1,
              type: 'text',
              text: 'One',
              role: 'business',
              authorId: 'bus123',
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

      it('set isLastInGroup when the next message has a different author', () => {
        const store = createStore()

        store.dispatch(
          messageReceived({
            message: {
              _id: 1,
              type: 'image',
              src: 'cat image',
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
              authorId: 'bus123',
              received: 3
            }
          })
        )

        const [message1, message2, message3] = getMessageLog(store.getState())

        expect(message1._id).toBe(1)
        expect(message1.isLastInGroup).toBe(false)

        expect(message2._id).toBe(2)
        expect(message2.isLastInGroup).toBe(true)

        expect(message3._id).toBe(3)
        expect(message3.isLastInGroup).toBe(true)
      })

      describe('isLastMessageThatHasntFailed', () => {
        it('is true for the message when it is the last message in the log that has not failed', () => {
          const store = createStore()
          ;[
            {
              _id: 1,
              type: 'text',
              text: 'One',
              role: 'business',
              received: 1
            },
            {
              _id: 2,
              type: 'text',
              text: 'Two',
              role: 'appUser',
              received: 2,
              status: MESSAGE_STATUS.sending
            },
            {
              _id: 3,
              type: 'text',
              text: 'Three',
              role: 'appUser',
              received: 3,
              status: MESSAGE_STATUS.failed
            }
          ].forEach(message => {
            store.dispatch(messageReceived({ message }))
          })

          const [message1, message2, message3] = getMessageLog(store.getState())

          expect(message1._id).toBe(1)
          expect(message1.isLastMessageThatHasntFailed).toBe(false)

          expect(message2._id).toBe(2)
          expect(message2.isLastMessageThatHasntFailed).toBe(true)

          expect(message3._id).toBe(3)
          expect(message3.isLastMessageThatHasntFailed).toBe(false)
        })
      })

      it('differentiates between sources from the same authorId', () => {
        const store = createStore()

        store.dispatch(
          messageReceived({
            message: {
              _id: 1,
              authorId: 'bob',
              avatarUrl: 'abc123',
              name: 'bot bob',
              role: 'appMaker',
              type: 'image',
              src: 'cat image',
              received: 1
            }
          })
        )
        store.dispatch(
          messageReceived({
            message: {
              _id: 2,
              authorId: 'bob',
              avatarUrl: 'abc123',
              name: 'agent bob',
              role: 'appMaker',
              type: 'text',
              text: 'Two',
              received: 2
            }
          })
        )

        store.dispatch(
          messageReceived({
            message: {
              _id: 3,
              authorId: 'bob',
              avatarUrl: 'abc1234',
              name: 'agent bob',
              role: 'appMaker',
              type: 'text',
              text: 'Three',
              received: 3
            }
          })
        )

        store.dispatch(
          messageReceived({
            message: {
              _id: 4,
              authorId: 'bob',
              avatarUrl: 'abc1234',
              name: 'agent bob',
              role: 'otherAppMaker',
              type: 'text',
              text: 'Three',
              received: 4
            }
          })
        )

        store.dispatch(
          messageReceived({
            message: {
              _id: 5,
              authorId: 'bob',
              avatarUrl: 'abc1234',
              name: 'agent bob',
              role: 'otherAppMaker',
              type: 'text',
              text: 'Three',
              received: 5
            }
          })
        )

        const [message1, message2, message3, message4, message5] = getMessageLog(store.getState())

        expect(message1._id).toBe(1)
        expect(message1.isFirstMessageInAuthorGroup).toBe(true)
        expect(message1.isLastMessageInAuthorGroup).toBe(true)

        expect(message2._id).toBe(2)
        expect(message2.isFirstMessageInAuthorGroup).toBe(true)
        expect(message2.isLastMessageInAuthorGroup).toBe(true)

        expect(message3._id).toBe(3)
        expect(message3.isFirstMessageInAuthorGroup).toBe(true)
        expect(message3.isLastMessageInAuthorGroup).toBe(true)

        expect(message4._id).toBe(4)
        expect(message4.isFirstMessageInAuthorGroup).toBe(true)
        expect(message4.isLastMessageInAuthorGroup).toBe(false)

        expect(message5._id).toBe(5)
        expect(message5.isFirstMessageInAuthorGroup).toBe(false)
        expect(message5.isLastMessageInAuthorGroup).toBe(true)
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
      const mockSendMessage = async () => {
        return {
          body: {
            messages: [{ someServerValue: 'something' }]
          }
        }
      }

      jest.spyOn(suncoClient, 'sendMessage').mockImplementation(mockSendMessage)

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
