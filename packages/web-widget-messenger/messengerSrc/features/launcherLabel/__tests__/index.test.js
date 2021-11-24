import { waitFor, within } from '@testing-library/dom'
import { stripUnit } from 'polished'
import { persistence } from '@zendesk/widget-shared-services'
import wait from 'src/util/wait'
import { launcherSize } from 'messengerSrc/constants'
import {
  initialiseLauncherLabel,
  labelHidden,
  launcherLabelStorageKey,
} from 'messengerSrc/features/launcherLabel/store/visibility'
import { screenDimensionsChanged } from 'messengerSrc/features/responsiveDesign/store'
import createStore from 'messengerSrc/store'
import { messengerConfigReceived } from 'messengerSrc/store/actions'
import { getIsWidgetOpen } from 'messengerSrc/store/visibility'
import { render } from 'messengerSrc/utils/testHelpers'
import LauncherLabel from '../index'

describe('launcher label', () => {
  const renderComponent = (props = {}, options = {}) =>
    render(<LauncherLabel {...props} />, options)

  beforeEach(() => {
    persistence.remove(launcherLabelStorageKey)
  })

  it('appears above the launcher', async () => {
    const { getByTitle, store } = renderComponent()

    store.dispatch(initialiseLauncherLabel())

    store.dispatch(
      messengerConfigReceived({
        launcher: {
          text: 'Some text',
        },
      })
    )

    await wait(() =>
      expect(stripUnit(getByTitle('Some text').style.bottom)).toBeGreaterThan(launcherSize)
    )
  })

  it('displays the launcher label text', async () => {
    const { getByTitle, store } = renderComponent()

    store.dispatch(initialiseLauncherLabel())

    store.dispatch(
      messengerConfigReceived({
        launcher: {
          text: 'Some text',
        },
      })
    )

    const frame = within(getByTitle('Message from company').contentDocument.body)

    await wait(() => expect(frame.getByText('Some text')).toBeInTheDocument())
  })

  it('closes when the close button is clicked', async () => {
    const { getByTitle, store } = renderComponent()

    store.dispatch(initialiseLauncherLabel())

    store.dispatch(
      messengerConfigReceived({
        launcher: {
          text: 'Some text',
        },
      })
    )

    expect(getByTitle('Message from company')).toBeInTheDocument()

    const frame = within(getByTitle('Message from company').contentDocument.body)

    await wait(() => expect(frame.getByLabelText('Close')).toBeInTheDocument())

    frame.getByLabelText('Close').click()

    await wait(() => expect(getByTitle('Message from company')).not.toBeInTheDocument())
  })

  it('opens the widget when clicked', async () => {
    const { getByTitle, store } = renderComponent()

    store.dispatch(initialiseLauncherLabel())

    store.dispatch(
      messengerConfigReceived({
        launcher: {
          text: 'Some text',
        },
      })
    )

    expect(getIsWidgetOpen(store.getState())).toBe(false)

    expect(getByTitle('Message from company')).toBeInTheDocument()

    const frame = within(getByTitle('Message from company').contentDocument.body)

    await wait(() => expect(frame.getByLabelText('Some text')).toBeInTheDocument())

    frame.getByText('Some text').click()

    await wait(() => expect(getIsWidgetOpen(store.getState())).toBe(true))
    await wait(() => expect(getByTitle('Message from company')).not.toBeInTheDocument())
  })

  it('does not show if it has been previously closed', () => {
    const store = createStore()
    store.dispatch(labelHidden())

    const { queryByTitle } = renderComponent(undefined, { store })

    store.dispatch(
      messengerConfigReceived({
        launcher: {
          text: 'Some text',
        },
      })
    )

    expect(queryByTitle('Message from company')).not.toBeInTheDocument()
  })

  it('does not display when the widget is full screen', async () => {
    const { getByTitle, store } = renderComponent()

    localStorage.removeItem(launcherLabelStorageKey)

    store.dispatch(initialiseLauncherLabel())

    store.dispatch(
      messengerConfigReceived({
        launcher: {
          text: 'Some text',
        },
      })
    )

    await waitFor(() => expect(getByTitle('Message from company')).toBeInTheDocument())

    const frame = within(getByTitle('Message from company').contentDocument.body)

    await wait(() => expect(frame.getByText('Some text')).toBeInTheDocument())

    store.dispatch(
      screenDimensionsChanged({
        isFullScreen: true,
      })
    )

    await wait(() => expect(frame.getByText('Some text')).not.toBeInTheDocument())
  })
})
