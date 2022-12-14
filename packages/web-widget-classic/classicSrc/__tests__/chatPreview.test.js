import { waitFor } from '@testing-library/dom'
import { i18n } from 'classicSrc/app/webWidget/services/i18n'
import { OFFLINE_FORM_SCREENS } from 'classicSrc/constants/chat'
import * as constants from 'classicSrc/redux/modules/chat/chat-screen-types'
import '../chatPreview'

beforeEach(() => {
  const div = document.createElement('div')

  div.setAttribute('id', 'preview')
  document.body.appendChild(div)
})

afterEach(() => {
  const rendered = chatPreview()

  if (rendered) {
    rendered.remove()
  }
  document.getElementById('preview').remove()
})

const chatPreview = () => {
  const webWidgetPreview = document.getElementById('webWidget')
  const launcherPreview = document.getElementById('launcher')

  return webWidgetPreview || launcherPreview
}
const chatPreviewBody = () => chatPreview().contentWindow.document.body.innerHTML
const chatPreviewBodyEl = () => chatPreview().contentWindow.document.body

describe('rendered with default options', () => {
  let preview

  beforeEach(() => {
    preview = window.zEPreview.renderPreview({
      element: document.getElementById('preview'),
    })
  })

  it('creates the iframe for preview', (done) => {
    preview.waitForComponent(() => {
      expect(chatPreview()).toBeInTheDocument()
      done()
    })
  })

  it('creates the iframe with the expected styles', () => {
    expect(chatPreview()).toHaveStyle(`
        position: relative;
        right: 0px;
        bottom: 0px;
        margin-right: 16px;
        margin-top: 16px;
        width: 354px;
        height: 540px;
    `)
  })

  it('can update to chatting screen', (done) => {
    preview.updateScreen(constants.CHATTING_SCREEN)
    preview.waitForComponent(async () => {
      await waitFor(() => expect(chatPreviewBodyEl()).toHaveTextContent('Type a message here'))
      done()
    })
  })

  it('can update to prechat screen', (done) => {
    preview.updateScreen(constants.PRECHAT_SCREEN)
    preview.waitForComponent(async () => {
      await waitFor(() => expect(chatPreviewBodyEl()).toHaveTextContent('Start chat'))
      done()
    })
  })

  it('can update to offline message screen', (done) => {
    preview.updateScreen(OFFLINE_FORM_SCREENS.MAIN)
    preview.waitForComponent(async () => {
      await waitFor(() =>
        expect(chatPreviewBodyEl()).toHaveTextContent('Sorry, we are not online at the moment')
      )
      done()
    })
  })

  it('allows setting of color', (done) => {
    preview.setColor('#FF1234')

    preview.waitForComponent(async () => {
      await waitFor(() =>
        expect(chatPreviewBody()).toMatch('background-color: #FF1234 !important;')
      )
      done()
    })
  })

  it('sets it with default color', (done) => {
    preview.setColor()

    preview.waitForComponent(async () => {
      await waitFor(() =>
        expect(chatPreviewBody()).toMatch('background-color: #1F73B7 !important;')
      )
      done()
    })
  })

  it('allows updating of locale', async () => {
    preview.updateLocale('zh')

    await waitFor(() => expect(i18n.getLocale()).toEqual('zh-cn'))
  })

  it('allows setting of chat state', (done) => {
    const action = { type: 'account_status', detail: 'online' }

    preview.updateChatState(action)

    preview.waitForComponent(async () => {
      await waitFor(() => expect(chatPreviewBodyEl()).toHaveTextContent('Chat with us'))
      expect(chatPreviewBodyEl()).toHaveTextContent('Live Support')
      done()
    })
  })

  it('allows updating of preview settings', (done) => {
    preview.updateScreen(constants.CHATTING_SCREEN)
    preview.updateSettings({ concierge: { title: 'updated concierge title' } })

    preview.waitForComponent(async () => {
      await waitFor(() => expect(chatPreviewBodyEl()).toHaveTextContent('updated concierge title'))
      done()
    })
  })
})

describe('when calling with no element property in options', () => {
  it('throws an error', () => {
    expect(() => window.zEPreview.renderPreview()).toThrowError(
      'A DOM element is required to render the Preview into'
    )
  })
})

test('locale can be set', async () => {
  window.zEPreview.renderPreview({
    element: document.getElementById('preview'),
    locale: 'fr',
  })

  await waitFor(() => expect(i18n.getLocale()).toEqual('fr'))
})

test('styles can be customized', async () => {
  const styles = {
    marginTop: '32px',
    marginLeft: '32px',
    width: '100px',
  }

  window.zEPreview.renderPreview({
    element: document.getElementById('preview'),
    styles,
  })

  await waitFor(() =>
    expect(chatPreview()).toHaveStyle(`
        margin-top: 32px;
        margin-left: 32px;
        width: 112px;
      `)
  )
})
