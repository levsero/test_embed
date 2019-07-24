import React from 'react'
import { render } from '@testing-library/react'
import Header from '../index'

const defaultProps = {
  children: 'Hallo'
}

const renderComponent = modifiedProps => {
  const props = {
    ...defaultProps,
    ...modifiedProps
  }

  return render(<Header {...props} />)
}

describe('render', () => {
  let result

  beforeEach(() => {
    result = renderComponent()
  })

  it('renders children in props', () => {
    expect(result.queryByText('Hallo')).toBeInTheDocument()
  })

  it('matches default snapshot', () => {
    expect(result.container).toMatchSnapshot()
  })
})
