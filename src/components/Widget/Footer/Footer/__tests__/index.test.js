import React from 'react'
import { render } from '@testing-library/react'
import { find } from 'styled-components/test-utils'
import { Provider } from 'react-redux'
import 'jest-styled-components'
import { Component as Footer } from '../'
import FooterView, { padding } from 'components/Widget/Footer/FooterView'
import { Container } from '../styles'
import { TEST_IDS } from 'constants/shared'
import createStore from 'src/redux/createStore'

describe('Footer', () => {
  const defaultProps = {
    hideZendeskLogo: false,
    children: <div>children</div>
  }

  const renderComponent = (props = {}) =>
    render(
      <Provider store={createStore()}>
        <Footer {...defaultProps} {...props} />
      </Provider>
    )

  it('renders nothing when Zendesk logo is hidden and children are not provided', () => {
    const { container } = renderComponent({ hideZendeskLogo: true, children: null })

    expect(container.firstChild).not.toBeInTheDocument()
  })

  it('renders the Zendesk logo when it is not hidden', () => {
    const { queryByTestId } = renderComponent({ hideZendeskLogo: false })

    expect(queryByTestId(TEST_IDS.ICON_ZENDESK)).toBeInTheDocument()
  })

  it('does not render the Zendesk logo when it is hidden', () => {
    const { queryByTestId } = renderComponent({ hideZendeskLogo: true })

    expect(queryByTestId(TEST_IDS.ICON_ZENDESK)).not.toBeInTheDocument()
  })

  it('centers the logo when no other elements are in the footer', () => {
    const { container } = renderComponent({ children: null })

    expect(find(container, Container)).toHaveStyle(`
      justify-content: center;
      align-items: center;
    `)
  })

  it('aligns the children to the right when Zendesk logo is hidden', () => {
    const { container } = renderComponent({ hideZendeskLogo: true })

    expect(find(container, Container)).toHaveStyle(`
      justify-content: flex-end;
    `)
  })

  it('renders a large footer when children are provided', () => {
    const { container } = renderComponent({ children: <div>children</div> })

    expect(find(container, FooterView)).toHaveStyle(`
      padding: ${padding('large')}
    `)
  })

  it('renders a small footer when children are not provided', () => {
    const { container } = renderComponent({ children: null })

    expect(find(container, FooterView)).toHaveStyle(`
      padding: ${padding('small')}
    `)
  })
})
