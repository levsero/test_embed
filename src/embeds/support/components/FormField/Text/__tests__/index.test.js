import React from 'react'
import { fireEvent } from '@testing-library/react'
import { render } from 'utility/testHelpers'
import Text from '../'

describe('Text', () => {
  const defaultProps = {
    field: {
      id: '123',
      required_in_portal: false,
      title_in_portal: 'Some title',
      description: 'Some description'
    },
    value: 'Some text',
    onChange: jest.fn(),
    errorMessage: null
  }

  const renderComponent = (props = {}) => render(<Text {...defaultProps} {...props} />)

  describe('when title exists', () => {
    it('displays the title', () => {
      const { queryByLabelText } = renderComponent({
        field: {
          ...defaultProps.field,
          title_in_portal: 'Some title',
          required_in_portal: true
        }
      })

      expect(queryByLabelText('Some title')).toBeInTheDocument()
    })

    it('displays the title with optional text when not required', () => {
      const { queryByLabelText } = renderComponent({
        field: {
          ...defaultProps.field,
          title_in_portal: 'Some title',
          required_in_portal: false
        }
      })

      expect(queryByLabelText('Some title (optional)')).toBeInTheDocument()
    })
  })

  it('does not display a label when title does not exist', () => {
    const { container } = renderComponent({
      field: {
        ...defaultProps.field,
        title_in_portal: null
      }
    })

    expect(container.querySelector('label')).toBeNull()
  })

  it('displays the fields description', () => {
    const { queryByText } = renderComponent({
      field: {
        ...defaultProps.field,
        description: 'Some description'
      }
    })

    expect(queryByText('Some description')).toBeInTheDocument()
  })

  it('displays the error message when provided', () => {
    const { queryByRole } = renderComponent({
      errorMessage: 'Something is wrong with the input'
    })

    expect(queryByRole('alert')).toHaveTextContent('Something is wrong with the input')
  })

  it('displays the current value', () => {
    const { queryByLabelText } = renderComponent({
      field: {
        ...defaultProps.field,
        title_in_portal: 'Some title',
        required_in_portal: true
      },
      value: 'Some text'
    })

    expect(queryByLabelText('Some title').value).toBe('Some text')
  })

  it('calls onChange when changed', () => {
    const onChange = jest.fn()

    const { queryByLabelText } = renderComponent({
      field: {
        ...defaultProps.field,
        title_in_portal: 'Some title',
        required_in_portal: true
      },
      value: 'Some text',
      onChange
    })

    const input = queryByLabelText('Some title')
    fireEvent.change(input, { target: { value: 'New value' } })

    expect(onChange).toHaveBeenCalledWith('New value')
  })
})
