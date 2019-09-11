describe('EventMessage component', () => {
  let EventMessage, i18n

  const EventMessagePath = buildSrcPath('component/chat/chatting/log/events/EventMessage')
  const chatConstantsPath = buildSrcPath('constants/chat')
  const mockStringValues = {
    'embeddable_framework.chat.chatLog.chatStarted': 'Chat started',
    'embeddable_framework.chat.chatLog.rating.good': 'Good',
    'embeddable_framework.chat.chatLog.rating.bad': 'Bad',
    'embeddable_framework.chat.chatLog.button.leaveComment': 'Leave a comment',
    'embeddable_framework.chat.chatLog.button.rateChat': 'Rate this chat'
  }

  let chatConstants = requireUncached(chatConstantsPath)
  let DISCONNECTION_REASONS = chatConstants.DISCONNECTION_REASONS

  beforeEach(() => {
    mockery.enable()

    i18n = {
      t: jasmine.createSpy()
    }

    initMockRegistry({
      './EventMessage.scss': {
        locals: {
          eventMessage: 'eventMessageClass',
          fadeIn: 'fadeInClass'
        }
      },
      'constants/chat': {
        DISCONNECTION_REASONS
      },
      'src/redux/modules/chat/chat-selectors': {
        getGroupMessages: noop
      },
      'service/i18n': {
        i18n
      },
      'src/constants/shared': {
        TEST_IDS: {}
      }
    })

    mockery.registerAllowable(EventMessagePath)
    EventMessage = requireUncached(EventMessagePath).default
  })

  afterEach(() => {
    mockery.deregisterAll()
    mockery.disable()
  })

  describe('#renderEventMessage', () => {
    const testCases = [
      {
        description: 'member joined event from a visitor',
        event: { nick: 'visitor', type: 'chat.memberjoin' },
        expectedString: 'embeddable_framework.chat.chatLog.chatStarted'
      },
      {
        description: 'member joined event from an agent',
        event: {
          nick: 'agent:123',
          display_name: 'Agent 123',
          type: 'chat.memberjoin'
        },
        expectedString: 'embeddable_framework.chat.chatLog.agentJoined',
        expectedArgs: { agent: 'Agent 123' }
      },
      {
        description: 'member left event from a visitor',
        event: { nick: 'visitor', type: 'chat.memberleave' },
        expectedString: 'embeddable_framework.chat.chatLog.chatEnded'
      },
      {
        description: 'member left event from an agent',
        event: {
          nick: 'agent:123',
          display_name: 'Agent 123',
          type: 'chat.memberleave'
        },
        expectedString: 'embeddable_framework.chat.chatLog.agentLeft',
        expectedArgs: { agent: 'Agent 123' }
      },
      {
        description: 'member left event from an agent with reason considered to be disconnection',
        event: {
          nick: 'agent:123',
          display_name: 'Agent 123',
          type: 'chat.memberleave',
          reason: 'disconnect_user'
        },
        expectedString: 'embeddable_framework.chat.chatLog.agentDisconnected',
        expectedArgs: { agent: 'Agent 123' }
      },
      {
        description:
          'member left event from an agent with reason not considered to be disconnection',
        event: {
          nick: 'agent:123',
          display_name: 'Agent 123',
          type: 'chat.memberleave',
          reason: 'arbitrary_unknown_reason'
        },
        expectedString: 'embeddable_framework.chat.chatLog.agentLeft',
        expectedArgs: { agent: 'Agent 123' }
      },
      {
        description: 'rating event with no rating value',
        event: { nick: 'visitor', type: 'chat.rating' },
        expectedString: 'embeddable_framework.chat.chatLog.rating.removed'
      },
      {
        description: 'chat comment submitted',
        event: { nick: 'visitor', type: 'chat.comment' },
        expectedString: 'embeddable_framework.chat.chatlog.comment.submitted'
      },
      {
        description: 'chat contact details updated',
        event: { type: 'chat.contact_details.updated' },
        expectedString: 'embeddable_framework.chat.contact_details.updated'
      }
    ]

    testCases.forEach(testCase => {
      describe(`when passed a ${testCase.description}`, () => {
        beforeEach(() => {
          domRender(<EventMessage event={testCase.event} />)
        })

        it('returns the appropriate string', () => {
          if (testCase.expectedArgs) {
            expect(i18n.t).toHaveBeenCalledWith(testCase.expectedString, testCase.expectedArgs)
          } else {
            expect(i18n.t).toHaveBeenCalledWith(testCase.expectedString)
          }
        })
      })
    })

    const ratingTestCases = [
      {
        description: 'rating event with a "good" rating value',
        event: { nick: 'visitor', type: 'chat.rating', new_rating: 'good' },
        expectedString: 'embeddable_framework.chat.chatLog.rating.description',
        expectedArgs: { value: 'Good' }
      },
      {
        description: 'rating event with a "bad" rating value',
        event: { nick: 'visitor', type: 'chat.rating', new_rating: 'bad' },
        expectedString: 'embeddable_framework.chat.chatLog.rating.description',
        expectedArgs: { value: 'Bad' }
      }
    ]

    ratingTestCases.forEach(testCase => {
      describe(`when passed a ${testCase.description}`, () => {
        beforeEach(() => {
          i18n.t.and.callFake(key => {
            return mockStringValues[key]
          })

          domRender(<EventMessage event={testCase.event} />)
        })

        it('returns the appropriate string', () => {
          if (testCase.expectedArgs) {
            expect(i18n.t).toHaveBeenCalledWith(testCase.expectedString, testCase.expectedArgs)
          } else {
            expect(i18n.t).toHaveBeenCalledWith(testCase.expectedString)
          }
        })
      })
    })
  })

  describe('#render', () => {
    let componentNode
    const event = {
      nick: 'visitor',
      type: 'chat.memberjoin',
      timestamp: 123456789
    }

    beforeEach(() => {
      i18n.t.and.callFake(key => {
        return mockStringValues[key]
      })

      const component = domRender(<EventMessage event={event} />)

      componentNode = ReactDOM.findDOMNode(component)
    })

    it('wraps the translated event message in a container with styles', () => {
      expect(componentNode.textContent).toEqual(
        mockStringValues['embeddable_framework.chat.chatLog.chatStarted']
      )
    })

    describe('when rendering a new event', () => {
      beforeEach(() => {
        const component = domRender(
          <EventMessage event={event} chatLogCreatedAt={event.timestamp - 1} />
        )

        componentNode = ReactDOM.findDOMNode(component)
      })

      it('renders container with correct classnames', () => {
        expect(componentNode.className).toEqual('eventMessageClass fadeInClass')
      })
    })

    describe('when rendering an old event', () => {
      beforeEach(() => {
        const component = domRender(
          <EventMessage event={event} chatLogCreatedAt={event.timestamp + 1} />
        )

        componentNode = ReactDOM.findDOMNode(component)
      })

      it('renders container with correct classnames', () => {
        expect(componentNode.className).toEqual('eventMessageClass')
      })
    })

    describe('when passed a child component', () => {
      const childElement = <div id="last-child-element" />
      let children

      beforeEach(() => {
        const component = domRender(<EventMessage event={event}>{childElement}</EventMessage>)

        children = component.render().props.children
      })

      it('is rendered as the last element in the wrapper element', () => {
        expect(children[children.length - 1]).toEqual(childElement)
      })
    })
  })
})
