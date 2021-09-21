import { waitFor } from '@testing-library/dom'
import { i18n } from 'src/apps/webWidget/services/i18n'
import { DEFAULT_BASE_COLOR } from 'src/constants/shared'
import '../webWidgetPreview'

beforeEach(() => {
  const div = document.createElement('div')

  div.setAttribute('id', 'preview')
  document.body.appendChild(div)
})

afterEach(() => {
  const rendered = webWidgetPreview()

  if (rendered) {
    rendered.remove()
  }
  document.getElementById('preview').remove()
})

const webWidgetPreview = () => document.getElementById('webWidgetPreview')
const webWidgetPreviewBody = () => webWidgetPreview().contentWindow.document.body.innerHTML
const webWidgetPreviewBodyEl = () => webWidgetPreview().contentWindow.document.body

describe('default parameters', () => {
  let preview

  beforeEach(() => {
    preview = window.zE.renderWebWidgetPreview({
      element: document.getElementById('preview'),
    })
  })

  it('creates the iframe for preview', () => {
    expect(webWidgetPreview()).toBeInTheDocument()
  })

  it('creates the iframe with the expected styles', () => {
    expect(webWidgetPreview()).toHaveStyle(`
        position: relative;
        margin-top: 16px;
        margin-right: 16px;
        right: 0px;
        bottom: 0px;
        width: 354px;
        height: 540px;
    `)
  })

  it('renders the message title', async () => {
    preview.setTitle('message')

    await waitFor(() => expect(webWidgetPreviewBodyEl()).toHaveTextContent('Leave us a message'))
  })

  describe('the contact title', () => {
    it('renders it', async () => {
      preview.setTitle('contact')

      await waitFor(() => expect(webWidgetPreviewBodyEl()).toHaveTextContent('Contact us'))
    })

    it('updates it', async () => {
      preview.setTitle('message')

      await waitFor(() => expect(webWidgetPreviewBodyEl()).toHaveTextContent('Leave us a message'))
    })

    it("preserves the widget's colour after changing it", async () => {
      preview.setColor('#174F87')

      await waitFor(() =>
        expect(webWidgetPreviewBody()).toMatch('background-color: #174F87 !important;')
      )

      preview.setTitle('message')

      await waitFor(() =>
        expect(webWidgetPreviewBody()).toMatch('background-color: #174F87 !important;')
      )
    })
  })

  it('sets it with default title if no title is passed', async () => {
    preview.setTitle()

    await waitFor(() => expect(webWidgetPreviewBodyEl()).toHaveTextContent('Leave us a message'))
  })

  it('allows setting of color', async () => {
    preview.setColor('#B81E34')

    await waitFor(() =>
      expect(webWidgetPreviewBody()).toMatch('background-color: #B81E34 !important;')
    )
  })

  it('sets it with default color', async () => {
    preview.setColor()

    await waitFor(() =>
      expect(webWidgetPreviewBody()).toMatch(`background-color: ${DEFAULT_BASE_COLOR} !important;`)
    )
  })
})

describe('when calling with no element property in options', () => {
  it('throws an error', () => {
    expect(() => window.zE.renderWebWidgetPreview()).toThrowError(
      'A DOM element is required to render the Web Widget Preview into'
    )
  })
})

test('locale can be set', async () => {
  window.zE.renderWebWidgetPreview({
    element: document.getElementById('preview'),
    locale: 'fr',
  })

  await waitFor(() => expect(i18n.getLocale()).toEqual('fr'))
})

test('styles can be customized', async () => {
  const styles = {
    float: 'left',
    marginTop: '32px',
    marginLeft: '32px',
    width: '100px',
  }

  window.zE.renderWebWidgetPreview({
    element: document.getElementById('preview'),
    styles,
  })

  await waitFor(() =>
    expect(webWidgetPreview()).toHaveStyle(`
        margin-top: 32px;
        margin-left: 32px;
        width: 112px;
      `)
  )
})
