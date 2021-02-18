import { getZendeskLogoLink } from '../selectors'
import createStore from 'src/redux/createStore'
import { updateEmbeddableConfig } from 'src/redux/modules/base/base-actions'
import { LOCALE_SET } from 'src/redux/modules/base/base-action-types'

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
