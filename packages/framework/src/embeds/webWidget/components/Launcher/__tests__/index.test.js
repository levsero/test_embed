import { getByRole, fireEvent } from '@testing-library/react'
import { renewToken } from 'src/redux/modules/base'
import * as baseSelectors from 'src/redux/modules/selectors/selectors'
import { updateSettings } from 'src/redux/modules/settings'
import { render } from 'src/util/testHelpers'
import Launcher from '../'

jest.mock('src/redux/modules/base')

describe('Opens a widget where you can find more information', () => {
  const defaultProps = {}

  const renderComponent = (props = {}) => render(<Launcher {...defaultProps} {...props} />)

  it('is not displayed when hidden', () => {
    jest.spyOn(baseSelectors, 'getFrameVisible').mockReturnValue(false)

    const { getByTitle } = renderComponent()

    expect(getByTitle('Opens a widget where you can find more information')).toHaveStyle(
      'visibility: hidden'
    )
  })

  it('is displayed when not hidden', () => {
    jest.spyOn(baseSelectors, 'getFrameVisible').mockReturnValue(true)

    const { getByTitle } = renderComponent()

    expect(getByTitle('Opens a widget where you can find more information')).not.toHaveStyle(
      'visibility: hidden'
    )
  })

  it('can be tabbed to when visible', () => {
    jest.spyOn(baseSelectors, 'getFrameVisible').mockReturnValue(true)

    const { getByTitle } = renderComponent()

    expect(getByTitle('Opens a widget where you can find more information')).toHaveAttribute(
      'tabindex',
      '0'
    )
  })

  it('can not be tabbed to when hidden', () => {
    jest.spyOn(baseSelectors, 'getFrameVisible').mockReturnValue(false)

    const { getByTitle } = renderComponent()

    expect(getByTitle('Opens a widget where you can find more information')).toHaveAttribute(
      'tabindex',
      '-1'
    )
  })

  it('respects zESettings for the zIndex css value', () => {
    const { getByTitle, store } = renderComponent()

    store.dispatch(
      updateSettings({
        webWidget: {
          zIndex: 100,
        },
      })
    )

    expect(getByTitle('Opens a widget where you can find more information')).toHaveStyle(
      'z-index: 99'
    )

    store.dispatch(
      updateSettings({
        webWidget: {
          zIndex: 200,
        },
      })
    )

    expect(getByTitle('Opens a widget where you can find more information')).toHaveStyle(
      'z-index: 199'
    )
  })

  it('renews auth tokens when clicked', () => {
    renewToken.mockReturnValue({ type: 'renew token' })
    const { getByTitle, store } = renderComponent()

    jest.spyOn(store, 'dispatch')

    store.dispatch(
      updateSettings({
        webWidget: {
          launcher: {
            label: {
              '*': 'Some text',
            },
          },
        },
      })
    )

    expect(
      getByRole(
        getByTitle('Opens a widget where you can find more information').contentDocument,
        'button',
        /Some text/
      )
    ).toBeInTheDocument()

    fireEvent.click(
      getByRole(
        getByTitle('Opens a widget where you can find more information').contentDocument,
        'button',
        /Some text/
      )
    )

    expect(store.dispatch).toHaveBeenCalledWith({ type: 'renew token' })
  })
})
