import React from 'react'
import { render } from 'src/apps/messenger/utils/testHelpers'
import createStore from 'src/apps/messenger/store'
import { widgetOpened } from 'src/apps/messenger/store/visibility'
import App from '../'
import userEvent from '@testing-library/user-event'
import { wait, within } from '@testing-library/dom'
import { screenDimensionsChanged } from 'src/apps/messenger/features/responsiveDesign/store'

describe('Messenger app', () => {
  let store
  const renderComponent = (actions = []) => {
    store = createStore()

    actions.forEach(action => {
      store.dispatch(action())
    })

    return render(<App />, { store })
  }

  beforeEach(() => {})
  it('renders the launcher', () => {
    const { getByTitle } = renderComponent()

    expect(getByTitle('Launcher')).toBeInTheDocument()
  })

  it('does not render the messenger when messenger is not open', async () => {
    const { getByTitle } = renderComponent()

    await wait(() => expect(getByTitle('Messenger')).toBeInTheDocument())

    expect(getByTitle('Messenger').style.display).toBe('none')
  })

  it('renders the messenger when messenger is open', async () => {
    const { getByTitle } = renderComponent([widgetOpened])

    await wait(() => expect(getByTitle('Messenger')).toBeInTheDocument())

    expect(getByTitle('Messenger').style.display).not.toBe('none')
  })

  it('focuses the launcher when the messenger frame is closed when pressing the escape key', async () => {
    const { getByTitle } = renderComponent()

    const launcher = within(getByTitle('Launcher').contentDocument.body)
    userEvent.click(launcher.getByLabelText('Zendesk Messenger Launcher'))

    const widget = within(getByTitle('Messenger').contentDocument.body)
    await wait(() => expect(widget.getByPlaceholderText('Type a message')).toBeInTheDocument())

    userEvent.type(widget.getByPlaceholderText('Type a message'), '{esc}')

    await wait(() => expect(launcher.getByLabelText('Zendesk Messenger Launcher')).toHaveFocus())
  })

  it('focuses the launcher when the messenger frame is closed when pressing the close button', async () => {
    const { getByTitle, store } = renderComponent()
    store.dispatch(
      screenDimensionsChanged({
        isVerticallySmallScreen: true
      })
    )

    let launcher = within(getByTitle('Launcher').contentDocument.body)
    userEvent.click(launcher.getByLabelText('Zendesk Messenger Launcher'))

    const widget = within(getByTitle('Messenger').contentDocument.body)
    await wait(() => expect(widget.getByPlaceholderText('Type a message')).toBeInTheDocument())

    userEvent.click(widget.getByLabelText('Close messenger'))

    await wait(() => expect(getByTitle('Launcher').style.display).not.toBe('none'))

    launcher = within(getByTitle('Launcher').contentDocument.body)

    await wait(() => expect(launcher.getByLabelText('Zendesk Messenger Launcher')).toHaveFocus())
  })

  it('focuses the composer when the messenger frame is opened', async () => {
    const { getByTitle } = renderComponent()

    const launcher = within(getByTitle('Launcher').contentDocument.body)
    userEvent.click(launcher.getByLabelText('Zendesk Messenger Launcher'))

    const widget = within(getByTitle('Messenger').contentDocument.body)
    await wait(() => expect(widget.getByPlaceholderText('Type a message')).toBeInTheDocument())

    expect(widget.getByPlaceholderText('Type a message')).toHaveFocus()
  })
})
