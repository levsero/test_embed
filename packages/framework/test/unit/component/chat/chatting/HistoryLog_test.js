describe('HistoryLog component', () => {
  let HistoryLog, CHAT_MESSAGE_EVENTS, CHAT_SYSTEM_EVENTS, dateTimeSpy, i18n

  let agents = {
    'agent:123': {
      display_name: 'Agent123',
      nick: 'agent:123',
      typing: false,
      avatar_path: '/path/to/avatar',
    },
  }

  const HistoryLogPath = buildSrcPath('component/chat/chatting/HistoryLog')
  const chatConstantsPath = buildSrcPath('constants/chat')

  const HistoryChatGroup = noopReactComponent()
  const HistoryEventMessage = noopReactComponent()
  const Button = noopReactComponent()

  beforeEach(() => {
    mockery.enable()

    CHAT_MESSAGE_EVENTS = requireUncached(chatConstantsPath).CHAT_MESSAGE_EVENTS
    CHAT_SYSTEM_EVENTS = requireUncached(chatConstantsPath).CHAT_SYSTEM_EVENTS

    dateTimeSpy = jasmine.createSpy('dateTime')

    i18n = {
      t: _.identity,
    }

    initMockRegistry({
      'src/component/chat/chatting/log/messages/ConnectedHistoryGroup': HistoryChatGroup,
      'src/embeds/chat/components/EventMessage': HistoryEventMessage,
      '@zendeskgarden/react-buttons': { Button },
      'src/constants/chat': {
        CHAT_MESSAGE_EVENTS,
        CHAT_SYSTEM_EVENTS,
      },
      'src/redux/modules/chat/chat-history-selectors': {
        getHistoryLog: noop,
      },
      './HistoryLog.scss': {
        locals: {},
      },
      'src/apps/webWidget/services/i18n': {
        i18n,
      },
      'src/util/formatters': {
        dateTime: dateTimeSpy,
      },
    })

    mockery.registerAllowable(HistoryLogPath)
    HistoryLog = requireUncached(HistoryLogPath).HistoryLog
  })

  afterEach(() => {
    mockery.deregisterAll()
    mockery.disable()
  })

  describe('#renderHistoryLog', () => {
    describe('when passed an empty log arg', () => {
      it('returns empty array', () => {
        const component = domRender(
          <HistoryLog showAvatar={true} chatHistoryLog={[]} agents={{}} />
        )
        const log = component.renderHistoryLog()

        expect(log).toEqual([])
      })
    })

    describe('when passed a log with a single message item', () => {
      describe('from a visitor', () => {
        const log = [
          {
            timestamp: 100,
            author: 'visitor',
            type: 'message',
            messages: [100],
          },
        ]
        let result

        beforeEach(() => {
          const component = domRender(<HistoryLog showAvatar={true} chatHistoryLog={log} />)

          result = component.renderHistoryLog()
        })

        it('returns a single element', () => {
          expect(result.length).toEqual(1)
        })

        it('returns an element of type HistoryChatGroup', () => {
          expect(TestUtils.isElementOfType(result[0], HistoryChatGroup)).toEqual(true)
        })

        it('is passed the expected props', () => {
          expect(result[0].props).toEqual(
            jasmine.objectContaining({
              isAgent: false,
              messageKeys: [100],
              avatarPath: undefined,
            })
          )
        })
      })

      describe('from an agent', () => {
        const log = [
          {
            timestamp: 100,
            author: 'agent:123',
            type: 'message',
            messages: [100],
          },
        ]
        let result

        beforeEach(() => {
          const component = domRender(<HistoryLog showAvatar={true} chatHistoryLog={log} />)

          result = component.renderHistoryLog()
        })

        it('returns a single element', () => {
          expect(result.length).toEqual(1)
        })

        it('returns an element of type HistoryChatGroup', () => {
          expect(TestUtils.isElementOfType(result[0], HistoryChatGroup)).toEqual(true)
        })

        it('is passed the expected props', () => {
          expect(result[0].props).toEqual(
            jasmine.objectContaining({
              isAgent: true,
              messageKeys: [100],
              avatarPath: undefined,
            })
          )
        })
      })
    })

    describe('when passed a log with a grouped collection of messages', () => {
      const log = [
        {
          timestamp: 100,
          author: 'visitor',
          type: 'message',
          messages: [100, 200, 300],
        },
      ]

      let result

      beforeEach(() => {
        const component = domRender(<HistoryLog showAvatar={true} chatHistoryLog={log} />)

        result = component.renderHistoryLog()
      })

      it('returns a single element', () => {
        expect(result.length).toEqual(1)
      })

      it('returns an element of type HistoryChatGroup', () => {
        expect(TestUtils.isElementOfType(result[0], HistoryChatGroup)).toEqual(true)
      })

      it('is passed the expected props', () => {
        expect(result[0].props).toEqual(
          jasmine.objectContaining({
            isAgent: false,
            messageKeys: [100, 200, 300],
            avatarPath: undefined,
          })
        )
      })
    })

    describe('when passed a log with a single event', () => {
      const log = [
        {
          timestamp: 100,
          author: 'visitor',
          type: 'event',
          messages: [100],
        },
      ]

      let result

      beforeEach(() => {
        const component = domRender(<HistoryLog showAvatar={true} chatHistoryLog={log} />)

        result = component.renderHistoryLog()
      })

      it('returns a single element', () => {
        expect(result.length).toEqual(1)
      })

      it('returns an element of type HistoryEventMessage', () => {
        expect(TestUtils.isElementOfType(result[0], HistoryEventMessage)).toEqual(true)
      })

      it('is passed the expected props', () => {
        expect(result[0].props).toEqual(
          jasmine.objectContaining({
            eventKey: 100,
          })
        )
      })
    })

    describe('when passed a log with a series of messages and events', () => {
      let result
      const log = [
        { timestamp: 100, author: 'visitor', type: 'event', messages: [100] },
        {
          timestamp: 200,
          author: 'visitor',
          type: 'message',
          messages: [200, 300],
        },
        { timestamp: 400, author: 'agent:123', type: 'event', messages: [400] },
        {
          timestamp: 500,
          author: 'agent:123',
          type: 'message',
          messages: [500, 600],
        },
        { timestamp: 700, author: 'visitor', type: 'message', messages: [700] },
        { timestamp: 800, author: 'visitor', type: 'event', messages: [800] },
        { timestamp: 900, author: 'visitor', type: 'event', messages: [900] },
      ]

      const expectedResult = [
        { component: HistoryEventMessage, props: { eventKey: 100 } },
        {
          component: HistoryChatGroup,
          props: {
            isAgent: false,
            messageKeys: [200, 300],
            avatarPath: undefined,
          },
        },
        { component: HistoryEventMessage, props: { eventKey: 400 } },
        {
          component: HistoryChatGroup,
          props: {
            isAgent: true,
            messageKeys: [500, 600],
            avatarPath: '/path/to/avatar',
          },
        },
        {
          component: HistoryChatGroup,
          props: { isAgent: false, messageKeys: [700], avatarPath: undefined },
        },
        { component: HistoryEventMessage, props: { eventKey: 800 } },
        { component: HistoryEventMessage, props: { eventKey: 900 } },
      ]

      beforeEach(() => {
        const component = domRender(<HistoryLog agents={agents} chatHistoryLog={log} />)

        result = component.renderHistoryLog()
      })

      it('returns a collection with the correct number of elements', () => {
        expect(result.length).toEqual(7)
      })

      it('returns a collection containing elements of the correct type', () => {
        result.forEach((element, idx) => {
          expect(TestUtils.isElementOfType(element, expectedResult[idx].component)).toEqual(true)
        })
      })

      it('passes the expected props to each component', () => {
        result.forEach((element, idx) => {
          expect(element.props).toEqual(jasmine.objectContaining(expectedResult[idx].props))
        })
      })
    })
  })

  describe('renderDivider', () => {
    beforeEach(() => {
      const component = instanceRender(<HistoryLog chatHistoryLog={[]} />)

      component.renderDivider(1234)
    })

    it('calls formatter with timestamp and showToday option', () => {
      expect(dateTimeSpy).toHaveBeenCalledWith(1234, { showToday: true })
    })
  })

  describe('render', () => {
    let result
    const log = [
      { type: 'event', author: 'visitor', messages: [100] },
      { type: 'message', author: 'visitor', messages: [200, 300] },
      { type: 'event', author: 'agent:123', messages: [400] },
      { type: 'message', author: 'agent:123', messages: [500, 600] },
      { type: 'message', author: 'visitor', messages: [700] },
      { type: 'event', author: 'visitor', messages: [800] },
      { type: 'event', author: 'visitor', messages: [900] },
    ]

    beforeEach(() => {
      const component = domRender(<HistoryLog chatHistoryLog={log} agents={agents} />)

      result = component.render()
    })

    it('renders the correct number of children', () => {
      expect(result.props.children.length).toEqual(2)
      expect(result.props.children[0].length).toEqual(7)
    })
  })
})
