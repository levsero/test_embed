describe('ChatEventMessage component', () => {
  let ChatEventMessage,
    mockRegistry;

  const chatEventMessagePath = buildSrcPath('component/chat/ChatEventMessage');

  beforeEach(() => {
    mockery.enable();

    mockRegistry = initMockRegistry({
      './ChatEventMessage.scss': {
        locals: {
          'eventMessage': 'eventMessageStyles'
        }
      },
      'service/i18n': {
        i18n: {
          t: jasmine.createSpy()
        }
      }
    });

    mockery.registerAllowable(chatEventMessagePath);
    ChatEventMessage = requireUncached(chatEventMessagePath).ChatEventMessage;
  });

  afterEach(() => {
    mockery.deregisterAll();
    mockery.disable();
  });

  describe('#renderEventMessage', () => {
    const testCases = [
      { description: 'member joined event from a visitor',
        event: { nick: 'visitor', type: 'chat.memberjoin' },
        expectedString: 'embeddable_framework.chat.chatLog.chatStarted'
      },
      { description: 'member joined event from an agent',
        event: { nick: 'agent123', display_name: 'Agent 123', type: 'chat.memberjoin' },
        expectedString: 'embeddable_framework.chat.chatLog.agentJoined',
        expectedArgs: { agent: 'Agent 123' }
      },
      { description: 'member left event from a visitor',
        event: { nick: 'visitor', type: 'chat.memberleave' },
        expectedString: 'embeddable_framework.chat.chatLog.chatEnded'
      },
      { description: 'member left event from an agent',
        event: { nick: 'agent123', display_name: 'Agent 123', type: 'chat.memberleave' },
        expectedString: 'embeddable_framework.chat.chatLog.agentLeft',
        expectedArgs: { agent: 'Agent 123' }
      },
      { description: 'rating event with no rating value',
        event: { nick: 'visitor', type: 'chat.rating' },
        expectedString: 'embeddable_framework.chat.chatLog.rating.removed'
      }
    ];

    testCases.forEach((testCase) => {
      describe(`when passed a ${testCase.description}`, () => {
        beforeEach(() => {
          domRender(<ChatEventMessage event={testCase.event} />);
        });

        it('returns the appropriate string', () => {
          expect(mockRegistry['service/i18n'].i18n.t.calls.mostRecent().args[0])
            .toEqual(testCase.expectedString);

          if (testCase.expectedArgs) {
            expect(mockRegistry['service/i18n'].i18n.t.calls.mostRecent().args[1])
              .toEqual(jasmine.objectContaining(testCase.expectedArgs));
          }
        });
      });
    });

    const ratingTestCases = [
      { description: 'rating event with a "good" rating value',
        event: { nick: 'visitor', type: 'chat.rating', new_rating: 'good' },
        expectedString: 'embeddable_framework.chat.chatLog.rating.description',
        expectedArgs: { value: 'Good' }
      },
      { description: 'rating event with a "bad" rating value',
        event: { nick: 'visitor', type: 'chat.rating', new_rating: 'bad' },
        expectedString: 'embeddable_framework.chat.chatLog.rating.description',
        expectedArgs: { value: 'Bad' }
      }
    ];

    ratingTestCases.forEach((testCase) => {
      describe(`when passed a ${testCase.description}`, () => {
        beforeEach(() => {
          const mockStringValues = {
            'embeddable_framework.chat.chatLog.rating.good': 'Good',
            'embeddable_framework.chat.chatLog.rating.bad': 'Bad'
          };

          mockRegistry['service/i18n'].i18n.t.and.callFake((key) => {
            return mockStringValues[key];
          });

          domRender(<ChatEventMessage event={testCase.event} />);
        });

        it('returns the appropriate string', () => {
          expect(mockRegistry['service/i18n'].i18n.t.calls.mostRecent().args[0])
            .toEqual(testCase.expectedString);

          if (testCase.expectedArgs) {
            expect(mockRegistry['service/i18n'].i18n.t.calls.mostRecent().args[1])
              .toEqual(jasmine.objectContaining(testCase.expectedArgs));
          }
        });
      });
    });
  });

  describe('#render', () => {
    let componentNode;
    const event = { nick: 'visitor', type: 'chat.memberjoin', timestamp: 123456789 };

    beforeEach(() => {
      mockRegistry['service/i18n'].i18n.t.and.returnValue('Chat started');
      const component = domRender(<ChatEventMessage event={event} />);

      componentNode = ReactDOM.findDOMNode(component);
    });

    it('wraps the translated event message in a container with styles', () => {
      expect(componentNode.textContent)
        .toEqual('Chat started');

      expect(componentNode.className)
        .toEqual('eventMessageStyles');
    });
  });
});
