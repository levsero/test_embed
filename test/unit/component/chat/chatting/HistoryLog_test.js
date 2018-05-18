describe('HistoryLog component', () => {
  let HistoryLog,
    CHAT_MESSAGE_EVENTS,
    CHAT_SYSTEM_EVENTS,
    dateTimeSpy,
    i18n;

  let agents = {
    'agent:123': { display_name: 'Agent123', nick: 'agent:123', typing: false, avatar_path: '/path/to/avatar'}
  };

  const HistoryLogPath = buildSrcPath('component/chat/chatting/HistoryLog');
  const chatConstantsPath = buildSrcPath('constants/chat');

  const ChatGroup = noopReactComponent();
  const EventMessage = noopReactComponent();
  const Button = noopReactComponent();

  beforeEach(() => {
    mockery.enable();

    CHAT_MESSAGE_EVENTS = requireUncached(chatConstantsPath).CHAT_MESSAGE_EVENTS;
    CHAT_SYSTEM_EVENTS = requireUncached(chatConstantsPath).CHAT_SYSTEM_EVENTS;

    dateTimeSpy = jasmine.createSpy('dateTime');

    i18n = {
      t: _.identity
    };

    initMockRegistry({
      'component/chat/chatting/ChatGroup': { ChatGroup },
      'component/chat/chatting/EventMessage': { EventMessage },
      'component/button/Button': { Button },
      'constants/chat': {
        CHAT_MESSAGE_EVENTS,
        CHAT_SYSTEM_EVENTS
      },
      './HistoryLog.scss': {
        locals: {}
      },
      'service/i18n': {
        i18n
      },
      'utility/formatters': {
        dateTime: dateTimeSpy
      },
    });

    mockery.registerAllowable(HistoryLogPath);
    HistoryLog = requireUncached(HistoryLogPath).HistoryLog;
  });

  afterEach(() => {
    mockery.deregisterAll();
    mockery.disable();
  });

  describe('#renderPastSession', () => {
    describe('when passed an empty log arg', () => {
      it('returns empty array', () => {
        const component = domRender(<HistoryLog showAvatar={true} HistoryLog={{}} agents={{}} />);
        const log = component.renderPastSession();

        expect(log).toEqual([]);
      });
    });

    describe('when passed a log with a single message item', () => {
      describe('from a visitor', () => {
        const log = {
          100: [{ timestamp: 100, nick: 'visitor', type: 'chat.msg', msg: 'Hello' }]
        };
        let result;

        beforeEach(() => {
          const component = domRender(<HistoryLog showAvatar={true} />);

          result = component.renderPastSession(log);
        });

        it('returns a single element', () => {
          expect(result.length).toEqual(1);
        });

        it('returns an element of type ChatGroup', () => {
          expect(TestUtils.isElementOfType(result[0], ChatGroup)).toEqual(true);
        });

        it('is passed the expected props', () => {
          expect(result[0].props).toEqual(jasmine.objectContaining({
            isAgent: false,
            messages: [{ timestamp: 100, nick: 'visitor', type: 'chat.msg', msg: 'Hello' }],
            avatarPath: undefined
          }));
        });
      });

      describe('from an agent', () => {
        const log = {
          100: [{ timestamp: 100, nick: 'agent:123', type: 'chat.msg', display_name: 'Agent 123', msg: 'Hello' }]
        };
        let result;

        beforeEach(() => {
          const component = domRender(<HistoryLog showAvatar={true} />);

          result = component.renderPastSession(log);
        });

        it('returns a single element', () => {
          expect(result.length).toEqual(1);
        });

        it('returns an element of type ChatGroup', () => {
          expect(TestUtils.isElementOfType(result[0], ChatGroup)).toEqual(true);
        });

        it('is passed the expected props', () => {
          expect(result[0].props).toEqual(jasmine.objectContaining({
            isAgent: true,
            messages: [{ display_name: 'Agent 123', timestamp: 100, nick: 'agent:123', type: 'chat.msg', msg: 'Hello' }],
            avatarPath: undefined
          }));
        });
      });
    });

    describe('when passed a log with a grouped collection of messages', () => {
      const log = {
        100: [
          { timestamp: 100, nick: 'visitor', type: 'chat.msg', msg: 'Hello' },
          { timestamp: 200, nick: 'visitor', type: 'chat.msg', msg: 'Help please' },
          { timestamp: 300, nick: 'visitor', type: 'chat.msg', msg: 'My cat is on fire' }
        ]
      };

      let result;

      beforeEach(() => {
        const component = domRender(<HistoryLog showAvatar={true} />);

        result = component.renderPastSession(log);
      });

      it('returns a single element', () => {
        expect(result.length).toEqual(1);
      });

      it('returns an element of type ChatGroup', () => {
        expect(TestUtils.isElementOfType(result[0], ChatGroup)).toEqual(true);
      });

      it('is passed the expected props', () => {
        expect(result[0].props).toEqual(jasmine.objectContaining({
          isAgent: false,
          messages: log[100],
          avatarPath: undefined
        }));
      });
    });

    describe('when passed a log with a single event', () => {
      const log = {
        100: [{ timestamp: 100, nick: 'visitor', type: 'chat.memberjoin' }]
      };

      let result;

      beforeEach(() => {
        const component = domRender(<HistoryLog showAvatar={true} />);

        result = component.renderPastSession(log);
      });

      it('returns a single element', () => {
        expect(result.length).toEqual(1);
      });

      it('returns an element of type EventMessage', () => {
        expect(TestUtils.isElementOfType(result[0], EventMessage)).toEqual(true);
      });

      it('is passed the expected props', () => {
        expect(result[0].props).toEqual(jasmine.objectContaining({
          event: { timestamp: 100, nick: 'visitor', type: 'chat.memberjoin' }
        }));
      });
    });

    describe('when passed a log with a series of messages and events', () => {
      let result;
      const log = {
        100: [{ timestamp: 100, nick: 'visitor', type: 'chat.memberjoin' }],
        200: [
          { timestamp: 200, nick: 'visitor', type: 'chat.msg', msg: 'Hello' },
          { timestamp: 300, nick: 'visitor', type: 'chat.msg', msg: 'Help please' }
        ],
        400: [{ timestamp: 400, nick: 'agent:123', type: 'chat.memberjoin' }],
        500: [
          { timestamp: 500, nick: 'agent:123', type: 'chat.msg', msg: 'Hello' },
          { timestamp: 600, nick: 'agent:123', type: 'chat.msg', msg: 'Turn it on and off again' }
        ],
        700: [{ timestamp: 700, nick: 'visitor', type: 'chat.msg', msg: 'Fixed! Thanks' }],
        800: [{ timestamp: 800, nick: 'visitor', type: 'chat.rating', new_rating: 'good' }],
        900: [{ timestamp: 900, nick: 'visitor', type: 'chat.memberleave' }]
      };

      const expectedResult = [
        { component: EventMessage, props: { event: log[100][0] }},
        { component: ChatGroup, props: { isAgent: false, messages: log[200], avatarPath: undefined }},
        { component: EventMessage, props: { event: log[400][0] }},
        { component: ChatGroup, props: { isAgent: true, messages: log[500], avatarPath: '/path/to/avatar' }},
        { component: ChatGroup, props: { isAgent: false, messages: log[700], avatarPath: undefined }},
        { component: EventMessage, props: { event: log[800][0] }},
        { component: EventMessage, props: { event: log[900][0] }}
      ];

      beforeEach(() => {
        const component = domRender(<HistoryLog agents={agents} />);

        result = component.renderPastSession(log);
      });

      it('returns a collection with the correct number of elements', () => {
        expect(result.length).toEqual(7);
      });

      it('returns a collection containing elements of the correct type', () => {
        result.forEach((element, idx) => {
          expect(TestUtils.isElementOfType(element, expectedResult[idx].component)).toEqual(true);
        });
      });

      it('passes the expected props to each component', () => {
        result.forEach((element, idx) => {
          expect(element.props).toEqual(jasmine.objectContaining(
            expectedResult[idx].props
          ));
        });
      });
    });
  });

  describe('renderDivider', () => {
    beforeEach(() => {
      const component = instanceRender(<HistoryLog />);

      component.renderDivider(1234);
    });

    it('calls formatter with timestamp and showToday option', () => {
      expect(dateTimeSpy)
        .toHaveBeenCalledWith(1234, { showToday: true });
    });
  });

  describe('render', () => {
    let result;
    const sessions = [
      {
        100: [{ timestamp: 100, nick: 'visitor', type: 'chat.memberjoin' }],
        200: [
          { timestamp: 200, nick: 'visitor', type: 'chat.msg', msg: 'Hello' },
          { timestamp: 300, nick: 'visitor', type: 'chat.msg', msg: 'Help please' }
        ]
      },
      {
        400: [{ timestamp: 400, nick: 'agent:123', type: 'chat.memberjoin' }],
        500: [
          { timestamp: 500, nick: 'agent:123', type: 'chat.msg', msg: 'Hello' },
          { timestamp: 600, nick: 'agent:123', type: 'chat.msg', msg: 'Turn it on and off again' }
        ],
        700: [{ timestamp: 700, nick: 'visitor', type: 'chat.msg', msg: 'Fixed! Thanks' }],
        800: [{ timestamp: 800, nick: 'visitor', type: 'chat.rating', new_rating: 'good' }],
        900: [{ timestamp: 900, nick: 'visitor', type: 'chat.memberleave' }]
      }
    ];

    beforeEach(() => {
      const component = domRender(<HistoryLog chatHistoryLog={sessions} agents={agents} />);

      result = component.render();
    });

    it('renders the correct number of children', () => {
      expect(result.props.children.length)
        .toEqual(2);
      expect(result.props.children[0].length)
        .toEqual(7);
    });
  });
});
