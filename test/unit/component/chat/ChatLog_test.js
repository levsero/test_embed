describe('ChatLog component', () => {
  let ChatLog,
    CHAT_MESSAGE_EVENTS,
    CHAT_SYSTEM_EVENTS,
    i18n;

  let agents = {
    'agent:123': { display_name: 'Agent123', nick: 'agent:123', typing: false, avatar_path: '/path/to/avatar'}
  };

  const chatLogPath = buildSrcPath('component/chat/ChatLog');
  const chatConstantsPath = buildSrcPath('constants/chat');

  const ChatGroup = noopReactComponent();
  const ChatEventMessage = noopReactComponent();
  const Button = noopReactComponent();

  beforeEach(() => {
    mockery.enable();

    CHAT_MESSAGE_EVENTS = requireUncached(chatConstantsPath).CHAT_MESSAGE_EVENTS;
    CHAT_SYSTEM_EVENTS = requireUncached(chatConstantsPath).CHAT_SYSTEM_EVENTS;

    i18n = {
      t: jasmine.createSpy()
    };

    initMockRegistry({
      'component/chat/ChatGroup': { ChatGroup },
      'component/chat/ChatEventMessage': { ChatEventMessage },
      'component/button/Button': { Button },
      'constants/chat': {
        CHAT_MESSAGE_EVENTS,
        CHAT_SYSTEM_EVENTS
      },
      './ChatLog.scss': {
        locals: {
          'requestRatingButton': 'requestRatingButtonStyles'
        }
      },
      'service/i18n': {
        i18n
      }
    });

    mockery.registerAllowable(chatLogPath);
    ChatLog = requireUncached(chatLogPath).ChatLog;
  });

  afterEach(() => {
    mockery.deregisterAll();
    mockery.disable();
  });

  describe('#renderChatLog', () => {
    describe('when passed an empty chat log arg', () => {
      it('returns empty array', () => {
        const component = domRender(<ChatLog showAvatar={true} chatLog={{}} agents={{}} />);
        const log = component.renderChatLog();

        expect(log).toEqual([]);
      });
    });

    describe('when passed a chat log with a single message item', () => {
      describe('from a visitor', () => {
        const chatLog = {
          100: [{ timestamp: 100, nick: 'visitor', type: 'chat.msg', msg: 'Hello' }]
        };
        let result;

        beforeEach(() => {
          const component = domRender(<ChatLog showAvatar={true} chatLog={chatLog} />);

          result = component.renderChatLog();
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
        const chatLog = {
          100: [{ timestamp: 100, nick: 'agent:123', type: 'chat.msg', display_name: 'Agent 123', msg: 'Hello' }]
        };
        let result;

        beforeEach(() => {
          const component = domRender(<ChatLog showAvatar={true} chatLog={chatLog} />);

          result = component.renderChatLog();
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

      describe('renderUpdateInfo', () => {
        let component,
          showUpdateInfo,
          updateInfoOnClickSpy;
        const chatGroup = [{ timestamp: 100, nick: 'visitor', type: 'chat.msg', msg: 'Hello' }];
        const chatLog = { 100: chatGroup };

        beforeEach(()=> {
          updateInfoOnClickSpy = jasmine.createSpy('updateInfoOnClick');
          component = instanceRender(<ChatLog showUpdateInfo={showUpdateInfo} updateInfoOnClick={updateInfoOnClickSpy} chatLog={chatLog} />);

          spyOn(component, 'renderUpdateInfo');
          component.renderChatLog();
        });

        describe('when the showUpdateInfo prop is false', () => {
          beforeAll(() => {
            showUpdateInfo = false;
            chatGroup.isFirstVisitorMessage = true;
          });

          it('is called with false and the updateInfoOnClick prop', () => {
            expect(component.renderUpdateInfo)
              .toHaveBeenCalledWith(false, updateInfoOnClickSpy);
          });
        });

        describe('when isFirstVisitorMessage on the chat group is false', () => {
          beforeAll(() => {
            showUpdateInfo = true;
            chatGroup.isFirstVisitorMessage = false;
          });

          it('is called with false and the updateInfoOnClick prop', () => {
            expect(component.renderUpdateInfo)
              .toHaveBeenCalledWith(false, updateInfoOnClickSpy);
          });
        });

        describe('when isFirstVisitorMessage on the chat group and the showUpdateInfo prop are true', () => {
          beforeAll(() => {
            showUpdateInfo = true;
            chatGroup.isFirstVisitorMessage = true;
          });

          it('is called with true and the updateInfoOnClick prop', () => {
            expect(component.renderUpdateInfo)
              .toHaveBeenCalledWith(true, updateInfoOnClickSpy);
          });
        });

        it('is called', () => {
          expect(component.renderUpdateInfo).toHaveBeenCalled();
        });
      });
    });

    describe('when passed a chat log with a grouped collection of messages', () => {
      const chatLog = {
        100: [
          { timestamp: 100, nick: 'visitor', type: 'chat.msg', msg: 'Hello' },
          { timestamp: 200, nick: 'visitor', type: 'chat.msg', msg: 'Help please' },
          { timestamp: 300, nick: 'visitor', type: 'chat.msg', msg: 'My cat is on fire' }
        ]
      };

      let result;

      beforeEach(() => {
        const component = domRender(<ChatLog showAvatar={true} chatLog={chatLog} />);

        result = component.renderChatLog();
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
          messages: chatLog[100],
          avatarPath: undefined
        }));
      });
    });

    describe('when passed a chat log with a single event', () => {
      const chatLog = {
        100: [{ timestamp: 100, nick: 'visitor', type: 'chat.memberjoin' }]
      };

      let result;

      beforeEach(() => {
        const component = domRender(<ChatLog showAvatar={true} chatLog={chatLog} />);

        result = component.renderChatLog();
      });

      it('returns a single element', () => {
        expect(result.length).toEqual(1);
      });

      it('returns an element of type ChatEventMessage', () => {
        expect(TestUtils.isElementOfType(result[0], ChatEventMessage)).toEqual(true);
      });

      it('is passed the expected props', () => {
        expect(result[0].props).toEqual(jasmine.objectContaining({
          event: { timestamp: 100, nick: 'visitor', type: 'chat.memberjoin' }
        }));
      });

      describe('renderRequestRatingButton', () => {
        let component;

        beforeEach(()=> {
          component = domRender(<ChatLog chatLog={chatLog} agents={{}} />);
          spyOn(component, 'renderRequestRatingButton');
          component.renderChatLog();
        });

        it('is called', () => {
          expect(component.renderRequestRatingButton).toHaveBeenCalled();
        });
      });
    });

    describe('when passed a chat log with a series of messages and events', () => {
      let result;
      const chatLog = {
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
        { component: ChatEventMessage, props: { event: chatLog[100][0] }},
        { component: ChatGroup, props: { isAgent: false, messages: chatLog[200], avatarPath: undefined }},
        { component: ChatEventMessage, props: { event: chatLog[400][0] }},
        { component: ChatGroup, props: { isAgent: true, messages: chatLog[500], avatarPath: '/path/to/avatar' }},
        { component: ChatGroup, props: { isAgent: false, messages: chatLog[700], avatarPath: undefined }},
        { component: ChatEventMessage, props: { event: chatLog[800][0] }},
        { component: ChatEventMessage, props: { event: chatLog[900][0] }}
      ];

      beforeEach(() => {
        const component = domRender(<ChatLog chatLog={chatLog} agents={agents} />);

        result = component.renderChatLog();
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

  describe('#renderRequestRatingButton', () => {
    let component,
      renderRequestRatingButton,
      isLastRating,
      newRating,
      event,
      chatCommentLeft,
      mockStringValues,
      goToFeedbackScreenSpy = jasmine.createSpy('goToFeedbackScreen');

    beforeEach(() => {
      component = instanceRender(<ChatLog chatLog={{}} agents={{}} lastAgentLeaveEvent={{}} />);

      mockStringValues = {
        'embeddable_framework.chat.chatLog.button.leaveComment': 'Leave a comment',
        'embeddable_framework.chat.chatLog.button.rateChat': 'Rate this chat'
      };

      i18n.t.and.callFake((key) => {
        return mockStringValues[key];
      });
    });

    describe('when the event type is not one that triggers a rating', () => {
      beforeEach(() => {
        isLastRating = true;
        chatCommentLeft = false;
        newRating = 'good';
        event = { timestamp: 100, nick: 'visitor', type: 'chat.memberjoin', new_rating: newRating, isLastRating };
        renderRequestRatingButton = component.renderRequestRatingButton(event, chatCommentLeft, goToFeedbackScreenSpy);
      });

      it('returns nothing', () => {
        expect(renderRequestRatingButton).toBeFalsy();
      });
    });

    describe('when the event type is rating', () => {
      describe('when the event.isLastRating property is false', () => {
        beforeEach(() => {
          isLastRating = false;
          chatCommentLeft = false;
          newRating = 'good';
          event = { timestamp: 100, nick: 'visitor', type: 'chat.rating', new_rating: newRating, isLastRating };
          renderRequestRatingButton = component.renderRequestRatingButton(event, chatCommentLeft, goToFeedbackScreenSpy);
        });

        it('returns nothing', () => {
          expect(renderRequestRatingButton).toBeFalsy();
        });
      });

      describe('when the event.new_rating property is falsy', () => {
        beforeEach(() => {
          isLastRating = true;
          chatCommentLeft = false;
          newRating = null;
          event = { timestamp: 100, nick: 'visitor', type: 'chat.rating', new_rating: newRating, isLastRating };
          renderRequestRatingButton = component.renderRequestRatingButton(event, chatCommentLeft, goToFeedbackScreenSpy);
        });

        it('returns nothing', () => {
          expect(renderRequestRatingButton).toBeFalsy();
        });
      });

      describe('when the chatCommentLeft prop is true', () => {
        beforeEach(() => {
          isLastRating = true;
          chatCommentLeft = true;
          newRating = 'good';
          event = { timestamp: 100, nick: 'visitor', type: 'chat.rating', new_rating: newRating, isLastRating };
          renderRequestRatingButton = component.renderRequestRatingButton(event, chatCommentLeft, goToFeedbackScreenSpy);
        });

        it('returns nothing', () => {
          expect(renderRequestRatingButton).toBeFalsy();
        });
      });

      describe('when it is the last event, has a valid rating and no comment has been left', () => {
        beforeEach(() => {
          isLastRating = true;
          chatCommentLeft = false;
          newRating = 'good';
          event = { timestamp: 100, nick: 'visitor', type: 'chat.rating', new_rating: newRating, isLastRating };
          renderRequestRatingButton = component.renderRequestRatingButton(event, chatCommentLeft, goToFeedbackScreenSpy);
        });

        it('returns a button with the correct props', () => {
          expect(renderRequestRatingButton).toBeTruthy();
          expect(renderRequestRatingButton.props).toEqual(jasmine.objectContaining(
            {
              label: mockStringValues['embeddable_framework.chat.chatLog.button.leaveComment'],
              onClick: goToFeedbackScreenSpy
            }
          ));
        });
      });
    });

    describe('when the event type is request.rating', () => {
      beforeEach(() => {
        event = { timestamp: 100, nick: 'visitor', type: 'chat.request.rating' };
        renderRequestRatingButton = component.renderRequestRatingButton(event, chatCommentLeft, goToFeedbackScreenSpy);
      });

      it('returns a button with the correct props', () => {
        expect(renderRequestRatingButton).toBeTruthy();
        expect(renderRequestRatingButton.props).toEqual(jasmine.objectContaining(
          {
            label: mockStringValues['embeddable_framework.chat.chatLog.button.rateChat'],
            onClick: goToFeedbackScreenSpy
          }
        ));
      });
    });

    describe('when agents leave the chat', () => {
      let leaveEvent = { timestamp: 400, nick: 'agent:smith', type: 'chat.memberleave' };
      let agentsLeft, chatLog;

      describe('when there are other agents left in the chat ', () => {
        agentsLeft = {
          'agent:jones': { display_name: 'AgentJones', nick: 'agent:jones', typing: false, avatar_path: '/path/to/avatar'}
        };

        chatLog = {
          100: [{ timestamp: 100, nick: 'visitor', type: 'chat.memberjoin' }],
          200: [{ timestamp: 200, nick: 'agent:smith', type: 'chat.memberjoin' }],
          250: [{ timestamp: 250, nick: 'agent:jones', type: 'chat.memberjoin' }],
          300: [{ timestamp: 300, nick: 'visitor', type: 'chat.msg', msg: 'Fixed! Thanks' }],
          400: [leaveEvent]
        };

        beforeEach(() => {
          component = instanceRender(<ChatLog chatLog={chatLog} agents={agentsLeft} lastAgentLeaveEvent={leaveEvent} />);
          renderRequestRatingButton = component.renderRequestRatingButton(leaveEvent, false, goToFeedbackScreenSpy);
        });

        it('returns nothing', () => {
          expect(renderRequestRatingButton).toBeFalsy();
        });
      });

      describe('when the very last agent leaves the chat', () => {
        chatLog = {
          100: [{ timestamp: 100, nick: 'visitor', type: 'chat.memberjoin' }],
          200: [{ timestamp: 200, nick: 'agent:smith', type: 'chat.memberjoin' }],
          300: [{ timestamp: 300, nick: 'visitor', type: 'chat.msg', msg: 'Fixed! Thanks' }],
          400: [leaveEvent]
        };

        beforeEach(() => {
          component = domRender(<ChatLog chatLog={chatLog} agents={{}} lastAgentLeaveEvent={leaveEvent} />);
          renderRequestRatingButton = component.renderRequestRatingButton(leaveEvent, false, goToFeedbackScreenSpy);
        });

        it('returns a button with the correct props', () => {
          expect(renderRequestRatingButton).toBeTruthy();
          expect(renderRequestRatingButton.props).toEqual(jasmine.objectContaining(
            {
              label: mockStringValues['embeddable_framework.chat.chatLog.button.rateChat'],
              onClick: goToFeedbackScreenSpy
            }
          ));
        });
      });
    });
  });

  describe('#renderUpdateInfo', () => {
    let component,
      mockStringValues,
      updateInfoOnClickSpy = jasmine.createSpy('updateInfoOnClick');

    beforeEach(() => {
      component = instanceRender(<ChatLog chatLog={{}} agents={{}} />);

      mockStringValues = {
        'embeddable_framework.chat.chatLog.login.updateInfo': 'Please update your info'
      };

      i18n.t.and.callFake((key) => {
        return mockStringValues[key];
      });
    });

    describe('when the showUpdateInfo argument is false', () => {
      it('returns undefined', () => {
        expect(component.renderUpdateInfo(false, updateInfoOnClickSpy))
          .toBeUndefined();
      });
    });

    describe('when the showUpdateInfo argument is true', () => {
      it('returns a div', () => {
        expect(TestUtils.isElementOfType(component.renderUpdateInfo(true, updateInfoOnClickSpy), 'div'))
          .toEqual(true);
      });

      it('returns an element with onClick set to the updateInfoOnClick argument', () => {
        expect(component.renderUpdateInfo(true, updateInfoOnClickSpy).props.onClick)
          .toEqual(updateInfoOnClickSpy);
      });

      it('returns an element containing the correct text as a child', () => {
        expect(component.renderUpdateInfo(true, updateInfoOnClickSpy).props)
          .toEqual(
            jasmine.objectContaining({
              children: mockStringValues['embeddable_framework.chat.chatLog.login.updateInfo']
            })
          );
      });
    });
  });
});
