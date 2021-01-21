import React from 'react'
import { render } from 'src/apps/messenger/utils/testHelpers'
import createStore from 'src/apps/messenger/store'
import { widgetOpened } from 'src/apps/messenger/store/visibility'
import App from '../'
import userEvent from '@testing-library/user-event'
import { waitFor, within } from '@testing-library/dom'
import { screenDimensionsChanged } from 'src/apps/messenger/features/responsiveDesign/store'

jest.mock('src/apps/messenger/api/sunco')
jest.mock('src/apps/messenger/features/messageLog/hooks/useFetchMessages.js', () => () => ({
  fetchHistoryOnScrollTop: jest.fn(),
  isFetchingHistory: false,
  errorFetchingHistory: false,
  retryFetchMessages: jest.fn()
}))

describe('Messenger app', () => {
  let store
  const renderComponent = (actions = []) => {
    store = createStore()

    actions.forEach(action => {
      store.dispatch(action())
    })

    return render(<App />, { store })
  }

  it('renders the launcher', () => {
    const { getByTitle } = renderComponent()

    expect(getByTitle('Button to launch messaging window')).toBeInTheDocument()
  })

  it('does not render the messenger when messenger is not open', async () => {
    const { getByTitle } = renderComponent()

    await waitFor(() => expect(getByTitle('Messaging window')).toBeInTheDocument())

    expect(getByTitle('Messaging window').style.display).toBe('none')
  })

  it('renders the messenger when messenger is open', async () => {
    const { getByTitle } = renderComponent([widgetOpened])

    await waitFor(() => expect(getByTitle('Messaging window')).toBeInTheDocument())
    await waitFor(() => expect(getByTitle('Messaging window').style.display).not.toBe('none'))
  })

  it('focuses the launcher when the messenger frame is closed when pressing the escape key', async () => {
    const { getByTitle } = renderComponent()

    const launcher = within(getByTitle('Button to launch messaging window').contentDocument.body)

    await waitFor(() =>
      expect(launcher.getByLabelText('Open messaging window')).toBeInTheDocument()
    )

    userEvent.click(launcher.getByLabelText('Open messaging window'))

    const widget = within(getByTitle('Messaging window').contentDocument.body)
    await waitFor(() => expect(widget.getByPlaceholderText('Type a message')).toBeInTheDocument())

    userEvent.type(widget.getByPlaceholderText('Type a message'), '{esc}')

    await waitFor(() => expect(launcher.getByLabelText('Open messaging window')).toHaveFocus())
  })

  it('focuses the launcher when the messenger frame is closed when pressing the close button', async () => {
    const { getByTitle, store } = renderComponent()
    store.dispatch(
      screenDimensionsChanged({
        isVerticallySmallScreen: true
      })
    )

    let launcher = within(getByTitle('Button to launch messaging window').contentDocument.body)
    await waitFor(() =>
      expect(launcher.getByLabelText('Open messaging window')).toBeInTheDocument()
    )
    userEvent.click(launcher.getByLabelText('Open messaging window'))

    const widget = within(getByTitle('Messaging window').contentDocument.body)
    await waitFor(() => expect(widget.getByPlaceholderText('Type a message')).toBeInTheDocument())

    userEvent.click(widget.getByLabelText('Close'))

    await waitFor(() =>
      expect(getByTitle('Button to launch messaging window').style.display).not.toBe('none')
    )

    launcher = within(getByTitle('Button to launch messaging window').contentDocument.body)

    await waitFor(() => expect(launcher.getByLabelText('Open messaging window')).toHaveFocus())
  })

  it('focuses the composer when the messenger frame is opened', async () => {
    const { getByTitle } = renderComponent()

    const launcher = within(getByTitle('Button to launch messaging window').contentDocument.body)

    await waitFor(() =>
      expect(launcher.getByLabelText('Open messaging window')).toBeInTheDocument()
    )

    userEvent.click(launcher.getByLabelText('Open messaging window'))

    const widget = within(getByTitle('Messaging window').contentDocument.body)
    await waitFor(() => expect(widget.getByPlaceholderText('Type a message')).toBeInTheDocument())

    await waitFor(() => expect(widget.getByPlaceholderText('Type a message')).toHaveFocus())
  })
})
