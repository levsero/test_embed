import _ from 'lodash'
import { UPDATE_ACTIVE_EMBED, UPDATE_WIDGET_SHOWN } from 'src/redux/modules/base/base-action-types'
import {
  SDK_CHAT_MEMBER_JOIN,
  OFFLINE_FORM_REQUEST_SUCCESS,
  SDK_CHAT_RATING,
  SDK_CHAT_COMMENT,
  PRE_CHAT_FORM_SUBMIT
} from 'src/redux/modules/chat/chat-action-types'
import {
  SEARCH_REQUEST_SUCCESS,
  ARTICLE_VIEWED,
  ORIGINAL_ARTICLE_CLICKED
} from 'embeds/helpCenter/actions/action-types'
import { FORM_OPENED } from 'src/embeds/support/actions/action-types'
import { TICKET_SUBMISSION_REQUEST_SUCCESS } from 'src/embeds/support/actions/action-types'
import { TALK_CALLBACK_SUCCESS } from 'src/redux/modules/talk/talk-action-types'
import { GA } from 'service/analytics/googleAnalytics'
import { trackAnalytics } from '../analytics'
import * as callbacks from 'src/service/api/callbacks'
jest.mock('src/service/api/callbacks')

describe('analytics', () => {
  let track

  const callMiddleware = (action, state = {}, getStateOverride = undefined) => {
    const defaultState = {
      base: { webWidgetOpen: true, activeEmbed: '' },
      settings: { analytics: true }
    }
    const mergedState = _.merge(defaultState, state)
    const next = jest.fn()
    const defaultGetState = () => mergedState
    const getState = getStateOverride ? getStateOverride : defaultGetState

    trackAnalytics({ getState })(next)(action)
  }

  beforeEach(() => {
    track = jest.fn()
    GA.track = track
  })

  it('fires the USER_EVENT api', () => {
    const state = {
      talk: { embeddableConfig: { capability: 'talk' }, snapcall: { snapcallSupported: false } }
    }
    const action = {
      type: 'widget/base/UPDATE_ACTIVE_EMBED',
      payload: 'talk'
    }
    callMiddleware(action, state)
    expect(callbacks.fireFor).toHaveBeenCalledWith('USER_EVENT', [
      {
        action: 'Talk Shown',
        category: 'Zendesk Web Widget',
        properties: { contactOption: 'Call us' }
      }
    ])
  })

  it('does not track when analytics disabled', () => {
    const action = {
      type: UPDATE_WIDGET_SHOWN,
      payload: false
    }
    const state = {
      settings: { analytics: false }
    }
    callMiddleware(action, state)
    expect(track).not.toHaveBeenCalled()
    expect(callbacks.fireFor).toHaveBeenCalled()
  })

  describe('trackEmbedOnOpen', () => {
    it('tracks chat on open', () => {
      const state = {
        base: { webWidgetOpen: false, activeEmbed: 'chat' },
        settings: { analytics: true }
      }
      const state2 = {
        base: { webWidgetOpen: true, activeEmbed: 'chat' },
        settings: { analytics: true }
      }
      const action = {
        type: UPDATE_ACTIVE_EMBED
      }
      const getState = jest
        .fn()
        .mockReturnValueOnce(state)
        .mockReturnValueOnce(state2)

      callMiddleware(action, state, getState)
      expect(track).toHaveBeenCalledWith('Chat Opened', undefined, 'Zendesk Web Widget')
      expect(track).toHaveBeenCalledWith('Chat Shown', undefined, 'Zendesk Web Widget')
    })

    it('tracks talk with capabitlity on open', () => {
      const state = {
        base: { webWidgetOpen: false, activeEmbed: 'talk' },
        settings: { analytics: {} },
        talk: { embeddableConfig: { capability: 'talk' }, snapcall: { snapcallSupported: false } }
      }
      const state2 = {
        base: { webWidgetOpen: true, activeEmbed: 'talk' },
        settings: { analytics: {} },
        talk: { embeddableConfig: { capability: 'talk' }, snapcall: { snapcallSupported: false } }
      }
      const action = {
        type: UPDATE_ACTIVE_EMBED
      }
      const getState = jest
        .fn()
        .mockReturnValueOnce(state)
        .mockReturnValueOnce(state2)

      callMiddleware(action, state, getState)
      expect(track).toHaveBeenCalledWith(
        'Talk Shown',
        { contactOption: 'Call us' },
        'Zendesk Web Widget'
      )
    })

    it('tracks talk with capabitlity on open', () => {
      const state = {
        base: { webWidgetOpen: false, activeEmbed: 'helpCenterForm' },
        settings: { analytics: {} }
      }
      const state2 = {
        base: { webWidgetOpen: true, activeEmbed: 'helpCenterForm' },
        settings: { analytics: {} }
      }
      const action = {
        type: UPDATE_ACTIVE_EMBED
      }
      const getState = jest
        .fn()
        .mockReturnValueOnce(state)
        .mockReturnValueOnce(state2)

      callMiddleware(action, state, getState)
      expect(track).toHaveBeenCalledWith('Help Center Shown', undefined, 'Zendesk Web Widget')
    })
  })

  describe('UPDATE_ACTIVE_EMBED', () => {
    it('does not track if not visible', () => {
      const state = { base: { webWidgetOpen: false } }
      const action = {
        type: UPDATE_ACTIVE_EMBED,
        payload: 'chat'
      }
      callMiddleware(action, state)
      expect(track).not.toHaveBeenCalled()
    })

    it('does not track if embed has not changed', () => {
      const state = { base: { activeEmbed: 'chat' } }
      const action = {
        type: 'widget/base/UPDATE_ACTIVE_EMBED',
        payload: 'chat'
      }

      callMiddleware(action, state)

      expect(track).not.toHaveBeenCalled()
    })

    it('tracks chat shown and opened', () => {
      const action = {
        type: 'widget/base/UPDATE_ACTIVE_EMBED',
        payload: 'chat'
      }
      callMiddleware(action)

      expect(track).toHaveBeenCalledWith('Chat Opened', undefined, 'Zendesk Web Widget')
      expect(track).toHaveBeenCalledWith('Chat Shown', undefined, 'Zendesk Web Widget')
    })

    it('tracks talk with capability', () => {
      const state = {
        talk: { embeddableConfig: { capability: 'talk' }, snapcall: { snapcallSupported: false } }
      }
      const action = {
        type: 'widget/base/UPDATE_ACTIVE_EMBED',
        payload: 'talk'
      }
      callMiddleware(action, state)

      expect(track).toHaveBeenCalledWith(
        'Talk Shown',
        { contactOption: 'Call us' },
        'Zendesk Web Widget'
      )
    })

    it('tracks helpCenter', () => {
      const state = {
        settings: { analytics: {} }
      }
      const action = {
        type: 'widget/base/UPDATE_ACTIVE_EMBED',
        payload: 'helpCenterForm'
      }
      callMiddleware(action, state)

      expect(track).toHaveBeenCalledWith('Help Center Shown', undefined, 'Zendesk Web Widget')
    })
  })

  describe('SDK_CHAT_MEMBER_JOIN', () => {
    it('tracks when is an agent and new event', () => {
      const action = {
        type: SDK_CHAT_MEMBER_JOIN,
        payload: { detail: { nick: 'agent:is', timestamp: Date.now() + 100 } }
      }
      callMiddleware(action)
      expect(track).toHaveBeenCalled()
    })

    it('does not track old events', () => {
      const action = {
        type: SDK_CHAT_MEMBER_JOIN,
        payload: { detail: { nick: 'agent:is', timestamp: Date.now() - 1000 } }
      }
      callMiddleware(action)
      expect(track).not.toHaveBeenCalled()
    })

    it('does not track if not an agent', () => {
      const action = {
        type: SDK_CHAT_MEMBER_JOIN,
        payload: { detail: { nick: 'visitor', timestamp: Date.now() + 100 } }
      }
      callMiddleware(action)
      expect(track).not.toHaveBeenCalled()
    })
  })

  describe('OFFLINE_FORM_REQUEST_SUCCESS', () => {
    it('tracks with the department name', () => {
      const state = { chat: { departments: { 123: { name: 'snakes' } } } }
      const action = {
        type: OFFLINE_FORM_REQUEST_SUCCESS,
        payload: { department: 123 }
      }
      callMiddleware(action, state)
      expect(track).toHaveBeenCalledWith(
        'Chat Offline Message Sent',
        { department: 'snakes' },
        'Zendesk Web Widget'
      )
    })
  })

  describe('FORM_OPENED', () => {
    it('tracks ticket form with name and id', () => {
      const state = { support: { forms: { 1: { id: 1, name: 'snakes' } } } }
      const action = {
        type: FORM_OPENED,
        payload: { id: 1 }
      }
      callMiddleware(action, state)
      expect(track).toHaveBeenCalledWith(
        'Contact Form Shown',
        { id: 1, name: 'snakes' },
        'Zendesk Web Widget'
      )
    })

    it('tracks contact form with name', () => {
      const state = { support: { forms: {} } }
      const action = {
        type: FORM_OPENED,
        payload: { id: 'contact-form' }
      }
      callMiddleware(action, state)
      expect(track).toHaveBeenCalledWith(
        'Contact Form Shown',
        { name: 'contact-form' },
        'Zendesk Web Widget'
      )
    })
  })

  describe('SDK_CHAT_RATING', () => {
    it('tracks with details when new and has a rating', () => {
      const action = {
        type: SDK_CHAT_RATING,
        payload: { detail: { new_rating: 'good', timestamp: Date.now() + 100 } }
      }
      callMiddleware(action)
      expect(track).toHaveBeenCalledWith('Chat Rating Good', undefined, 'Zendesk Web Widget')
    })

    it('tracks rating removal when no rating', () => {
      const action = {
        type: SDK_CHAT_RATING,
        payload: { detail: { timestamp: Date.now() + 100 } }
      }
      callMiddleware(action)
      expect(track).toHaveBeenCalledWith('Chat Rating Removed', undefined, 'Zendesk Web Widget')
    })

    it('does not track if old event', () => {
      const action = {
        type: SDK_CHAT_RATING,
        payload: { detail: { timestamp: Date.now() - 1000 } }
      }
      callMiddleware(action)
      expect(track).not.toHaveBeenCalled()
    })
  })

  describe('SDK_CHAT_COMMENT', () => {
    it('tracks comment when new', () => {
      const action = {
        type: SDK_CHAT_COMMENT,
        payload: { detail: { timestamp: Date.now() + 100 } }
      }
      callMiddleware(action)
      expect(track).toHaveBeenCalledWith('Chat Comment Submitted', undefined, 'Zendesk Web Widget')
    })

    it('does not track if old event', () => {
      const action = {
        type: SDK_CHAT_COMMENT,
        payload: { detail: { timestamp: Date.now() - 1000 } }
      }
      callMiddleware(action)
      expect(track).not.toHaveBeenCalled()
    })
  })

  describe('PRE_CHAT_FORM_SUBMIT', () => {
    it('tracks with the department name', () => {
      const state = { chat: { departments: { 123: { name: 'snakes' } } } }
      const action = {
        type: PRE_CHAT_FORM_SUBMIT,
        payload: { department: 123 }
      }
      callMiddleware(action, state)
      expect(track).toHaveBeenCalledWith(
        'Chat Request Form Submitted',
        { department: 'snakes' },
        'Zendesk Web Widget'
      )
    })
  })

  describe('UPDATE_WIDGET_SHOWN', () => {
    it('tracks widget showing', () => {
      const action = {
        type: UPDATE_WIDGET_SHOWN,
        payload: true
      }
      callMiddleware(action)
      expect(track).toHaveBeenCalledWith('Web Widget Opened', undefined, 'Zendesk Web Widget')
    })

    it('tracks widget minimizing', () => {
      const action = {
        type: UPDATE_WIDGET_SHOWN,
        payload: false
      }
      callMiddleware(action)
      expect(track).toHaveBeenCalledWith('Web Widget Minimised', undefined, 'Zendesk Web Widget')
    })
  })

  describe('SEARCH_REQUEST_SUCCESS', () => {
    it('tracks search with search term', () => {
      const state = { helpCenter: { searchTerm: { current: 'hide body' } } }
      const action = {
        type: SEARCH_REQUEST_SUCCESS,
        payload: { isFallback: false }
      }
      callMiddleware(action, state)
      expect(track).toHaveBeenCalledWith(
        'Help Center Search',
        { term: 'hide body' },
        'Zendesk Web Widget'
      )
    })

    it('does not track search if is a fallback search', () => {
      const state = { helpCenter: { searchTerm: { current: 'hide body' } } }
      const action = {
        type: SEARCH_REQUEST_SUCCESS,
        payload: { isFallback: true }
      }
      callMiddleware(action, state)
      expect(track).not.toHaveBeenCalled()
    })
  })

  describe('ARTICLE_VIEWED', () => {
    it('tracks search with search term', () => {
      const action = {
        type: ARTICLE_VIEWED,
        payload: { id: 123, name: 'snakes' }
      }
      callMiddleware(action)
      expect(track).toHaveBeenCalledWith(
        'Help Center Article Viewed',
        { id: 123, name: 'snakes' },
        'Zendesk Web Widget'
      )
    })
  })

  describe('ORIGINAL_ARTICLE_CLICKED', () => {
    it('tracks search with search term', () => {
      const state = {
        helpCenter: {
          clickedArticles: { current: 12 },
          articles: { 12: { name: 'bitten by snake', id: 12 } }
        }
      }
      const action = {
        type: ORIGINAL_ARTICLE_CLICKED
      }
      callMiddleware(action, state)
      expect(track).toHaveBeenCalledWith(
        'Help Center View Original Article Clicked',
        {
          id: 12,
          name: 'bitten by snake'
        },
        'Zendesk Web Widget'
      )
    })
  })

  describe('TICKET_SUBMISSION_REQUEST_SUCCESS', () => {
    it('tracks ticket submission with form name', () => {
      const state = {
        support: {
          forms: { 12: { id: 12, name: 'bitten' } }
        }
      }
      const action = {
        type: TICKET_SUBMISSION_REQUEST_SUCCESS,
        payload: { name: '12' }
      }
      callMiddleware(action, state)
      expect(track).toHaveBeenCalledWith(
        'Contact Form Submitted',
        {
          id: 12,
          name: 'bitten'
        },
        'Zendesk Web Widget'
      )
    })

    it('tracks ticket submission for default form', () => {
      const state = {
        support: {
          forms: {}
        }
      }
      const action = {
        type: TICKET_SUBMISSION_REQUEST_SUCCESS,
        payload: { name: 'contact-form' }
      }
      callMiddleware(action, state)
      expect(track).toHaveBeenCalledWith(
        'Contact Form Submitted',
        { name: 'contact-form' },
        'Zendesk Web Widget'
      )
    })
  })

  describe('TALK_CALLBACK_SUCCESS', () => {
    it('tracks search with search term', () => {
      const action = {
        type: TALK_CALLBACK_SUCCESS
      }
      callMiddleware(action)
      expect(track).toHaveBeenCalledWith(
        'Talk Callback Request Submitted',
        undefined,
        'Zendesk Web Widget'
      )
    })
  })
})
