import React from 'react'
import { render } from '@testing-library/react'
import Main from '../index'

const defaultProps = {
  children: 'Hallo',
}

const renderComponent = (modifiedProps = {}) => {
  const props = {
    ...defaultProps,
    ...modifiedProps,
  }

  return render(<Main {...props} />)
}

describe('Main', () => {
  let result

  beforeEach(() => {
    result = renderComponent()
  })

  it('renders children', () => {
    expect(result.queryByText('Hallo')).toBeInTheDocument()
  })

  it('matches default snapshot', () => {
    expect(result.container).toMatchSnapshot()
  })
})
