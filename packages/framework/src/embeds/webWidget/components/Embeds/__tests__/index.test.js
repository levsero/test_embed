import { render } from 'utility/testHelpers'
import { closeReceived, openReceived } from 'src/redux/modules/base'
import Embeds from '..'
import * as actions from 'src/redux/modules/base/base-action-types'
import { wait, getByTestId } from '@testing-library/react'
import * as baseActions from 'src/redux/modules/base/base-actions/base-actions'
import { updateSettings } from 'src/redux/modules/settings'
import * as globalUtilities from 'utility/globals'
import { waitFor } from '@testing-library/dom'

jest.mock('component/webWidget/WebWidget', () => {
  return {
    __esModule: true,
    default: () => {
      return <div data-testid="web widget" />
    },
  }
})

describe('Embeds', () => {
  const defaultProps = {}

  const renderComponent = (props = {}) => render(<Embeds {...defaultProps} {...props} />)

  it('is not displayed when hidden', () => {
    const { container, store } = renderComponent()

    store.dispatch(closeReceived())

    expect(container.querySelector('iframe')).toHaveStyle('visibility: hidden')
  })

  it('is displayed when not hidden', () => {
    const { container, store } = renderComponent()

    store.dispatch(openReceived())

    expect(container.querySelector('iframe')).not.toHaveStyle('visibility: hidden')
  })

  it('dispatches the widgetShowAnimationComplete action when shown', async () => {
    const { store } = renderComponent()

    jest.spyOn(store, 'dispatch')
    jest.spyOn(baseActions, 'widgetShowAnimationComplete')

    baseActions.widgetShowAnimationComplete.mockReturnValue({
      type: actions.WIDGET_SHOW_ANIMATION_COMPLETE,
    })

    store.dispatch(openReceived())

    await wait(() =>
      expect(store.dispatch).toHaveBeenCalledWith({
        type: actions.WIDGET_SHOW_ANIMATION_COMPLETE,
      })
    )
  })

  it('can be tabbed to when visible', () => {
    const { container, store } = renderComponent()

    store.dispatch(openReceived())

    expect(container.querySelector('iframe')).toHaveAttribute('tabindex', '0')
  })

  it('can not be tabbed to when hidden', () => {
    const { container, store } = renderComponent()

    store.dispatch(closeReceived())

    expect(container.querySelector('iframe')).toHaveAttribute('tabindex', '-1')
  })

  it('renders the embeds for the web widget', async () => {
    renderComponent()

    const frameDocument = document.querySelector('iframe').contentDocument

    await waitFor(() => expect(getByTestId(frameDocument, 'web widget')).toBeInTheDocument())
  })

  it('respects zESettings for the zIndex css value', () => {
    const { store } = renderComponent()

    store.dispatch(
      updateSettings({
        webWidget: {
          zIndex: 100,
        },
      })
    )

    expect(document.querySelector('iframe')).toHaveStyle('z-index: 100')

    store.dispatch(
      updateSettings({
        webWidget: {
          zIndex: 200,
        },
      })
    )

    expect(document.querySelector('iframe')).toHaveStyle('z-index: 200')
  })

  it('takes up the whole screen when in popout mode', async () => {
    jest.spyOn(globalUtilities, 'isPopout').mockReturnValue(true)

    const { container, store } = renderComponent()

    store.dispatch(openReceived())

    await wait(() =>
      expect(container.querySelector('iframe')).toHaveStyle(`
      top: 0;
      bottom: 0;
      right: 0;
      left: 0;
    `)
    )
  })
})
