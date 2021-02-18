describe('ChatLog component', () => {
  let ChatLog, CHAT_MESSAGE_EVENTS, CHAT_SYSTEM_EVENTS, i18n

  let agents = {
    'agent:123': {
      display_name: 'Agent123',
      nick: 'agent:123',
      typing: false,
      avatar_path: '/path/to/avatar',
    },
  }

  const chatLogPath = buildSrcPath('component/chat/chatting/ChatLog')
  const chatConstantsPath = buildSrcPath('constants/chat')

  const ChatGroup = noopReactComponent()
  const EventMessage = noopReactComponent()
  const RequestRatingButton = noopReactComponent()

  beforeEach(() => {
    mockery.enable()

    CHAT_MESSAGE_EVENTS = requireUncached(chatConstantsPath).CHAT_MESSAGE_EVENTS
    CHAT_SYSTEM_EVENTS = requireUncached(chatConstantsPath).CHAT_SYSTEM_EVENTS

    i18n = {
      t: jasmine.createSpy(),
    }

    initMockRegistry({
      'component/chat/chatting/log/messages/ConnectedChatGroup': ChatGroup,
      'src/embeds/chat/components/EventMessage': EventMessage,
      'src/embeds/chat/components/RequestRatingButton': RequestRatingButton,
      'constants/chat': {
        CHAT_MESSAGE_EVENTS,
        CHAT_SYSTEM_EVENTS,
      },
      './ChatLog.scss': {
        locals: {},
      },
      'src/redux/modules/chat/chat-selectors': {
        getChatLog: noop,
      },
      'src/apps/webWidget/services/i18n': {
        i18n,
      },
      'types/chat': {
        chatLogEntry: 'chatLogEntry',
      },
    })

    mockery.registerAllowable(chatLogPath)
    ChatLog = requireUncached(chatLogPath).ChatLog
  })

  afterEach(() => {
    mockery.deregisterAll()
    mockery.disable()
  })

  describe('#renderGroup', () => {
    let agentsProp, result

    const agentMessageGroup = {
      type: 'message',
      author: 'agent:123',
      messages: [1, 2, 3],
    }
    const visitorMessageGroup = {
      type: 'message',
      author: 'visitor',
      messages: [4, 5, 6],
    }
    const eventGroup = {
      type: 'event',
      author: 'system',
      messages: [7, 8],
    }

    describe('when the group is a message group from an visitor', () => {
      beforeEach(() => {
        const component = domRender(<ChatLog chatLog={[]} />)

        result = component.renderGroup(visitorMessageGroup)
      })

      it('returns an element of type ChatGroup', () => {
        expect(TestUtils.isElementOfType(result, ChatGroup)).toEqual(true)
      })

      it('is passed the expected props', () => {
        expect(result.props).toEqual(
          jasmine.objectContaining({
            isAgent: false,
            messageKeys: [4, 5, 6],
          })
        )
      })
    })

    describe('when the group is a message group from an agent', () => {
      beforeEach(() => {
        const component = domRender(
          <ChatLog
            showAvatar={true}
            chatLog={[]}
            agents={agentsProp}
            conciergeAvatar="/path/to/concierge"
          />
        )

        result = component.renderGroup(agentMessageGroup)
      })

      it('returns an element of type ChatGroup', () => {
        expect(TestUtils.isElementOfType(result, ChatGroup)).toEqual(true)
      })

      it('is passed the expected props', () => {
        expect(result.props).toEqual(
          jasmine.objectContaining({
            isAgent: true,
            messageKeys: [1, 2, 3],
          })
        )
      })

      describe('when avatar path exists for avatar', () => {
        beforeAll(() => {
          agentsProp = agents
        })

        it('is passed through to the child', () => {
          expect(result.props).toEqual(
            jasmine.objectContaining({
              avatarPath: '/path/to/avatar',
            })
          )
        })
      })

      describe('when avatar path does not exist for avatar', () => {
        beforeAll(() => {
          agentsProp = { nick: 'agent:123' }
        })

        it('passed the concierge avatar to the child', () => {
          expect(result.props).toEqual(
            jasmine.objectContaining({
              avatarPath: '/path/to/concierge',
            })
          )
        })
      })
    })

    describe('when the group is an event group', () => {
      beforeEach(() => {
        const component = domRender(<ChatLog chatLog={[]} />)

        result = component.renderGroup(eventGroup)
      })

      it('returns an element of type EventMessage', () => {
        expect(TestUtils.isElementOfType(result, EventMessage)).toEqual(true)
      })

      it('is passed the expected props', () => {
        expect(result.props).toEqual(
          jasmine.objectContaining({
            eventKey: 7,
          })
        )
      })
    })
  })

  describe('#renderUpdateInfo', () => {
    let component,
      result,
      firstMessageKey = 1,
      mockStringValues,
      updateInfoOnClickSpy = jasmine.createSpy('updateInfoOnClick')

    beforeEach(() => {
      mockStringValues = {
        'embeddable_framework.chat.chatLog.login.updateInfo': 'Please update your info',
      }

      i18n.t.and.callFake((key) => {
        return mockStringValues[key]
      })
    })

    describe('when props.showUpdateInfo is false', () => {
      beforeEach(() => {
        component = instanceRender(
          <ChatLog
            chatLog={{}}
            agents={{}}
            showUpdateInfo={false}
            updateInfoOnClick={updateInfoOnClickSpy}
          />
        )

        result = component.renderUpdateInfo(firstMessageKey)
      })

      it('returns undefined', () => {
        expect(result).toBeUndefined()
      })
    })

    describe('when props.showUpdateInfo is true', () => {
      describe('when the first message matches props.firstVisitorMessage', () => {
        beforeEach(() => {
          component = instanceRender(
            <ChatLog
              chatLog={{}}
              agents={{}}
              showUpdateInfo={true}
              firstVisitorMessage={1}
              updateInfoOnClick={updateInfoOnClickSpy}
            />
          )

          result = component.renderUpdateInfo(firstMessageKey)
        })

        it('returns a <button> tag', () => {
          expect(TestUtils.isElementOfType(result, 'button')).toEqual(true)
        })

        it('returns an element with onClick set to the updateInfoOnClick argument', () => {
          expect(result.props.onClick).toEqual(updateInfoOnClickSpy)
        })

        it('returns an element containing the correct text as a child', () => {
          expect(result.props).toEqual(
            jasmine.objectContaining({
              children: mockStringValues['embeddable_framework.chat.chatLog.login.updateInfo'],
            })
          )
        })
      })

      describe('when the first message does not match props.firstVisitorMessage', () => {
        beforeEach(() => {
          component = instanceRender(
            <ChatLog
              chatLog={{}}
              agents={{}}
              showUpdateInfo={true}
              firstVisitorMessage={-1}
              updateInfoOnClick={updateInfoOnClickSpy}
            />
          )

          result = component.renderUpdateInfo(firstMessageKey)
        })

        it('returns undefined', () => {
          expect(result).toBeUndefined()
        })
      })
    })
  })

  describe('#render', () => {
    let component, socialLogin

    beforeEach(() => {
      component = instanceRender(<ChatLog chatLog={[]} agents={{}} socialLogin={socialLogin} />)
    })

    describe('props', () => {
      beforeAll(() => {
        socialLogin = { avatarPath: 'heynow' }
      })

      it('has a props.socialLogin value', () => {
        expect(component.props.socialLogin).toEqual(socialLogin)
      })
    })
  })
})
