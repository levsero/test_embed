import React from 'react'
import { render } from 'src/apps/messenger/utils/testHelpers'
import { messengerConfigReceived } from 'src/apps/messenger/store/actions'
import LauncherLabel from '../index'
import { launcherSize } from 'src/apps/messenger/constants'
import { stripUnit } from 'polished'
import { within } from '@testing-library/dom'
import wait from 'utility/wait'
import { getIsWidgetOpen } from 'src/apps/messenger/store/visibility'
import { labelHidden } from 'src/apps/messenger/features/launcherLabel/store'
import createStore from 'src/apps/messenger/store'
import { screenDimensionsChanged } from 'src/apps/messenger/features/responsiveDesign/store'

describe('launcher label', () => {
  const renderComponent = (props = {}, options = {}) =>
    render(<LauncherLabel {...props} />, options)

  it('appears above the launcher', async () => {
    const { getByTitle, store } = renderComponent()

    store.dispatch(
      messengerConfigReceived({
        launcher: {
          text: 'Some text'
        }
      })
    )

    await wait(() =>
      expect(stripUnit(getByTitle('Some text').style.bottom)).toBeGreaterThan(launcherSize)
    )
  })

  it('displays the launcher label text', async () => {
    const { getByTitle, store } = renderComponent()

    store.dispatch(
      messengerConfigReceived({
        launcher: {
          text: 'Some text'
        }
      })
    )

    const frame = within(
      getByTitle('Opens a widget where you can find more information').contentDocument.body
    )

    await wait(() => expect(frame.getByText('Some text')).toBeInTheDocument())
  })

  it('closes when the close button is clicked', async () => {
    const { getByTitle, store } = renderComponent()

    store.dispatch(
      messengerConfigReceived({
        launcher: {
          text: 'Some text'
        }
      })
    )

    expect(getByTitle('Opens a widget where you can find more information')).toBeInTheDocument()

    const frame = within(
      getByTitle('Opens a widget where you can find more information').contentDocument.body
    )

    await wait(() => expect(frame.getByLabelText('Close')).toBeInTheDocument())

    frame.getByLabelText('Close').click()

    await wait(() =>
      expect(
        getByTitle('Opens a widget where you can find more information')
      ).not.toBeInTheDocument()
    )
  })

  it('opens the widget when clicked', async () => {
    const { getByTitle, store } = renderComponent()

    store.dispatch(
      messengerConfigReceived({
        launcher: {
          text: 'Some text'
        }
      })
    )

    expect(getIsWidgetOpen(store.getState())).toBe(false)

    expect(getByTitle('Opens a widget where you can find more information')).toBeInTheDocument()

    const frame = within(
      getByTitle('Opens a widget where you can find more information').contentDocument.body
    )

    await wait(() => expect(frame.getByLabelText('Some text')).toBeInTheDocument())

    frame.getByText('Some text').click()

    await wait(() => expect(getIsWidgetOpen(store.getState())).toBe(true))
    await wait(() =>
      expect(
        getByTitle('Opens a widget where you can find more information')
      ).not.toBeInTheDocument()
    )
  })

  it('does not show if it has been previously closed', () => {
    const store = createStore()
    store.dispatch(labelHidden())

    const { queryByTitle } = renderComponent(undefined, { store })

    store.dispatch(
      messengerConfigReceived({
        launcher: {
          text: 'Some text'
        }
      })
    )

    expect(
      queryByTitle('Opens a widget where you can find more information')
    ).not.toBeInTheDocument()
  })

  it('does not display when the widget is full screen', async () => {
    const { getByTitle, store } = renderComponent()

    store.dispatch(
      messengerConfigReceived({
        launcher: {
          text: 'Some text'
        }
      })
    )

    const frame = within(
      getByTitle('Opens a widget where you can find more information').contentDocument.body
    )

    await wait(() => expect(frame.getByText('Some text')).toBeInTheDocument())

    store.dispatch(
      screenDimensionsChanged({
        isFullScreen: true
      })
    )

    await wait(() => expect(frame.getByText('Some text')).not.toBeInTheDocument())
  })
})