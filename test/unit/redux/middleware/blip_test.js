describe('blip middleware', () => {
  let sendBlips, beaconSpy, i18nSpy
  const TALK_CALLBACK_SUCCESS = 'widget/talk/TALK_CALLBACK_SUCCESS'
  const UPDATE_ACTIVE_EMBED = 'widget/base/UPDATE_ACTIVE_EMBED'
  const ARTICLE_VIEWED = 'widget/helpCenter/ARTICLE_VIEWED'
  const ORIGINAL_ARTICLE_CLICKED = 'widget/helpCenter/ORIGINAL_ARTICLE_CLICKED'
  const SEARCH_REQUEST_SUCCESS = 'widget/helpCenter/SEARCH_REQUEST_SUCCESS'
  const SEARCH_REQUEST_FAILURE = 'widget/helpCenter/SEARCH_REQUEST_FAILURE'
  const ARTICLE_SHOWN = 'widget/answerBot/ARTICLE_SHOWN'
  const CONTEXTUAL_ARTICLE_SHOWN = 'widget/answerBot/CONTEXTUAL_ARTICLE_SHOWN'
  const UPDATE_WIDGET_SHOWN = 'widget/base/UPDATE_WIDGET_SHOWN'
  const SCREEN_CHANGED = 'widget/answerBot/SCREEN_CHANGED'
  const LAUNCHER_CLICKED = 'widget/base/LAUNCHER_CLICKED'
  const CHAT_STARTED = 'widget/chat/CHAT_STARTED'

  beforeEach(() => {
    const blipPath = buildSrcPath('redux/middleware/blip')

    beaconSpy = jasmine.createSpyObj('beacon', ['trackUserAction'])
    i18nSpy = jasmine.createSpyObj('i18n', ['getLocale'])
    i18nSpy.getLocale.and.callFake(() => 'US')

    mockery.enable()
    initMockRegistry({
      'service/beacon': {
        beacon: beaconSpy
      },
      'service/i18n': {
        i18n: i18nSpy
      },
      'src/redux/modules/talk/talk-selectors': {
        getEmbeddableConfig: _.identity,
        getAgentAvailability: prevState => prevState.agentAvailability,
        getFormState: _.identity,
        getAverageWaitTime: prevState => prevState.averageWaitTime
      },
      'src/redux/modules/chat/chat-selectors': {
        getIsChatting: prevState => prevState.isChatting
      },
      'src/redux/modules/base/base-selectors': {
        getWebWidgetVisible: prevState => prevState.webWidgetVisible,
        getActiveEmbed: prevState => prevState.activeEmbed
      },
      'embeds/helpCenter/selectors': {
        getTotalUserSearches: prevState => prevState.totalUserSearches,
        getSearchTerm: prevState => prevState.searchTerm,
        getResultsCount: prevState => prevState.resultsCount,
        getArticleClicked: prevState => prevState.articleClicked,
        getCurrentActiveArticle: prevState => prevState.activeArticle,
        getHasContextuallySearched: prevState => prevState.hasContextuallySearched
      },
      'src/redux/modules/talk/talk-action-types': {
        TALK_CALLBACK_SUCCESS: TALK_CALLBACK_SUCCESS
      },
      'src/embeds/helpCenter/actions/action-types': {
        ARTICLE_VIEWED: ARTICLE_VIEWED,
        ORIGINAL_ARTICLE_CLICKED: ORIGINAL_ARTICLE_CLICKED,
        SEARCH_REQUEST_SUCCESS: SEARCH_REQUEST_SUCCESS,
        SEARCH_REQUEST_FAILURE: SEARCH_REQUEST_FAILURE
      },
      'src/redux/modules/answerBot/article/action-types': {
        ANSWER_BOT_ORIGINAL_ARTICLE_CLICKED: 'ANSWER_BOT_ORIGINAL_ARTICLE_CLICKED'
      },
      'src/redux/modules/base/base-action-types': {
        UPDATE_ACTIVE_EMBED,
        UPDATE_WIDGET_SHOWN,
        LAUNCHER_CLICKED
      },
      'src/redux/modules/answerBot/sessions/selectors': {
        getSessionByID: (prevState, id) => prevState.sessions.get(id)
      },
      'src/redux/modules/answerBot/root/selectors': {
        getCurrentQuery: prevState => prevState.query,
        getCurrentDeflection: prevState => prevState.deflection,
        getCurrentArticleID: prevState => prevState.articleID,
        getCurrentScreen: prevState => prevState.currentScreen
      },
      'src/redux/modules/answerBot/root/action-types': {
        ARTICLE_SHOWN: ARTICLE_SHOWN,
        SCREEN_CHANGED: SCREEN_CHANGED,
        CONTEXTUAL_ARTICLE_SHOWN
      },
      'src/constants/answerBot': {
        ARTICLE_SCREEN: 'article',
        CONVERSATION_SCREEN: 'conversation'
      },
      'src/redux/modules/selectors': {
        getDefaultSelectedDepartment: state => state.department
      },
      'src/redux/modules/chat/chat-action-types': {
        CHAT_STARTED
      }
    })

    sendBlips = requireUncached(blipPath).sendBlips
  })

  afterAll(() => {
    mockery.disable()
    mockery.deregisterAll()
  })

  describe('sendBlips', () => {
    let action, nextSpy

    describe('next', () => {
      beforeEach(() => {
        const flatState = {}

        nextSpy = jasmine.createSpy('nextSpy')
        action = { type: 'random_type' }
        sendBlips({ getState: () => flatState })(nextSpy)(action)
      })

      it('calls next function', () => {
        expect(nextSpy).toHaveBeenCalledWith({ type: 'random_type' })
      })
    })

    describe('action has type SCREEN_CHANGED', () => {
      let mockCurrentScreen, mockPayload

      beforeEach(() => {
        beaconSpy.trackUserAction.calls.reset()
        action = { type: SCREEN_CHANGED, payload: mockPayload }
        nextSpy = jasmine.createSpy('nextSpy')

        const flatState = {
          currentScreen: mockCurrentScreen
        }

        sendBlips({ getState: () => flatState })(nextSpy)(action)
      })

      describe('when the previous answerBot screen is article', () => {
        beforeAll(() => {
          mockPayload = 'conversation'
          mockCurrentScreen = 'article'
        })

        it('calls trackUserAction', () => {
          expect(beaconSpy.trackUserAction).toHaveBeenCalledWith('answerBot', 'userNavigation', {
            label: 'journey',
            value: { from: 'article', to: 'conversation' }
          })
        })
      })

      describe('when the previous answerBot screen is not article', () => {
        beforeAll(() => {
          mockPayload = 'article'
          mockCurrentScreen = 'conversation'
        })

        it('does not call trackUserAction', () => {
          expect(beaconSpy.trackUserAction).not.toHaveBeenCalled()
        })
      })
    })

    describe('action has type TALK_CALLBACK_SUCCESS', () => {
      beforeEach(() => {
        beaconSpy.trackUserAction.calls.reset()
        action = { type: TALK_CALLBACK_SUCCESS }
        nextSpy = jasmine.createSpy('nextSpy')
        const flatState = {
          phone: '+61430919721',
          name: 'Johnny',
          email: 'Johnny@john.com',
          description: 'Please help me.',
          nickname: 'Support',
          supportedCountries: '1, 10, 9, 89',
          averageWaitTime: 10,
          agentAvailability: true
        }

        sendBlips({ getState: () => flatState })(nextSpy)(action)
      })

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
        }

        expect(beaconSpy.trackUserAction).toHaveBeenCalledWith('talk', 'request', {
          label: 'callbackForm',
          value: expectedValue
        })
      })
    })

    describe('action has type LAUNCHER_CLICKED', () => {
      describe('when called once', () => {
        beforeEach(() => {
          action = {
            type: LAUNCHER_CLICKED
          }

          beaconSpy.trackUserAction.calls.reset()
          nextSpy = jasmine.createSpy('nextSpy')
          sendBlips({ getState: () => ({ activeEmbed: 'answerBot' }) })(nextSpy)(action)
        })

        it('calls trackUserAction with the correct params', () => {
          expect(beaconSpy.trackUserAction).toHaveBeenCalledWith('launcher', 'click', {
            label: 'launcher',
            value: { embedOpen: 'answerBot' }
          })
        })
      })
    })

    describe('action has type UPDATE_ACTIVE_EMBED', () => {
      let flatState,
        mockChatEmbed,
        mockIsChatting,
        mockWebWidgetVisible,
        mockActiveEmbed,
        mockDeflection,
        mockQuery,
        payload

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
        }

        beaconSpy.trackUserAction.calls.reset()
        nextSpy = jasmine.createSpy('nextSpy')

        action = {
          type: UPDATE_ACTIVE_EMBED,
          payload
        }
        sendBlips({ getState: () => flatState })(nextSpy)(action)
      })

      describe('when chatting', () => {
        beforeAll(() => {
          mockIsChatting = true
        })

        it('does not send chatOpened blip', () => {
          expect(beaconSpy.trackUserAction).not.toHaveBeenCalled()
        })
      })

      describe('when not chatting', () => {
        beforeAll(() => {
          mockIsChatting = false
        })

        describe('payload is chat', () => {
          beforeAll(() => {
            payload = 'chat'
            mockWebWidgetVisible = false
          })

          it('does not send chatOpened blip', () => {
            expect(beaconSpy.trackUserAction).not.toHaveBeenCalled()
          })

          describe('web widget is visible', () => {
            beforeAll(() => {
              mockWebWidgetVisible = true
            })

            it('calls trackUserAction with the correct params', () => {
              expect(beaconSpy.trackUserAction).toHaveBeenCalledWith('chat', 'opened', {
                label: 'newChat'
              })
            })
          })
        })
      })

      describe('payload is talk', () => {
        beforeAll(() => {
          payload = 'talk'
          mockWebWidgetVisible = false
        })

        it('does not send talkOpened blip', () => {
          expect(beaconSpy.trackUserAction).not.toHaveBeenCalled()
        })

        describe('web widget is visible', () => {
          beforeAll(() => {
            mockWebWidgetVisible = true
          })

          it('calls trackUserAction with the correct params', () => {
            const expectedValue = {
              supportedCountries: '1, 10, 9, 89',
              nickname: 'Support',
              phoneNumber: '+61430919721',
              averageWaitTime: 10,
              agentAvailability: true,
              locale: 'US'
            }

            expect(beaconSpy.trackUserAction).toHaveBeenCalledWith('talk', 'opened', {
              label: 'phoneNumber',
              value: expectedValue
            })
          })
        })
      })

      describe('channel choice blip', () => {
        describe('not answerBot context', () => {
          beforeAll(() => {
            payload = 'helpCenterForm'
            mockWebWidgetVisible = true
            mockActiveEmbed = 'helpCenterForm'
          })

          it('does not call trackUserAction', () => {
            expect(beaconSpy.trackUserAction).not.toHaveBeenCalled()
          })
        })

        describe('answerBot context', () => {
          beforeAll(() => {
            payload = 'chat'
            mockDeflection = { id: 23 }
            mockQuery = 'hello world'
            mockWebWidgetVisible = true
            mockActiveEmbed = 'answerBot'
          })

          it('calls trackUserAction with the correct params', () => {
            const expectedValue = {
              query: 'hello world',
              deflectionId: 23,
              channel: 'chat'
            }

            expect(beaconSpy.trackUserAction).toHaveBeenCalledWith('answerBot', 'channelClicked', {
              label: 'channelChoice',
              value: expectedValue
            })
          })
        })
      })
    })

    describe('action has type ARTICLE_VIEWED', () => {
      let flatState

      beforeEach(() => {
        flatState = {
          searchTerm: 'i made a query...',
          resultsCount: 5,
          articleClicked: false,
          hasContextuallySearched: false
        }

        beaconSpy.trackUserAction.calls.reset()
        nextSpy = jasmine.createSpy('nextSpy')
      })

      describe('latest article is not null', () => {
        beforeEach(() => {
          action = {
            type: ARTICLE_VIEWED,
            payload: { id: 121212112 }
          }
          sendBlips({ getState: () => flatState })(nextSpy)(action)
        })

        it('calls trackUserAction with the correct params', () => {
          const expectedValue = {
            query: 'i made a query...',
            resultsCount: 3,
            uniqueSearchResultClick: true,
            articleId: 121212112,
            locale: 'US',
            contextualSearch: false,
            answerBot: false
          }

          expect(beaconSpy.trackUserAction).toHaveBeenCalledWith('helpCenter', 'click', {
            label: 'helpCenterForm',
            value: expectedValue
          })
        })
      })

      describe('latest article is null', () => {
        beforeEach(() => {
          action = {
            type: ARTICLE_VIEWED,
            payload: null
          }
          sendBlips({ getState: () => flatState })(nextSpy)(action)
        })

        it('does not call trackUserAction', () => {
          expect(beaconSpy.trackUserAction).not.toHaveBeenCalled()
        })
      })
    })

    describe('action has type SEARCH_REQUEST_SUCCESS', () => {
      let flatState

      beforeEach(() => {
        beaconSpy.trackUserAction.calls.reset()
        nextSpy = jasmine.createSpy('nextSpy')
      })

      describe('total user searches previously is 0', () => {
        beforeEach(() => {
          flatState = {
            totalUserSearches: 0,
            searchTerm: 'i made a query...'
          }
          action = {
            type: SEARCH_REQUEST_SUCCESS
          }
          sendBlips({ getState: () => flatState })(nextSpy)(action)
        })

        it('calls trackUserAction with the correct params', () => {
          expect(beaconSpy.trackUserAction).toHaveBeenCalledWith('helpCenter', 'search', {
            label: 'helpCenterForm',
            value: 'i made a query...'
          })
        })
      })

      describe('total searches previously is not 0', () => {
        beforeEach(() => {
          flatState = {
            totalUserSearches: 100,
            searchTerm: 'i made a query...'
          }
          action = {
            type: SEARCH_REQUEST_SUCCESS
          }
          sendBlips({ getState: () => flatState })(nextSpy)(action)
        })

        it('does not call trackUserAction', () => {
          expect(beaconSpy.trackUserAction).not.toHaveBeenCalled()
        })
      })
    })

    describe('action has type SEARCH_REQUEST_FAILURE', () => {
      let flatState

      beforeEach(() => {
        beaconSpy.trackUserAction.calls.reset()
        nextSpy = jasmine.createSpy('nextSpy')
      })

      describe('total user searches previously is 0', () => {
        beforeEach(() => {
          flatState = {
            totalUserSearches: 0,
            searchTerm: 'i made a query...'
          }
          action = {
            type: SEARCH_REQUEST_FAILURE
          }
          sendBlips({ getState: () => flatState })(nextSpy)(action)
        })

        it('calls trackUserAction with the correct params', () => {
          expect(beaconSpy.trackUserAction).toHaveBeenCalledWith('helpCenter', 'search', {
            label: 'helpCenterForm',
            value: 'i made a query...'
          })
        })
      })

      describe('total searches previously is not 0', () => {
        beforeEach(() => {
          flatState = {
            totalUserSearches: 100,
            searchTerm: 'i made a query...'
          }
          action = {
            type: SEARCH_REQUEST_FAILURE
          }
          sendBlips({ getState: () => flatState })(nextSpy)(action)
        })

        it('does not call trackUserAction', () => {
          expect(beaconSpy.trackUserAction).not.toHaveBeenCalled()
        })
      })
    })

    describe('action has type ORIGINAL_ARTICLE_CLICKED', () => {
      let flatState

      beforeEach(() => {
        beaconSpy.trackUserAction.calls.reset()
        nextSpy = jasmine.createSpy('nextSpy')
        flatState = {
          activeArticle: 1213211232123,
          resultsCount: 1,
          searchTerm: 'i made a query...',
          articleClicked: true,
          hasContextuallySearched: true
        }
        action = {
          type: ORIGINAL_ARTICLE_CLICKED
        }
        sendBlips({ getState: () => flatState })(nextSpy)(action)
      })

      it('calls trackUserAction with the correct params', () => {
        const expectedValue = {
          query: 'i made a query...',
          resultsCount: 1,
          uniqueSearchResultClick: false,
          articleId: 1213211232123,
          locale: 'US',
          contextualSearch: true,
          answerBot: false
        }

        expect(beaconSpy.trackUserAction).toHaveBeenCalledWith(
          'helpCenter',
          'viewOriginalArticle',
          {
            label: 'helpCenterForm',
            value: expectedValue
          }
        )
      })
    })

    describe('action does not have any relevant action type', () => {
      beforeEach(() => {
        beaconSpy.trackUserAction.calls.reset()
        action = { type: 'random_type' }
        sendBlips({ getState: () => ({}) })(nextSpy)(action)
      })

      it('does not call trackUserAction', () => {
        expect(beaconSpy.trackUserAction).not.toHaveBeenCalled()
      })
    })

    describe('action has type ARTICLE_SHOWN', () => {
      let flatState

      beforeEach(() => {
        beaconSpy.trackUserAction.calls.reset()
        nextSpy = jasmine.createSpy('nextSpy')
        flatState = {
          sessions: new Map([
            [123, { deflection: { id: 9 }, query: 'test', articles: [1, 2] }],
            [789, { deflection: { id: 3 }, query: 'two', articles: [1] }]
          ])
        }
        action = {
          type: ARTICLE_SHOWN,
          payload: {
            sessionID: 123,
            articleID: 456
          }
        }
        sendBlips({ getState: () => flatState })(nextSpy)(action)
      })

      it('calls trackUserAction with the correct params', () => {
        const expectedValue = {
          query: 'test',
          resultsCount: 2,
          articleId: 456,
          locale: 'US',
          deflectionId: 9,
          answerBot: true,
          uniqueSearchResultClick: false
        }

        expect(beaconSpy.trackUserAction).toHaveBeenCalledWith('helpCenter', 'click', {
          label: 'helpCenterForm',
          value: expectedValue
        })
      })
    })

    describe('action has type CONTEXTUAL_ARTICLE_SHOWN', () => {
      let flatState

      beforeEach(() => {
        beaconSpy.trackUserAction.calls.reset()
        nextSpy = jasmine.createSpy('nextSpy')
        flatState = {
          searchTerm: 'i made a query...',
          resultsCount: 3
        }
        action = {
          type: CONTEXTUAL_ARTICLE_SHOWN,
          payload: {
            articleID: 456
          }
        }
        sendBlips({ getState: () => flatState })(nextSpy)(action)
      })

      it('calls trackUserAction with the correct params', () => {
        const expectedValue = {
          query: 'i made a query...',
          resultsCount: 3,
          articleId: 456,
          locale: 'US',
          answerBot: true,
          uniqueSearchResultClick: false,
          contextualSearch: true
        }

        expect(beaconSpy.trackUserAction).toHaveBeenCalledWith('helpCenter', 'click', {
          label: 'helpCenterForm',
          value: expectedValue
        })
      })
    })

    describe('action has type CHAT_STARTED', () => {
      const run = department => {
        beaconSpy.trackUserAction.calls.reset()
        nextSpy = jasmine.createSpy('nextSpy')
        action = {
          type: CHAT_STARTED
        }
        sendBlips({ getState: () => ({ department }) })(nextSpy)(action)
      }

      it('tracks a chatStarted blip with empty data when no department is selected', () => {
        run()

        expect(beaconSpy.trackUserAction).toHaveBeenCalledWith('chat', 'chatStarted', {
          label: 'newChat',
          value: {
            departmentId: null,
            departmentName: null
          }
        })
      })

      it('tracks a chatStarted blip with the department information when one is selected', () => {
        run({
          id: 1337,
          name: 'department name'
        })

        expect(beaconSpy.trackUserAction).toHaveBeenCalledWith('chat', 'chatStarted', {
          label: 'newChat',
          value: {
            departmentId: 1337,
            departmentName: 'department name'
          }
        })
      })
    })

    describe('action has type UPDATE_WIDGET_SHOWN', () => {
      beforeEach(() => {
        beaconSpy.trackUserAction.calls.reset()
        nextSpy = jasmine.createSpy('nextSpy')
      })

      describe('with payload that is not false', () => {
        beforeEach(() => {
          action = {
            type: UPDATE_WIDGET_SHOWN,
            payload: true
          }
          sendBlips({ getState: () => {} })(nextSpy)(action)
        })

        it('does not call trackUserAction', () => {
          expect(beaconSpy.trackUserAction).not.toHaveBeenCalled()
        })
      })

      describe('with payload that is false', () => {
        let flatState

        describe('currentScreen is article', () => {
          beforeAll(() => {
            flatState = {
              currentScreen: 'article',
              articleID: 421
            }
          })

          beforeEach(() => {
            action = {
              type: UPDATE_WIDGET_SHOWN,
              payload: false
            }
            sendBlips({ getState: () => flatState })(nextSpy)(action)
          })

          it('calls trackUserAction with the expected value', () => {
            expect(beaconSpy.trackUserAction).toHaveBeenCalledWith('answerBot', 'articleClosed', {
              label: 'helpCenterForm',
              value: { articleId: 421 }
            })
          })
        })

        describe('currentScreen is not article', () => {
          beforeAll(() => {
            flatState = { currentScreen: 'convo' }
          })

          beforeEach(() => {
            action = {
              type: UPDATE_WIDGET_SHOWN,
              payload: false
            }
            sendBlips({ getState: () => flatState })(nextSpy)(action)
          })

          it('does not call trackUserAction', () => {
            expect(beaconSpy.trackUserAction).not.toHaveBeenCalled()
          })
        })
      })
    })
  })
})
