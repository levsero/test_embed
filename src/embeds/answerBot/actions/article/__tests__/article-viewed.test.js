import configureMockStore from 'redux-mock-store'
import thunk from 'redux-thunk'
import * as actions from '../article-viewed'
import { http } from 'service/transport'
import { settings } from 'service/settings'
import { ANSWER_BOT_ORIGINAL_ARTICLE_CLICKED } from 'src/embeds/answerBot/actions/article/action-types'

jest.mock('service/transport')

const mockStore = configureMockStore([thunk])

settings.init()

describe('articleViewed', () => {
  let dispatchedActions, store

  beforeEach(() => {
    const state = {
      answerBot: {
        sessions: new Map([
          [
            1234,
            {
              deflection: { id: 888 },
              interactionToken: { y: 2 }
            }
          ]
        ])
      }
    }

    store = mockStore(state)

    store.dispatch(actions.articleViewed(1234, 99))

    dispatchedActions = store.getActions()
  })

  it('dispatches the expected pending actions', () => {
    expect(dispatchedActions).toMatchSnapshot()
  })

  it('sends the expected http params', () => {
    expect(http.send).toMatchSnapshot()
  })

  describe('callbacks', () => {
    it('dispatches expected actions on successful request', () => {
      const callback = http.send.mock.calls[0][0].callbacks.done

      callback()
      expect(store.getActions()).toMatchSnapshot()
    })

    it('dispatches expected actions on failed request', () => {
      const callback = http.send.mock.calls[0][0].callbacks.fail

      callback()
      expect(store.getActions()).toMatchSnapshot()
    })
  })
})

describe('originalArticleClicked', () => {
  it('returns an action including the provided article id', () => {
    expect(actions.originalArticleClicked('articleId')).toEqual({
      type: ANSWER_BOT_ORIGINAL_ARTICLE_CLICKED,
      payload: {
        articleId: 'articleId'
      }
    })
  })
})
