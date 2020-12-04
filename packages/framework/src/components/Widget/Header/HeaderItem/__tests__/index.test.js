import React from 'react'
import { render } from '@testing-library/react'
import HeaderItem from '../'

describe('HeaderItem', () => {
  const defaultProps = {
    children: <div>Some child component</div>
  }

  const renderComponent = (props = {}) => render(<HeaderItem {...defaultProps} {...props} />)

  it('renders', () => {
    const { container } = renderComponent()

    expect(container.firstChild).toMatchSnapshot()
  })
})
