describe('blip middleware', () => {
  let sendBlips,
    beaconSpy,
    i18nSpy;
  const TALK_CALLBACK_SUCCESS = 'widget/talk/TALK_CALLBACK_SUCCESS';
  const UPDATE_ACTIVE_EMBED = 'widget/base/UPDATE_ACTIVE_EMBED';
  const ARTICLE_CLICKED = 'widget/helpCenter/ARTICLE_CLICKED';
  const ORIGINAL_ARTICLE_CLICKED = 'widget/helpCenter/ORIGINAL_ARTICLE_CLICKED';
  const SEARCH_REQUEST_SUCCESS = 'widget/helpCenter/SEARCH_REQUEST_SUCCESS';
  const SEARCH_REQUEST_FAILURE = 'widget/helpCenter/SEARCH_REQUEST_FAILURE';
  const ARTICLE_SHOWN = 'widget/answerBot/ARTICLE_SHOWN';
  const UPDATE_WIDGET_SHOWN = 'widget/base/UPDATE_WIDGET_SHOWN';
  const SCREEN_CHANGED = 'widget/answerBot/SCREEN_CHANGED';
  const ZOPIM_ON_OPEN = 'widget/zopim_chat/ZOPIM_ON_OPEN';

  beforeEach(() => {
    const blipPath = buildSrcPath('redux/middleware/blip');

    beaconSpy = jasmine.createSpyObj('beacon', ['trackUserAction']);
    i18nSpy = jasmine.createSpyObj('i18n', ['getLocale']);
    i18nSpy.getLocale.and.callFake(() => 'US');

    mockery.enable();
    initMockRegistry({
      'service/beacon': {
        beacon: beaconSpy
      },
      'service/i18n': {
        i18n: i18nSpy
      },
      'src/redux/modules/talk/talk-selectors': {
        getEmbeddableConfig: _.identity,
        getAgentAvailability: (prevState) => prevState.agentAvailability,
        getFormState: _.identity,
        getAverageWaitTime: (prevState) => prevState.averageWaitTime
      },
      'src/redux/modules/chat/chat-selectors': {
        getIsChatting: (prevState) => prevState.isChatting
      },
      'src/redux/modules/zopimChat/zopimChat-action-types': {
        ZOPIM_ON_OPEN: ZOPIM_ON_OPEN
      },
      'src/redux/modules/base/base-selectors': {
        getWebWidgetVisible: (prevState) => prevState.webWidgetVisible,
        getActiveEmbed: (prevState) => prevState.activeEmbed
      },
      'src/redux/modules/helpCenter/helpCenter-selectors': {
        getTotalUserSearches: (prevState) => prevState.totalUserSearches,
        getSearchTerm: (prevState) => prevState.searchTerm,
        getResultsCount: (prevState) => prevState.resultsCount,
        getArticleClicked: (prevState) => prevState.articleClicked,
        getActiveArticle: (prevState) => prevState.activeArticle,
        getHasContextuallySearched: (prevState) => prevState.hasContextuallySearched
      },
      'src/redux/modules/talk/talk-action-types': {
        TALK_CALLBACK_SUCCESS: TALK_CALLBACK_SUCCESS
      },
      'src/redux/modules/helpCenter/helpCenter-action-types': {
        'ARTICLE_CLICKED': ARTICLE_CLICKED,
        'ORIGINAL_ARTICLE_CLICKED': ORIGINAL_ARTICLE_CLICKED,
        'SEARCH_REQUEST_SUCCESS': SEARCH_REQUEST_SUCCESS,
        'SEARCH_REQUEST_FAILURE': SEARCH_REQUEST_FAILURE
      },
      'src/redux/modules/base/base-action-types': {
        UPDATE_ACTIVE_EMBED: UPDATE_ACTIVE_EMBED,
        UPDATE_WIDGET_SHOWN: UPDATE_WIDGET_SHOWN
      },
      'src/redux/modules/answerBot/sessions/selectors': {
        getSessionByID: (prevState, id) => prevState.sessions.get(id)
      },
      'src/redux/modules/answerBot/root/selectors': {
        getCurrentQuery: (prevState) => prevState.query,
        getCurrentDeflection: (prevState) => prevState.deflection,
        getCurrentArticleID: (prevState) => prevState.articleID,
        getCurrentScreen: (prevState) => prevState.currentScreen
      },
      'src/redux/modules/answerBot/root/action-types': {
        ARTICLE_SHOWN: ARTICLE_SHOWN,
        SCREEN_CHANGED: SCREEN_CHANGED
      },
      'src/constants/answerBot': {
        ARTICLE_SCREEN: 'article',
        CONVERSATION_SCREEN: 'conversation'
      }
    });

    sendBlips = requireUncached(blipPath).sendBlips;
  });

  afterAll(() => {
    mockery.disable();
    mockery.deregisterAll();
  });

  describe('sendBlips', () => {
    let action,
      nextSpy;

    describe('next', () => {
      beforeEach(() => {
        const flatState = {};

        nextSpy = jasmine.createSpy('nextSpy');
        action = { type: 'random_type' };
        sendBlips({ getState: () => flatState })(nextSpy)(action);
      });

      it('calls next function', () => {
        expect(nextSpy)
          .toHaveBeenCalledWith({ type: 'random_type' });
      });
    });

    describe('action has type SCREEN_CHANGED', () => {
      let mockCurrentScreen,
        mockPayload;

      beforeEach(() => {
        beaconSpy.trackUserAction.calls.reset();
        action = { type: SCREEN_CHANGED, payload: mockPayload };
        nextSpy = jasmine.createSpy('nextSpy');

        const flatState = {
          currentScreen: mockCurrentScreen
        };

        sendBlips({ getState: () => flatState })(nextSpy)(action);
      });

      describe('when the previous answerBot screen is article', () => {
        beforeAll(() => {
          mockPayload = 'conversation';
          mockCurrentScreen = 'article';
        });

        it('calls trackUserAction', () => {
          expect(beaconSpy.trackUserAction)
            .toHaveBeenCalledWith('answerBot', 'userNavigation', 'journey', { from: 'article', to: 'conversation' });
        });
      });

      describe('when the previous answerBot screen is not article', () => {
        beforeAll(() => {
          mockPayload = 'article';
          mockCurrentScreen = 'conversation';
        });

        it('does not call trackUserAction', () => {
          expect(beaconSpy.trackUserAction)
            .not.toHaveBeenCalled();
        });
      });
    });

    describe('action has type TALK_CALLBACK_SUCCESS', () => {
      beforeEach(() => {
        beaconSpy.trackUserAction.calls.reset();
        action = { type: TALK_CALLBACK_SUCCESS };
        nextSpy = jasmine.createSpy('nextSpy');
        const flatState = {
          phone: '+61430919721',
          name: 'Johnny',
          email: 'Johnny@john.com',
          description: 'Please help me.',
          nickname: 'Support',
          supportedCountries: '1, 10, 9, 89',
          averageWaitTime: 10,
          agentAvailability: true
        };

        sendBlips({ getState: () => flatState })(nextSpy)(action);
      });

      it('calls trackUserAction with the correct params', () => {
        const expectedValue = {
          supportedCountries: '1, 10, 9, 89',
          nickname: 'Support',
          phoneNumber: '+61430919721',
          averageWaitTime: 10,
          agentAvailability: true,
          user: {
            name: 'Johnny',
            email: 'Johnny@john.com',
            description: 'Please help me.'
          },
          locale: 'US'
        };

        expect(beaconSpy.trackUserAction)
          .toHaveBeenCalledWith('talk', 'request', 'callbackForm', expectedValue);
      });
    });

    describe('action has type ZOPIM_ON_OPEN', () => {
      describe('when called once', () => {
        beforeEach(() => {
          action = {
            type: ZOPIM_ON_OPEN
          };

          beaconSpy.trackUserAction.calls.reset();
          nextSpy = jasmine.createSpy('nextSpy');
          sendBlips({ getState: () => { } })(nextSpy)(action);
        });

        it('calls trackUserAction', () => {
          expect(beaconSpy.trackUserAction.calls.count())
            .toEqual(1);
          expect(beaconSpy.trackUserAction).toHaveBeenCalledWith('chat', 'opened', 'zopimChat');
        });
      });

      describe('when called twice', () => {
        beforeEach(() => {
          action = {
            type: ZOPIM_ON_OPEN
          };

          beaconSpy.trackUserAction.calls.reset();
          nextSpy = jasmine.createSpy('nextSpy');
          sendBlips({ getState: () => { } })(nextSpy)(action);
          sendBlips({ getState: () => { } })(nextSpy)(action);
        });

        it('calls trackUserAction only once', () => {
          expect(beaconSpy.trackUserAction.calls.count())
            .toEqual(1);
          expect(beaconSpy.trackUserAction).toHaveBeenCalledWith('chat', 'opened', 'zopimChat');
        });
      });
    });

    describe('action has type UPDATE_ACTIVE_EMBED', () => {
      let flatState,
        mockChatEmbed,
        mockIsChatting,
        mockWebWidgetVisible,
        mockActiveEmbed,
        mockDeflection,
        mockQuery,
        payload;

      beforeEach(() => {
        flatState = {
          phoneNumber: '+61430919721',
          nickname: 'Support',
          supportedCountries: '1, 10, 9, 89',
          averageWaitTime: 10,
          agentAvailability: true,
          chatEmbed: mockChatEmbed,
          isChatting: mockIsChatting,
          webWidgetVisible: mockWebWidgetVisible,
          activeEmbed: mockActiveEmbed,
          deflection: mockDeflection,
          query: mockQuery
        };

        beaconSpy.trackUserAction.calls.reset();
        nextSpy = jasmine.createSpy('nextSpy');

        action = {
          type: UPDATE_ACTIVE_EMBED,
          payload
        };
        sendBlips({ getState: () => flatState })(nextSpy)(action);
      });

      describe('when chatting', () => {
        beforeAll(() => {
          mockIsChatting = true;
        });

        it('does not send chatOpened blip', () => {
          expect(beaconSpy.trackUserAction)
            .not
            .toHaveBeenCalled();
        });
      });

      describe('when not chatting', () => {
        beforeAll(() => {
          mockIsChatting = false;
        });

        describe('payload is zopimChat', () => {
          beforeAll(() => {
            payload = 'zopimChat';
          });

          it('does not send chatOpened blip', () => {
            expect(beaconSpy.trackUserAction)
              .not
              .toHaveBeenCalled();
          });
        });

        describe('payload is chat', () => {
          beforeAll(() => {
            payload = 'chat';
            mockWebWidgetVisible = false;
          });

          it('does not send chatOpened blip', () => {
            expect(beaconSpy.trackUserAction)
              .not
              .toHaveBeenCalled();
          });

          describe('web widget is visible', () => {
            beforeAll(() => {
              mockWebWidgetVisible = true;
            });

            it('calls trackUserAction with the correct params', () => {
              expect(beaconSpy.trackUserAction)
                .toHaveBeenCalledWith('chat', 'opened', 'newChat');
            });
          });
        });
      });

      describe('payload is talk', () => {
        beforeAll(() => {
          payload = 'talk';
          mockWebWidgetVisible = false;
        });

        it('does not send talkOpened blip', () => {
          expect(beaconSpy.trackUserAction)
            .not
            .toHaveBeenCalled();
        });

        describe('web widget is visible', () => {
          beforeAll(() => {
            mockWebWidgetVisible = true;
          });

          it('calls trackUserAction with the correct params', () => {
            const expectedValue = {
              supportedCountries: '1, 10, 9, 89',
              nickname: 'Support',
              phoneNumber: '+61430919721',
              averageWaitTime: 10,
              agentAvailability: true,
              locale: 'US'
            };

            expect(beaconSpy.trackUserAction)
              .toHaveBeenCalledWith('talk', 'opened', 'phoneNumber', expectedValue);
          });
        });
      });

      describe('channel choice blip', () => {
        describe('not answerBot context', () => {
          beforeAll(() => {
            payload = 'helpCenterForm';
            mockWebWidgetVisible = true;
            mockActiveEmbed = 'helpCenterForm';
          });

          it('does not call trackUserAction', () => {
            expect(beaconSpy.trackUserAction)
              .not.toHaveBeenCalled();
          });
        });

        describe('answerBot context', () => {
          beforeAll(() => {
            payload = 'chat';
            mockDeflection = { id: 23 };
            mockQuery = 'hello world';
            mockWebWidgetVisible = true;
            mockActiveEmbed = 'answerBot';
          });

          it('calls trackUserAction with the correct params', () => {
            const expectedValue = {
              query: 'hello world',
              deflectionId: 23,
              channel: 'chat'
            };

            expect(beaconSpy.trackUserAction)
              .toHaveBeenCalledWith('answerBot', 'channelClicked', 'channelChoice', expectedValue);
          });
        });
      });
    });

    describe('action has type ARTICLE_CLICKED', () => {
      let flatState;

      beforeEach(() => {
        flatState = {
          searchTerm: 'i made a query...',
          resultsCount: 5,
          articleClicked: false,
          hasContextuallySearched: false
        };

        beaconSpy.trackUserAction.calls.reset();
        nextSpy = jasmine.createSpy('nextSpy');
      });

      describe('latest article is not null', () => {
        beforeEach(() => {
          action = {
            type: ARTICLE_CLICKED,
            payload: { id: 121212112 }
          };
          sendBlips({ getState: () => flatState })(nextSpy)(action);
        });

        it('calls trackUserAction with the correct params', () => {
          const expectedValue = {
            query: 'i made a query...',
            resultsCount: 3,
            uniqueSearchResultClick: true,
            articleId: 121212112,
            locale: 'US',
            contextualSearch: false
          };

          expect(beaconSpy.trackUserAction)
            .toHaveBeenCalledWith('helpCenter', 'click', 'helpCenterForm', expectedValue);
        });
      });

      describe('latest article is null', () => {
        beforeEach(() => {
          action = {
            type: ARTICLE_CLICKED,
            payload: null
          };
          sendBlips({ getState: () => flatState })(nextSpy)(action);
        });

        it('does not call trackUserAction', () => {
          expect(beaconSpy.trackUserAction)
            .not.toHaveBeenCalled();
        });
      });
    });

    describe('action has type SEARCH_REQUEST_SUCCESS', () => {
      let flatState;

      beforeEach(() => {
        beaconSpy.trackUserAction.calls.reset();
        nextSpy = jasmine.createSpy('nextSpy');
      });

      describe('total user searches previously is 0', () => {
        beforeEach(() => {
          flatState = {
            totalUserSearches: 0,
            searchTerm: 'i made a query...'
          };
          action = {
            type: SEARCH_REQUEST_SUCCESS
          };
          sendBlips({ getState: () => flatState })(nextSpy)(action);
        });

        it('calls trackUserAction with the correct params', () => {
          expect(beaconSpy.trackUserAction)
            .toHaveBeenCalledWith('helpCenter', 'search', 'helpCenterForm', 'i made a query...');
        });
      });

      describe('total searches previously is not 0', () => {
        beforeEach(() => {
          flatState = {
            totalUserSearches: 100,
            searchTerm: 'i made a query...'
          };
          action = {
            type: SEARCH_REQUEST_SUCCESS
          };
          sendBlips({ getState: () => flatState })(nextSpy)(action);
        });

        it('does not call trackUserAction', () => {
          expect(beaconSpy.trackUserAction)
            .not.toHaveBeenCalled();
        });
      });
    });

    describe('action has type SEARCH_REQUEST_FAILURE', () => {
      let flatState;

      beforeEach(() => {
        beaconSpy.trackUserAction.calls.reset();
        nextSpy = jasmine.createSpy('nextSpy');
      });

      describe('total user searches previously is 0', () => {
        beforeEach(() => {
          flatState = {
            totalUserSearches: 0,
            searchTerm: 'i made a query...'
          };
          action = {
            type: SEARCH_REQUEST_FAILURE
          };
          sendBlips({ getState: () => flatState })(nextSpy)(action);
        });

        it('calls trackUserAction with the correct params', () => {
          expect(beaconSpy.trackUserAction)
            .toHaveBeenCalledWith('helpCenter', 'search', 'helpCenterForm', 'i made a query...');
        });
      });

      describe('total searches previously is not 0', () => {
        beforeEach(() => {
          flatState = {
            totalUserSearches: 100,
            searchTerm: 'i made a query...'
          };
          action = {
            type: SEARCH_REQUEST_FAILURE
          };
          sendBlips({ getState: () => flatState })(nextSpy)(action);
        });

        it('does not call trackUserAction', () => {
          expect(beaconSpy.trackUserAction)
            .not.toHaveBeenCalled();
        });
      });
    });

    describe('action has type ORIGINAL_ARTICLE_CLICKED', () => {
      let flatState;

      beforeEach(() => {
        beaconSpy.trackUserAction.calls.reset();
        nextSpy = jasmine.createSpy('nextSpy');
        flatState = {
          activeArticle: { id: 1213211232123 },
          resultsCount: 1,
          searchTerm: 'i made a query...',
          articleClicked: true,
          hasContextuallySearched: true
        };
        action = {
          type: ORIGINAL_ARTICLE_CLICKED
        };
        sendBlips({ getState: () => flatState })(nextSpy)(action);
      });

      it('calls trackUserAction with the correct params', () => {
        const expectedValue = {
          query: 'i made a query...',
          resultsCount: 1,
          uniqueSearchResultClick: false,
          articleId: 1213211232123,
          locale: 'US',
          contextualSearch: true
        };

        expect(beaconSpy.trackUserAction)
          .toHaveBeenCalledWith('helpCenter', 'viewOriginalArticle', 'helpCenterForm', expectedValue);
      });
    });

    describe('action does not have any relevant action type', () => {
      beforeEach(() => {
        beaconSpy.trackUserAction.calls.reset();
        action = { type: 'random_type' };
        sendBlips({ getState: () => ({}) })(nextSpy)(action);
      });

      it('does not call trackUserAction', () => {
        expect(beaconSpy.trackUserAction)
          .not.toHaveBeenCalled();
      });
    });

    describe('action has type ARTICLE_SHOWN', () => {
      let flatState;

      beforeEach(() => {
        beaconSpy.trackUserAction.calls.reset();
        nextSpy = jasmine.createSpy('nextSpy');
        flatState = {
          sessions: new Map([
            [123, { deflection: { id: 9 }, query: 'test', articles: [1, 2] }],
            [789, { deflection: { id: 3 }, query: 'two', articles: [1] }]
          ])
        };
        action = {
          type: ARTICLE_SHOWN,
          payload: {
            sessionID: 123,
            articleID: 456
          }
        };
        sendBlips({ getState: () => flatState })(nextSpy)(action);
      });

      it('calls trackUserAction with the correct params', () => {
        const expectedValue = {
          query: 'test',
          resultsCount: 2,
          articleId: 456,
          locale: 'US',
          deflectionId: 9,
          answerBot: true,
          uniqueSearchResultClick: false
        };

        expect(beaconSpy.trackUserAction)
          .toHaveBeenCalledWith('helpCenter', 'click', 'helpCenterForm', expectedValue);
      });
    });

    describe('action has type UPDATE_WIDGET_SHOWN', () => {
      beforeEach(() => {
        beaconSpy.trackUserAction.calls.reset();
        nextSpy = jasmine.createSpy('nextSpy');
      });

      describe('with payload that is not false', () => {
        beforeEach(() => {
          action = {
            type: UPDATE_WIDGET_SHOWN,
            payload: true
          };
          sendBlips({ getState: () => {} })(nextSpy)(action);
        });

        it('does not call trackUserAction', () => {
          expect(beaconSpy.trackUserAction)
            .not.toHaveBeenCalled();
        });
      });

      describe('with payload that is false', () => {
        let flatState;

        describe('currentScreen is article', () => {
          beforeAll(() => {
            flatState = {
              currentScreen: 'article',
              articleID: 421
            };
          });

          beforeEach(() => {
            action = {
              type: UPDATE_WIDGET_SHOWN,
              payload: false
            };
            sendBlips({ getState: () => flatState })(nextSpy)(action);
          });

          it('calls trackUserAction with the expected value', () => {
            expect(beaconSpy.trackUserAction)
              .toHaveBeenCalledWith('answerBot', 'articleClosed', 'helpCenterForm', { articleId: 421 });
          });
        });

        describe('currentScreen is not article', () => {
          beforeAll(() => {
            flatState = { currentScreen: 'convo' };
          });

          beforeEach(() => {
            action = {
              type: UPDATE_WIDGET_SHOWN,
              payload: false
            };
            sendBlips({ getState: () => flatState })(nextSpy)(action);
          });

          it('does not call trackUserAction', () => {
            expect(beaconSpy.trackUserAction)
              .not.toHaveBeenCalled();
          });
        });
      });
    });
  });
});
