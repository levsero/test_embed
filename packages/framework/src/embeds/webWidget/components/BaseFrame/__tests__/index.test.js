import React from 'react'
import styled from 'styled-components'
import { getByText, wait } from '@testing-library/react'
import { render } from 'utility/testHelpers'
import { LOCALE_SET } from 'src/redux/modules/base/base-action-types'
import { i18n } from 'src/apps/webWidget/services/i18n'
import { getGardenOverrides } from 'component/frame/gardenOverrides'
import BaseFrame, { useFrameStyle } from '../'
import { waitFor } from '@testing-library/dom'

jest.mock('src/apps/webWidget/services/i18n')
jest.mock('component/frame/gardenOverrides')

jest.mock('components/Widget/WidgetThemeProvider', () => {
  return {
    __esModule: true,
    // eslint-disable-next-line react/prop-types
    default: ({ children }) => {
      return <div data-testid="widget-theme-provider">{children}</div>
    }
  }
})

describe('BaseFrame', () => {
  const defaultProps = {
    children: <div>children</div>,
    style: {},
    color: {},
    title: 'Some frame',
    ['data-testid']: 'frame'
  }

  const renderComponent = (props = {}) => {
    const helpers = render(<BaseFrame {...defaultProps} {...props} />)

    return {
      ...helpers,
      iFrameDocument: helpers.container.querySelector('iframe').contentDocument
    }
  }

  it("keeps frame's html document up to date with the latest locale", async () => {
    const { store, iFrameDocument } = renderComponent()

    store.dispatch({
      type: LOCALE_SET,
      payload: 'en-US'
    })
    i18n.isRTL.mockReturnValue(false)

    await wait(() => expect(getByText(iFrameDocument, 'children')).toBeInTheDocument())

    expect(iFrameDocument.querySelector('html')).toHaveAttribute('lang', 'en-US')
    expect(iFrameDocument.querySelector('html')).toHaveAttribute('dir', 'ltr')

    i18n.isRTL.mockReturnValue(true)
    store.dispatch({
      type: LOCALE_SET,
      payload: 'ar'
    })

    await wait(() => expect(iFrameDocument.querySelector('html')).toHaveAttribute('lang', 'ar'))
    expect(iFrameDocument.querySelector('html')).toHaveAttribute('dir', 'rtl')
  })

  it('provides the theme provider with rtl information', async () => {
    const SomeComponent = styled.div`
      background-color: ${props => (props.theme.rtl ? 'green' : 'blue')};
    `

    i18n.isRTL.mockReturnValue(false)

    let { iFrameDocument, rerender } = renderComponent({
      children: <SomeComponent>children</SomeComponent>
    })

    await wait(() => expect(getByText(iFrameDocument, 'children')).toBeInTheDocument())

    expect(getByText(iFrameDocument, 'children')).toHaveStyle('background-color: blue')

    i18n.isRTL.mockReturnValue(true)
    const secondRender = renderComponent(
      {
        children: <SomeComponent>children</SomeComponent>
      },
      { rerender }
    )

    await wait(() =>
      expect(getByText(secondRender.iFrameDocument, 'children')).toHaveStyle(
        'background-color: green'
      )
    )
  })

  it('includes overrides for Garden components', async () => {
    renderComponent({ color: { some: 'color' } })

    await waitFor(() => expect(getGardenOverrides).toHaveBeenCalledWith({ some: 'color' }))
  })

  it("includes the web widget's base styling", () => {
    const { getByTestId } = renderComponent()

    expect(getByTestId('widget-theme-provider')).toBeInTheDocument()
  })

  it('supports overriding iframe styles from within children components', async () => {
    const style = {
      backgroundColor: 'blue'
    }

    const SomeComponent = () => {
      useFrameStyle(style)

      return null
    }

    const { container } = renderComponent({
      children: <SomeComponent />
    })

    await wait(() =>
      expect(container.querySelector('iframe')).toHaveStyle('background-color: blue')
    )
  })
})
