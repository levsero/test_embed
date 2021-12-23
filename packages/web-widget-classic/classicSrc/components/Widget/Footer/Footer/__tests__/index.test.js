import FooterView, { padding, shadow } from 'classicSrc/components/Widget/Footer/FooterView'
import { TEST_IDS } from 'classicSrc/constants/shared'
import { render } from 'classicSrc/util/testHelpers'
import { find } from 'styled-components/test-utils'
import { Component as Footer } from '../'
import { Container } from '../styles'

describe('Footer', () => {
  const defaultProps = {
    hideZendeskLogo: false,
    children: <div>children</div>,
  }

  const renderComponent = (props = {}) => render(<Footer {...defaultProps} {...props} />)

  it('renders nothing when Zendesk logo is hidden and children are not provided', () => {
    const { container } = renderComponent({ hideZendeskLogo: true, children: null })

    expect(find(container, FooterView)).not.toBeInTheDocument()
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
      padding: ${padding({ size: 'large' })}
    `)
  })

  it('renders a small footer when children are not provided', () => {
    const { container } = renderComponent({ children: null })

    expect(find(container, FooterView)).toHaveStyle(`
      padding: ${padding({ size: 'small' })}
    `)
  })

  it('defaults to having a shadow', () => {
    const { container } = renderComponent({ children: <div>children</div> })
    expect(find(container, FooterView)).toHaveStyle(
      `
        box-shadow: ${shadow()};
      `
    )
  })

  it('can have its shadow hidden', () => {
    const { container } = renderComponent({ children: null, shadow: false })

    expect(find(container, FooterView)).not.toHaveStyle(`box-shadow: ${shadow()}`)
  })
})
