import React from 'react'
import { render } from '@testing-library/react'
import 'jest-styled-components'
import FooterView from '../'

describe('FooterView', () => {
  const defaultProps = {
    shadow: false,
    size: 'large'
  }

  const renderComponent = (props = {}) => render(<FooterView {...defaultProps} {...props} />)

  it('renders', () => {
    const { container } = renderComponent({ size: undefined })

    expect(container.firstChild).toMatchSnapshot()
  })

  it('renders with size = "small"', () => {
    const { container } = renderComponent({ size: 'small' })

    expect(container.firstChild).toMatchSnapshot()
  })

  it('renders with size = "minimal"', () => {
    const { container } = renderComponent({ size: 'minimal' })

    expect(container.firstChild).toMatchSnapshot()
  })

  it('renders with shadow = true', () => {
    const { container } = renderComponent({ shadow: true })

    expect(container.firstChild).toMatchSnapshot()
  })
})
