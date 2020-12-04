import React from 'react'
import { fireEvent } from '@testing-library/dom'
import { render } from 'utility/testHelpers'
import FormField from '../'

describe('FormField', () => {
  const defaultProps = {
    field: {
      id: '123',
      type: 'text',
      required: true,
      title: 'Some title',
      description: 'Some description'
    },
    value: 'Something',
    onChange: jest.fn(),
    errorMessage: null
  }

  const renderComponent = (props = {}) => render(<FormField {...defaultProps} {...props} />)

  it('provides the field with the current value', () => {
    const { queryByLabelText } = renderComponent()

    expect(queryByLabelText('Some title')).toHaveValue('Something')
  })

  it('calls onChange when the value changes', () => {
    const onChange = jest.fn()

    const { queryByLabelText } = renderComponent({ onChange })

    fireEvent.change(queryByLabelText('Some title'), { target: { value: 'new' } })

    expect(onChange).toHaveBeenCalledWith('new')
  })

  it('displays an error message when errorMessage exists', () => {
    const { queryByRole } = renderComponent({ errorMessage: 'Some error message' })

    expect(queryByRole('alert')).toHaveTextContent('Some error message')
  })

  it('does not display an error message when errorMessage is null', () => {
    const { queryByRole } = renderComponent({ errorMessage: null })

    expect(queryByRole('alert')).not.toBeInTheDocument()
  })
})
