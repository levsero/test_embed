import createStore from 'classicSrc/redux/createStore'
import { LOCALE_SET } from 'classicSrc/redux/modules/base/base-action-types'
import { updateEmbeddableConfig } from 'classicSrc/redux/modules/base/base-actions'
import { getZendeskLogoLink } from '../selectors'

describe('getZendeskLogoLink', () => {
  it('return chat url if on chat product', () => {
    const mockEmbeddableConfig = {
      embeds: {
        chat: {
          props: {
            zopimId: 'randomZopimId',
          },
        },
      },
    }

    const store = createStore()

    store.dispatch({
      type: LOCALE_SET,
      payload: 'en-US',
    })
    store.dispatch(updateEmbeddableConfig(mockEmbeddableConfig))
    const url = getZendeskLogoLink(store.getState(), true)

    expect(url).toMatchSnapshot()
  })

  it('return generic web widget url if not on a chat product', () => {
    const store = createStore()

    store.dispatch({
      type: LOCALE_SET,
      payload: 'en-US',
    })
    const url = getZendeskLogoLink(store.getState(), false)

    expect(url).toMatchSnapshot()
  })
})
