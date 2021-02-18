import React from 'react'
import { render } from '@testing-library/react'
import TitleRow from '../'

describe('TitleRow', () => {
  const defaultProps = {
    children: <div>Some child component</div>,
  }

  const renderComponent = (props = {}) => render(<TitleRow {...defaultProps} {...props} />)

  it('renders', () => {
    const { container } = renderComponent()

    expect(container.firstChild).toMatchSnapshot()
  })
})
