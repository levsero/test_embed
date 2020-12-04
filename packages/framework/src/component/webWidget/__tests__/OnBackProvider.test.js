import React from 'react'
import { render } from '@testing-library/react'
import OnBackProvider, { useOnBack } from 'component/webWidget/OnBackProvider'

describe('OnBackProvider', () => {
  const TestComponent = () => {
    const onBack = useOnBack()

    return (
      <button
        onClick={() => {
          onBack()
        }}
      >
        Click me
      </button>
    )
  }

  const defaultProps = {
    value: undefined
  }

  const renderComponent = (props = {}) =>
    render(
      <OnBackProvider {...defaultProps} {...props}>
        <TestComponent />
      </OnBackProvider>
    )

  it('provides the value prop via context', () => {
    const value = jest.fn()

    const { queryByText } = renderComponent({ value })

    queryByText('Click me').click()

    expect(value).toHaveBeenCalled()
  })
})
