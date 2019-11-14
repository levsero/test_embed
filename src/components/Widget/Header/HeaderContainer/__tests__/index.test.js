import React from 'react'
import { render } from '@testing-library/react'
import HeaderContainer from '../'
import 'jest-styled-components'

describe('HeaderContainer', () => {
  const defaultProps = {
    children: <div>Some child component</div>
  }

  const renderComponent = (props = {}) => render(<HeaderContainer {...defaultProps} {...props} />)

  it('renders', () => {
    const { container } = renderComponent()

    expect(container.firstChild).toMatchSnapshot()
  })
})
