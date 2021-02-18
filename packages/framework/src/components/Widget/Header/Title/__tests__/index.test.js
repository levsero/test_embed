import React from 'react'
import { render } from '@testing-library/react'
import Title from '../'

describe('Title', () => {
  const defaultProps = {
    children: <div>Some child component</div>,
  }

  const renderComponent = (props = {}) => render(<Title {...defaultProps} {...props} />)

  it('renders', () => {
    const { container } = renderComponent()

    expect(container.firstChild).toMatchSnapshot()
  })
})
