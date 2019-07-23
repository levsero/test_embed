import Footer from '../index'
import React from 'react'
import { render } from '@testing-library/react'

const defaultProps = {}

const renderComponent = modifiedProps => {
  const props = {
    ...defaultProps,
    ...modifiedProps
  }

  return render(<Footer {...props}>{props.children}</Footer>)
}

describe('Footer', () => {
  let result, mockProps

  beforeEach(() => {
    mockProps = {
      children: <h1>Hello Fren</h1>
    }
  })

  it('renders the component', () => {
    result = renderComponent(mockProps)

    expect(result.queryByText('Hello Fren')).toBeInTheDocument()
  })

  it('matches default snapshot', () => {
    result = renderComponent(mockProps)

    expect(result.container).toMatchSnapshot()
  })

  describe('when scrollShadowVisible is true', () => {
    it('matches styled snapshots', () => {
      mockProps = {
        ...mockProps,
        scrollShadowVisible: true
      }

      result = renderComponent(mockProps)

      expect(result.container).toMatchSnapshot()
    })
  })
})
