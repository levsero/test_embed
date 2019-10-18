import { render } from 'utility/testHelpers'
import React from 'react'

import HelpCenterFooter from '../index'

const renderComponent = props => {
  const mergedProps = {
    isMobile: false,
    hideZendeskLogo: true,
    onClick: noop,
    showNextButton: false,
    ...props
  }

  return render(<HelpCenterFooter {...mergedProps} />)
}

describe('when on desktop', () => {
  it('renders empty footer when hideZendeskLogo is true and showNextButton is false', () => {
    const { queryByText, queryByTestId } = renderComponent()

    expect(queryByTestId('Icon--zendesk')).not.toBeInTheDocument()
    expect(queryByText('Leave us a message')).not.toBeInTheDocument()
  })

  it('does not render footerShadow when showNextButton is false', () => {
    const { container } = renderComponent()

    expect(container.querySelector('.footerShadow')).toBe(null)
  })

  it('renders zendesk logo when hideZendeskLogo is false', () => {
    const { queryByTestId } = renderComponent({ hideZendeskLogo: false })

    expect(queryByTestId('Icon--zendesk')).toBeInTheDocument()
  })

  it('renders button when showNextButton is true', () => {
    const { queryByText } = renderComponent({ showNextButton: true })

    expect(queryByText('Leave us a message')).toBeInTheDocument()
  })

  it('renders footerShadow when showNextButton is true', () => {
    const { container } = renderComponent({ showNextButton: true })

    expect(container.querySelector('.footerShadow')).not.toBe(null)
  })
})

describe('when on mobile', () => {
  it('renders empty footer when hideZendeskLogo is true and showNextButton is false', () => {
    const { queryByText, queryByTestId } = renderComponent({ isMobile: true })

    expect(queryByTestId('Icon--zendesk')).not.toBeInTheDocument()
    expect(queryByText('Leave us a message')).not.toBeInTheDocument()
  })

  it('does not render footerShadow when showNextButton is false', () => {
    const { container } = renderComponent({ isMobile: true })

    expect(container.querySelector('.footerShadow')).toBe(null)
  })

  it('does not render zendesk logo even when hideZendeskLogo is false', () => {
    const { queryByTestId } = renderComponent({ hideZendeskLogo: false, isMobile: true })

    expect(queryByTestId('Icon--zendesk')).not.toBeInTheDocument()
  })

  it('renders button when showNextButton is true', () => {
    const { queryByText } = renderComponent({ showNextButton: true, isMobile: true })

    expect(queryByText('Leave us a message')).toBeInTheDocument()
  })

  it('renders footerShadow when showNextButton is true', () => {
    const { container } = renderComponent({ showNextButton: true, isMobile: true })

    expect(container.querySelector('.footerShadow')).not.toBe(null)
  })
})
