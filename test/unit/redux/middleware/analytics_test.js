describe('analytics middleware', () => {
  let trackAnalytics,
    GASpy,
    mockIsAgent = false,
    analyticsDisabled = false,
    loadtime
  const UPDATE_ACTIVE_EMBED = 'widget/base/UPDATE_ACTIVE_EMBED'
  const SDK_CHAT_MEMBER_JOIN = 'widget/chat/SDK_CHAT_MEMBER_JOIN'
  const OFFLINE_FORM_REQUEST_SUCCESS = 'widget/chat/OFFLINE_FORM_REQUEST_SUCCESS'
  const SDK_CHAT_RATING = 'widget/chat/SDK_CHAT_RATING'
  const SDK_CHAT_COMMENT = 'widget/chat/SDK_CHAT_COMMENT'
  const PRE_CHAT_FORM_SUBMIT = 'widget/chat/PRE_CHAT_FORM_SUBMIT'

  beforeEach(() => {
    const blipPath = buildSrcPath('redux/middleware/analytics')

    GASpy = jasmine.createSpyObj('GA', ['track'])

    mockery.enable()
    initMockRegistry({
      'service/analytics/googleAnalytics': {
        GA: GASpy
      },
      'src/redux/modules/chat/chat-selectors': {
        getDepartments: prevState => prevState.departments
      },
      'src/redux/modules/settings/settings-selectors': {
        getAnalyticsDisabled: () => analyticsDisabled
      },
      'src/redux/modules/base/base-selectors': {
        getWebWidgetVisible: state => (state ? state.webWidgetVisible : false),
        getActiveEmbed: state => state.activeEmbed
      },
      'src/redux/modules/base/base-action-types': {
        UPDATE_ACTIVE_EMBED
      },
      'src/redux/modules/chat/chat-action-types': {
        SDK_CHAT_MEMBER_JOIN,
        OFFLINE_FORM_REQUEST_SUCCESS,
        SDK_CHAT_RATING,
        SDK_CHAT_COMMENT,
        PRE_CHAT_FORM_SUBMIT
      },
      'src/util/chat': {
        isAgent: () => mockIsAgent
      }
    })

    loadtime = Date.now()
    trackAnalytics = requireUncached(blipPath).trackAnalytics
  })

  afterAll(() => {
    mockery.disable()
    mockery.deregisterAll()
  })

  describe('trackAnalytics', () => {
    let action, nextSpy

    afterEach(() => {
      GASpy.track.calls.reset()
    })

    describe('next', () => {
      beforeEach(() => {
        nextSpy = jasmine.createSpy('nextSpy')
        action = { type: 'random_type' }
        trackAnalytics({ getState: () => ({}) })(nextSpy)(action)
      })

      it('calls next function', () => {
        expect(nextSpy).toHaveBeenCalledWith({ type: 'random_type' })
      })
    })

    describe('action has type UPDATE_ACTIVE_EMBED', () => {
      let flatState, mockWebWidgetVisible, mockActiveEmbed, payload

      beforeEach(() => {
        flatState = {
          activeEmbed: mockActiveEmbed,
          webWidgetVisible: mockWebWidgetVisible
        }

        action = {
          type: UPDATE_ACTIVE_EMBED,
          payload
        }
        trackAnalytics({ getState: () => flatState })(noop)(action)
      })

      describe('when widget is not open', () => {
        beforeAll(() => {
          mockWebWidgetVisible = false
        })

        it('does not call GA.track', () => {
          expect(GASpy.track).not.toHaveBeenCalled()
        })
      })

      describe('when previous embed is chat', () => {
        beforeAll(() => {
          mockWebWidgetVisible = true
          mockActiveEmbed = 'chat'
        })

        it('does not call GA.track', () => {
          expect(GASpy.track).not.toHaveBeenCalled()
        })
      })

      describe('when previous embed is not chat', () => {
        beforeAll(() => {
          mockWebWidgetVisible = true
          mockActiveEmbed = 'not_chat'
        })

        describe('payload is not chat', () => {
          beforeAll(() => {
            payload = 'helpCenter'
          })

          it('does not call GA.track', () => {
            expect(GASpy.track).not.toHaveBeenCalled()
          })
        })

        describe('payload is chat', () => {
          beforeAll(() => {
            payload = 'chat'
          })

          it('calls GA.track with the correct name', () => {
            expect(GASpy.track).toHaveBeenCalledWith('Chat Opened')
          })
        })
      })
    })

    describe('web widget visibility', () => {
      let mockActiveEmbed, nextStateWebWidgetVisible, prevStateWebWidgetVisible

      beforeEach(() => {
        const store = (() => {
          let counter = 0

          return {
            getState: function() {
              counter += 1
              return {
                activeEmbed: mockActiveEmbed,
                webWidgetVisible:
                  counter > 1 ? nextStateWebWidgetVisible : prevStateWebWidgetVisible
              }
            }
          }
        })()

        action = {
          type: 'something'
        }
        trackAnalytics(store)(noop)(action)
      })

      describe('invisible to visible', () => {
        beforeAll(() => {
          prevStateWebWidgetVisible = false
          nextStateWebWidgetVisible = true
          mockActiveEmbed = 'chat'
        })

        it('calls GA.track', () => {
          expect(GASpy.track).toHaveBeenCalled()
        })
      })

      describe('active embed is not chat', () => {
        beforeAll(() => {
          prevStateWebWidgetVisible = false
          nextStateWebWidgetVisible = true
          mockActiveEmbed = 'not chat'
        })

        it('calls GA.track', () => {
          expect(GASpy.track).not.toHaveBeenCalled()
        })
      })

      describe('invisible to invisible', () => {
        beforeAll(() => {
          prevStateWebWidgetVisible = false
          nextStateWebWidgetVisible = false
          mockActiveEmbed = 'chat'
        })

        it('does not call GA.track', () => {
          expect(GASpy.track).not.toHaveBeenCalled()
        })
      })

      describe('visible to visible', () => {
        beforeAll(() => {
          prevStateWebWidgetVisible = true
          nextStateWebWidgetVisible = true
          mockActiveEmbed = 'chat'
        })

        it('does not call GA.track', () => {
          expect(GASpy.track).not.toHaveBeenCalled()
        })
      })
    })

    describe('action has type SDK_CHAT_MEMBER_JOIN', () => {
      let timestamp

      beforeEach(() => {
        const payload = {
          detail: {
            timestamp,
            display_name: 'Bob Ross' // eslint-disable-line camelcase
          }
        }

        action = {
          type: SDK_CHAT_MEMBER_JOIN,
          payload
        }
        trackAnalytics({ getState: () => {} })(noop)(action)
      })

      describe('when payload is not from an agent', () => {
        it('does not call GA.track', () => {
          expect(GASpy.track).not.toHaveBeenCalled()
        })
      })

      describe('when payload is from an agent', () => {
        beforeAll(() => {
          mockIsAgent = true
        })

        describe('when payload is received after initialization', () => {
          beforeAll(() => {
            timestamp = loadtime + 10000
          })

          it('calls GA.track with the correct params', () => {
            expect(GASpy.track).toHaveBeenCalledWith('Chat Served by Operator', 'Bob Ross')
          })
        })

        describe('when payload is received before initialization', () => {
          beforeAll(() => {
            timestamp = loadtime - 10000
          })

          it('does not call GA.track', () => {
            expect(GASpy.track).not.toHaveBeenCalled()
          })
        })
      })
    })

    describe('action has type OFFLINE_FORM_REQUEST_SUCCESS', () => {
      beforeEach(() => {
        const payload = {
          department: 234
        }
        const flatState = {
          departments: {
            234: {
              name: 'testing'
            }
          }
        }

        action = {
          type: OFFLINE_FORM_REQUEST_SUCCESS,
          payload
        }
        trackAnalytics({ getState: () => flatState })(noop)(action)
      })

      it('calls GA.track with the correct params', () => {
        expect(GASpy.track).toHaveBeenCalledWith('Chat Offline Message Sent', 'testing')
      })
    })

    describe('action has type SDK_CHAT_RATING', () => {
      let rating, timestamp

      beforeEach(() => {
        const payload = {
          detail: {
            new_rating: rating, // eslint-disable-line camelcase
            timestamp
          }
        }

        action = {
          type: SDK_CHAT_RATING,
          payload
        }
        trackAnalytics({ getState: () => {} })(noop)(action)
      })

      describe('when payload is received before initialization', () => {
        beforeAll(() => {
          timestamp = loadtime - 10000
        })

        it('does not call GA.track', () => {
          expect(GASpy.track).not.toHaveBeenCalled()
        })
      })

      describe('when payload is received after initialization', () => {
        beforeAll(() => {
          timestamp = loadtime + 10000
        })

        describe('when new_rating has a value', () => {
          beforeAll(() => {
            rating = 'good'
          })

          it('calls GA.track with the correct params', () => {
            expect(GASpy.track).toHaveBeenCalledWith('Chat Rating Good')
          })
        })

        describe('when new_rating does not have a value', () => {
          beforeAll(() => {
            rating = null
          })

          it('calls GA.track with the correct params', () => {
            expect(GASpy.track).toHaveBeenCalledWith('Chat Rating Removed')
          })
        })
      })
    })

    describe('action has type SDK_CHAT_COMMENT', () => {
      let timestamp

      beforeEach(() => {
        const payload = {
          detail: {
            timestamp
          }
        }

        action = {
          type: SDK_CHAT_COMMENT,
          payload
        }
        trackAnalytics({ getState: () => {} })(noop)(action)
      })

      describe('when payload is received before initialization', () => {
        beforeAll(() => {
          timestamp = loadtime - 10000
        })

        it('does not call GA.track', () => {
          expect(GASpy.track).not.toHaveBeenCalled()
        })
      })

      describe('when payload is received after initialization', () => {
        beforeAll(() => {
          timestamp = loadtime + 10000
        })

        it('calls GA.track with the correct params', () => {
          expect(GASpy.track).toHaveBeenCalledWith('Chat Comment Submitted')
        })
      })
    })

    describe('action has type PRE_CHAT_FORM_SUBMIT', () => {
      beforeEach(() => {
        const payload = {
          department: '123'
        }
        const flatState = {
          departments: {
            123: {
              name: 'Support'
            }
          }
        }

        action = {
          type: PRE_CHAT_FORM_SUBMIT,
          payload
        }
        trackAnalytics({ getState: () => flatState })(noop)(action)
      })

      it('call GA.track with the correct params', () => {
        expect(GASpy.track).toHaveBeenCalledWith('Chat Request Form Submitted', 'Support')
      })
    })

    describe('analytics are disabled', () => {
      beforeEach(() => {
        const payload = {
          detail: {
            new_rating: null, // eslint-disable-line camelcase
            timestamp: loadtime + 10000
          }
        }

        analyticsDisabled = true

        action = {
          type: SDK_CHAT_RATING,
          payload
        }
        trackAnalytics({ getState: () => {} })(noop)(action)
      })

      it('does not call GA.track', () => {
        expect(GASpy.track).not.toHaveBeenCalled()
      })
    })
  })
})
