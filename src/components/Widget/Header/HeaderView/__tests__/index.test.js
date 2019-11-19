import React from 'react'
import { render } from '@testing-library/react'
import HeaderView from '../'
import 'jest-styled-components'

describe('HeaderView', () => {
  const defaultProps = {
    children: <div>Some child component</div>
  }

  const renderComponent = (props = {}) => render(<HeaderView {...defaultProps} {...props} />)

  it('renders', () => {
    const { container } = renderComponent()

    expect(container.firstChild).toMatchSnapshot()
  })
})
